import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();

async function read(relativePath) {
  return fs.readFile(path.join(ROOT, relativePath), 'utf8');
}

async function exists(relativePath) {
  try {
    await fs.access(path.join(ROOT, relativePath));
    return true;
  } catch {
    return false;
  }
}

function fail(message, failures) {
  failures.push(message);
}

const failures = [];
const [home, plugin, config, redirects, explorer] = await Promise.all([
  read('src/pages/index.tsx'),
  read('plugins/qualification-index/index.mjs'),
  read('docusaurus.config.ts'),
  read('static/_redirects'),
  read('src/components/QualificationExplorer.tsx'),
]);

// 廃止した /field/* は redirect の正本以外へ戻さない。
for (const [name, source] of [
  ['ホーム', home],
  ['資格インデックスplugin', plugin],
  ['Docusaurus設定', config],
]) {
  if (source.includes('/field/')) {
    fail(`${name} に廃止済み /field/* 参照が残っています`, failures);
  }
}

const categoryKeys = [
  'business',
  'technology',
  'legal-accounting',
  'medical-welfare',
  'lifestyle',
  'safety-environment',
  'creative',
  'industry',
];

for (const key of categoryKeys) {
  if (!(await exists(`docs/${key}/index.mdx`))) {
    fail(`docs/${key}/index.mdx がありません`, failures);
  }
  if (!(await exists(`docs/${key}/_category_.json`))) {
    fail(`docs/${key}/_category_.json がありません`, failures);
  }
  if (!home.includes(`to: '/docs/${key}/'`)) {
    fail(`ホームの ${key} 導線が canonical /docs URL ではありません`, failures);
  }

  const oldNoSlash = `/field/${key} /docs/${key}/ 301`;
  const oldSlash = `/field/${key}/ /docs/${key}/ 301`;
  if (!redirects.includes(oldNoSlash) || !redirects.includes(oldSlash)) {
    fail(`旧 /field/${key} の301が不足しています`, failures);
  }
}

for (const key of [...categoryKeys, 'etc']) {
  const oldNoSlash = `/field/${key} /docs/${key}/ 301`;
  const oldSlash = `/field/${key}/ /docs/${key}/ 301`;
  if (!redirects.includes(oldNoSlash) || !redirects.includes(oldSlash)) {
    fail(`旧 /field/${key} の301が不足しています`, failures);
  }
}

// ホームで直接紹介する資格リンクは実ファイルを必ず持つ。
const docLinks = [...home.matchAll(/to:\s*['"](\/docs\/[^'"]+)['"]/g)].map(
  (match) => match[1],
);
for (const route of new Set(docLinks)) {
  const clean = route.replace(/^\/docs\//, '').replace(/\/+$/, '');
  const candidates = [
    `docs/${clean}.md`,
    `docs/${clean}.mdx`,
    `docs/${clean}/index.md`,
    `docs/${clean}/index.mdx`,
  ];
  const checks = await Promise.all(candidates.map(exists));
  if (!checks.some(Boolean)) {
    fail(`ホームの内部リンク ${route} に対応するdocがありません`, failures);
  }
  if (!route.endsWith('/')) {
    fail(`ホームの内部リンク ${route} が trailingSlash canonical ではありません`, failures);
  }
}

// 資格検索はユーザー機能だが検索結果ページとしてindexさせない。
if (!explorer.includes('content="noindex,follow"')) {
  fail('/explore が noindex,follow ではありません', failures);
}
if (!config.includes("'/explore'") || !config.includes("'/explore/**'")) {
  fail('/explore が sitemap ignorePatterns から漏れています', failures);
}
if (home.includes('SearchAction')) {
  fail('終了済みのサイトリンク検索ボックス用 SearchAction が残っています', failures);
}

// カテゴリindexや非公開ストックを資格1件として検索DBへ混ぜない。
if (!plugin.includes("/(^|\\/)index\\.mdx?$/")) {
  fail('資格インデックスがカテゴリ index.mdx を除外していません', failures);
}
if (!plugin.includes('frontMatter.unlisted') || !plugin.includes('frontMatter.draft')) {
  fail('資格インデックスが unlisted/draft を除外していません', failures);
}
if (!plugin.includes("return clean ? `/docs/${clean}/` : '/docs/';")) {
  fail('資格ルート生成が trailingSlash canonical ではありません', failures);
}

if (failures.length) {
  console.error('サイト構造監査: FAIL');
  for (const message of failures) console.error('- ' + message);
  process.exit(1);
}

console.log('サイト構造監査: OK');
console.log('- /docs カテゴリ正本 + /field 301 を確認');
console.log('- ホーム主要内部リンクの実在と trailing slash を確認');
console.log('- /explore noindex + sitemap除外を確認');
console.log('- unlisted/draft/index.mdx の検索DB除外を確認');
