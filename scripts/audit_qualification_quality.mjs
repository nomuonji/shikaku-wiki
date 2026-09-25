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

function stripFrontMatter(source) {
  if (!source.startsWith('---')) return source;
  const end = source.indexOf('\n---', 3);
  return end === -1 ? source : source.slice(end + 4).trim();
}

function scoreDoc(source, file) {
  const body = stripFrontMatter(source);
  const text = body.replace(/\s+/g, ' ').trim();
  const sections = [...body.matchAll(/^##\s+(.+)$/gm)].map((match) => match[1].trim());
  const official = /##\s*公式情報/.test(body) && /https?:\/\//.test(body);
  const overview = /##\s*概要/.test(body);
  const exam = /##\s*試験詳細|試験方式|受験料|受験資格/.test(body);
  const learning = /学習範囲|シラバス|勉強法|実務|活か/.test(body);
  const difficulty = /難易度|勉強時間|学習時間/.test(body);
  const freshness = /確認日|2026年|2026年度|令和8年/.test(body);
  const table = /^\|.+\|$/m.test(body);
  const hasTitle = /^#\s+.+$/m.test(body);
  const unlisted = /^unlisted:\s*true\s*$/mi.test(source);

  let score = 0;
  if (hasTitle) score += 5;
  if (overview) score += 12;
  if (exam) score += 15;
  if (learning) score += 10;
  if (difficulty) score += 12;
  if (official) score += 18;
  if (freshness) score += 8;
  if (table) score += 5;
  if (sections.length >= 5) score += 8;
  else if (sections.length >= 3) score += 4;
  if (text.length >= 1800) score += 7;
  else if (text.length >= 900) score += 4;

  const issues = [];
  if (!overview) issues.push('概要なし');
  if (!exam) issues.push('試験詳細が弱い');
  if (!difficulty) issues.push('難易度/学習目安なし');
  if (!official) issues.push('公式URLなし');
  if (text.length < 700) issues.push('本文が薄い');
  if (sections.length < 3) issues.push('セクション不足');
  if (unlisted) issues.push('unlisted（公開カタログ対象外）');

  return {
    file: path.relative(ROOT, file).replace(/\\/g, '/'),
    score: Math.min(100, score),
    grade: score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 50 ? 'C' : 'D',
    chars: text.length,
    sections: sections.length,
    unlisted,
    issues,
  };
}

const files = (await walk(DOCS)).filter((file) => path.basename(file) !== 'intro.md');
const results = [];
for (const file of files) {
  const source = await fs.readFile(file, 'utf8');
  results.push(scoreDoc(source, file));
}
results.sort((a, b) => a.score - b.score || a.file.localeCompare(b.file));

const grades = results.reduce((acc, item) => {
  acc[item.grade] = (acc[item.grade] || 0) + 1;
  return acc;
}, {});
const average = results.length ? Math.round(results.reduce((sum, item) => sum + item.score, 0) / results.length) : 0;
const summary = {
  generatedAt: new Date().toISOString(),
  count: results.length,
  average,
  grades,
  below50: results.filter((item) => item.score < 50).length,
  below70: results.filter((item) => item.score < 70).length,
  unlisted: results.filter((item) => item.unlisted).length,
};

console.log('資格記事 品質監査');
console.log('対象: ' + summary.count + '件 / 平均: ' + summary.average + '点 / A:' + (grades.A || 0) + ' B:' + (grades.B || 0) + ' C:' + (grades.C || 0) + ' D:' + (grades.D || 0));
console.log('70点未満: ' + summary.below70 + '件 / 50点未満: ' + summary.below50 + '件 / unlisted: ' + summary.unlisted + '件');
console.log('\n改善優先度 上位20件');
for (const item of results.slice(0, 20)) {
  console.log(String(item.score).padStart(3) + ' [' + item.grade + '] ' + item.file + ' — ' + (item.issues.join(' / ') || '問題なし'));
}

if (report) {
  await fs.mkdir(REPORTS, {recursive: true});
  await fs.writeFile(path.join(REPORTS, 'qualification-quality.json'), JSON.stringify({summary, results}, null, 2) + '\n', 'utf8');
}

if (strict && results.some((item) => item.score < 50)) {
  console.error('\nSTRICT: 50点未満の記事が残っています。');
  process.exitCode = 1;
}
