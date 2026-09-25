import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DOCS = path.join(ROOT, 'docs');
const REPORTS = path.join(ROOT, 'reports');
const args = new Set(process.argv.slice(2));
const strict = args.has('--strict');
const report = args.has('--report');

async function walk(dir) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(absolute)));
    else if (/\.mdx?$/.test(entry.name) && !entry.name.startsWith('_')) files.push(absolute);
  }
  return files;
}

function parseFrontMatter(source) {
  if (!source.startsWith('---')) return {frontMatter: {}, body: source};
  const end = source.indexOf('\n---', 3);
  if (end === -1) return {frontMatter: {}, body: source};

  const frontMatter = {};
  const block = source.slice(3, end).trim();
  for (const line of block.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    frontMatter[key] = rawValue.trim().replace(/^['"]|['"]$/g, '');
  }
  return {frontMatter, body: source.slice(end + 4).trim()};
}

function toIsoDate(year, month, day) {
  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');
}

function extractVerifiedAt(frontMatter, body) {
  const explicit = String(frontMatter.verified_at || '').trim();
  if (/^20\d{2}-\d{2}-\d{2}$/.test(explicit)) return explicit;

  const label = '(?:制度確認日|確認日|更新日)';
  const jp = body.match(new RegExp(
    label + '\\s*[：:]\\s*(20\\d{2})年\\s*(\\d{1,2})月\\s*(\\d{1,2})日'
  ));
  if (jp) return toIsoDate(jp[1], jp[2], jp[3]);

  const iso = body.match(new RegExp(
    label + '\\s*[：:]\\s*(20\\d{2})-(\\d{1,2})-(\\d{1,2})'
  ));
  if (iso) return toIsoDate(iso[1], iso[2], iso[3]);

  return null;
}

function normalizeTitle(value) {
  return String(value || '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s　]+/g, '')
    .replace(/[・･]/g, '・')
    .trim();
}

function scoreDoc(source, file) {
  const {frontMatter, body} = parseFrontMatter(source);
  const text = body.replace(/\s+/g, ' ').trim();
  const sections = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
  const title =
    frontMatter.title ||
    body.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
    path.basename(file, path.extname(file));

  const official = /##\s*公式情報/.test(body) && /https?:\/\//.test(body);
  const overview = /##\s*概要/.test(body);
  const exam = /##\s*試験詳細|試験方式|受験料|受験資格|取得の流れ|講習/.test(body);
  const learning = /学習範囲|シラバス|勉強法|実務|活か|業務|試験科目/.test(body);
  const difficulty = /難易度|勉強時間|学習時間|競争試験型ではありません/.test(body);
  const verifiedAt = extractVerifiedAt(frontMatter, body);
  const freshness = Boolean(verifiedAt);
  const table = /^\|.+\|$/m.test(body);
  const hasTitle = /^#\s+.+$/m.test(body);
  const unlisted =
    String(frontMatter.unlisted ?? '').toLowerCase() === 'true' ||
    String(frontMatter.draft ?? '').toLowerCase() === 'true';
  const hasDescription =
    typeof frontMatter.description === 'string' &&
    frontMatter.description.trim().length >= 45;
  const legacySocialCopy =
    /##\s*ハッシュタグ/.test(body) ||
    /##\s*概要\s*\n+\s*【[^】]+】/.test(body);
  const riskyClaims = [
    /超人気/,
    /必須級/,
    /最も一般的/,
    /合格率\s*\d+(?:\.\d+)?%?\s*(?:前後|程度)?(?:と言われ|といわれ)/,
    /(?:勉強時間|学習時間)[^\n]{0,30}\d+\s*[～〜~-]\s*\d+\s*時間[^\n]{0,25}(?:目安|程度)/,
  ].filter((pattern) => pattern.test(body)).length;

  let score = 0;
  if (hasTitle) score += 5;
  if (overview) score += 12;
  if (exam) score += 15;
  if (learning) score += 10;
  if (difficulty) score += 12;
  if (official) score += 18;
  if (freshness) score += 8;
  if (table) score += 5;
  if (hasDescription) score += 5;
  if (sections.length >= 5) score += 8;
  else if (sections.length >= 3) score += 4;
  if (text.length >= 1800) score += 7;
  else if (text.length >= 900) score += 4;
  if (legacySocialCopy && text.length < 1200) score -= 8;
  if (riskyClaims > 0) score -= Math.min(6, riskyClaims * 2);

  score = Math.max(0, Math.min(100, score));

  const issues = [];
  if (!overview) issues.push('概要なし');
  if (!exam) issues.push('試験詳細・取得方法が弱い');
  if (!difficulty) issues.push('難易度/学習目安なし');
  if (!official) issues.push('公式URLなし');
  if (!freshness) issues.push('鮮度確認なし');
  if (!hasDescription) issues.push('description不足');
  if (text.length < 700) issues.push('本文が薄い');
  if (sections.length < 3) issues.push('セクション不足');
  if (legacySocialCopy) issues.push('旧SNS投稿型の構成');
  if (riskyClaims > 0) issues.push('根拠確認が必要な断定/数値表現');
  if (unlisted) issues.push('unlisted（公開カタログ対象外）');

  return {
    file: path.relative(ROOT, file).replace(/\\/g, '/'),
    title,
    normalizedTitle: normalizeTitle(title),
    score,
    grade: score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D',
    chars: text.length,
    sections: sections.length,
    hasDescription,
    freshness,
    verifiedAt,
    qualificationStatus: frontMatter.qualification_status || '',
    legacySocialCopy,
    riskyClaims,
    unlisted,
    issues,
  };
}

const files = (await walk(DOCS)).filter((file) => !['intro.md', 'index.md', 'index.mdx'].includes(path.basename(file)));
const results = [];
for (const file of files) {
  const source = await fs.readFile(file, 'utf8');
  results.push(scoreDoc(source, file));
}
results.sort((a, b) => a.score - b.score || a.file.localeCompare(b.file));

const publicResults = results.filter((item) => !item.unlisted);
const hiddenResults = results.filter((item) => item.unlisted);
const grades = publicResults.reduce((acc, item) => {
  acc[item.grade] = (acc[item.grade] || 0) + 1;
  return acc;
}, {});

const titleGroups = new Map();
for (const item of publicResults) {
  if (!item.normalizedTitle) continue;
  const list = titleGroups.get(item.normalizedTitle) ?? [];
  list.push(item);
  titleGroups.set(item.normalizedTitle, list);
}
const duplicateTitles = [...titleGroups.values()]
  .filter((group) => group.length > 1)
  .map((group) => ({
    title: group[0].title,
    files: group.map((item) => item.file),
  }));

const activePublishFailures = publicResults
  .filter((item) => item.qualificationStatus === 'active')
  .map((item) => {
    const failures = [];
    if (!item.hasDescription) failures.push('description不足');
    if (!item.verifiedAt) failures.push('制度確認日なし');
    if (item.issues.includes('公式URLなし')) failures.push('公式URLなし');
    if (item.chars < 900) failures.push('本文900字未満');
    if (item.sections < 3) failures.push('セクション3未満');
    return {...item, publishFailures: failures};
  })
  .filter((item) => item.publishFailures.length);

const average = publicResults.length
  ? Math.round(
      publicResults.reduce((sum, item) => sum + item.score, 0) /
        publicResults.length,
    )
  : 0;

const summary = {
  generatedAt: new Date().toISOString(),
  sourceCount: results.length,
  publicCount: publicResults.length,
  hiddenCount: hiddenResults.length,
  average,
  grades,
  publicBelow50: publicResults.filter((item) => item.score < 50).length,
  publicBelow70: publicResults.filter((item) => item.score < 70).length,
  missingDescription: publicResults.filter((item) => !item.hasDescription).length,
  freshnessMissing: publicResults.filter((item) => !item.freshness).length,
  legacySocialCopy: publicResults.filter((item) => item.legacySocialCopy).length,
  riskyClaims: publicResults.filter((item) => item.riskyClaims > 0).length,
  duplicateTitleGroups: duplicateTitles.length,
  activePublishFailures: activePublishFailures.length,
};

console.log('資格記事 品質監査');
console.log(
  '正本: ' +
    summary.sourceCount +
    '件 / 公開: ' +
    summary.publicCount +
    '件 / 非公開: ' +
    summary.hiddenCount +
    '件',
);
console.log(
  '公開平均: ' +
    summary.average +
    '点 / A:' +
    (grades.A || 0) +
    ' B:' +
    (grades.B || 0) +
    ' C:' +
    (grades.C || 0) +
    ' D:' +
    (grades.D || 0),
);
console.log(
  '公開70点未満: ' +
    summary.publicBelow70 +
    '件 / description不足: ' +
    summary.missingDescription +
    '件 / 鮮度確認なし: ' +
    summary.freshnessMissing +
    '件',
);
console.log(
  'active公開ゲート違反: ' +
    summary.activePublishFailures +
    '件',
);
console.log(
  '旧SNS投稿型: ' +
    summary.legacySocialCopy +
    '件 / 要根拠確認表現: ' +
    summary.riskyClaims +
    '件 / 重複タイトル群: ' +
    summary.duplicateTitleGroups +
    '件',
);

console.log('\n公開ページ 改善優先度 上位30件');
for (const item of publicResults.slice(0, 30)) {
  console.log(
    String(item.score).padStart(3) +
      ' [' +
      item.grade +
      '] ' +
      item.file +
      ' — ' +
      (item.issues.join(' / ') || '問題なし'),
  );
}

if (activePublishFailures.length) {
  console.log('\nactive公開ゲート違反');
  for (const item of activePublishFailures) {
    console.log('- ' + item.file + ' — ' + item.publishFailures.join(' / '));
  }
}

if (duplicateTitles.length) {
  console.log('\n重複タイトル候補');
  for (const group of duplicateTitles.slice(0, 20)) {
    console.log('- ' + group.title + ': ' + group.files.join(' / '));
  }
}

if (report) {
  await fs.mkdir(REPORTS, {recursive: true});
  const payload = {summary, duplicateTitles, activePublishFailures, results};
  await fs.writeFile(
    path.join(REPORTS, 'qualification-quality.json'),
    JSON.stringify(payload, null, 2) + '\n',
    'utf8',
  );

  const markdown = [
    '# 資格記事 品質監査',
    '',
    '- 生成: ' + summary.generatedAt,
    '- 正本: ' + summary.sourceCount + '件',
    '- 公開: ' + summary.publicCount + '件',
    '- 非公開: ' + summary.hiddenCount + '件',
    '- 公開平均: ' + summary.average + '点',
    '- 公開70点未満: ' + summary.publicBelow70 + '件',
    '- description不足: ' + summary.missingDescription + '件',
    '- 鮮度確認なし: ' + summary.freshnessMissing + '件',
    '- 旧SNS投稿型: ' + summary.legacySocialCopy + '件',
    '- 要根拠確認表現: ' + summary.riskyClaims + '件',
    '- 重複タイトル群: ' + summary.duplicateTitleGroups + '件',
    '- active公開ゲート違反: ' + summary.activePublishFailures + '件',
    '',
    '## 改善優先度 上位50件',
    '',
    '| 点 | 記事 | 問題 |',
    '| ---: | --- | --- |',
    ...publicResults.slice(0, 50).map(
      (item) =>
        '| ' +
        item.score +
        ' | `' +
        item.file +
        '` | ' +
        (item.issues.join(' / ') || '問題なし') +
        ' |',
    ),
    '',
    '## 重複タイトル候補',
    '',
    ...(duplicateTitles.length
      ? duplicateTitles.flatMap((group) => [
          '### ' + group.title,
          '',
          ...group.files.map((file) => '- `' + file + '`'),
          '',
        ])
      : ['該当なし。', '']),
  ].join('\n');

  await fs.writeFile(
    path.join(REPORTS, 'qualification-quality.md'),
    markdown + '\n',
    'utf8',
  );
}

if (activePublishFailures.length) {
  console.error(
    '\nPUBLISH GATE: active指定ページに公開必須条件の不足が ' +
      activePublishFailures.length +
      ' 件あります。',
  );
  process.exitCode = 1;
}

if (strict) {
  const failures = publicResults.filter((item) => item.score < 70);
  if (failures.length) {
    console.error(
      '\nSTRICT: 公開ページに70点未満の記事が ' +
        failures.length +
        ' 件残っています。',
    );
    process.exitCode = 1;
  }
}
