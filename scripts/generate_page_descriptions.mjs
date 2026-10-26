#!/usr/bin/env node
/**
 * 資格ページの description を「ページ固有」に生成する。
 *
 * 背景:
 *   front matter に description が無い docs ページは、Docusaurus が h1 直後の
 *   最初のブロックを description に流用する。そのため `## 概要` のような見出し
 *   文字列がそのまま meta description になり、43 ページが「概要」、3 ページが
 *   「資格の対象」、2 ページが「対象者」という同一文言になっていた。
 *
 * 方針:
 *   - 本番 sitemap（＝検索公開対象）に載っている docs ページだけを対象にする。
 *   - 本文に実際に書かれている文だけを連結して 90〜135 字にする。推測・誇張・
 *     本文に無い数値は足さない（文の生成・要約はしない）。
 *   - 既に front matter に description があるページは触らない（冪等）。
 *   - 本文の主張・構成は変更しない。front matter への1行追記のみ。
 *   - 書き込み前に、front matter 以外が元ファイルと完全一致することを検証する。
 *
 * 使い方:
 *   node scripts/generate_page_descriptions.mjs --dry-run   # 生成結果を確認
 *   node scripts/generate_page_descriptions.mjs             # 書き込み
 *   node scripts/generate_page_descriptions.mjs --dry-run --verbose  # リード文の由来
 */
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DOCS = path.join(ROOT, 'docs');
const BUILD = path.join(ROOT, 'build');
const SITEMAP = path.join(BUILD, 'sitemap.xml');
const ORIGIN = 'https://shikaku.antonbase.com';
const MIN_LEN = 90;
const MAX_LEN = 135;

const args = new Set(process.argv.slice(2));
const dryRun = args.has('--dry-run');
const verbose = args.has('--verbose');

// ---------------------------------------------------------------- front matter

function splitFrontMatter(source) {
  const match = source.match(/^---(\r?\n)([\s\S]*?)\r?\n---((?:\r?\n)+|$)/);
  if (!match) {
    return {frontLines: null, afterFront: '', body: source, eol: '\n'};
  }
  return {
    frontLines: match[2].split(/\r?\n/),
    afterFront: match[3],
    body: source.slice(match[0].length),
    eol: match[1] === '\r\n' ? '\r\n' : '\n',
  };
}

function readFrontMatter(frontLines) {
  const map = {};
  if (!frontLines) return map;
  for (const line of frontLines) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) map[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, '');
  }
  return map;
}

// ------------------------------------------------------------------ text utils

function cleanInline(value) {
  return String(value)
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/[*_~>]/g, '')
    .replace(/[\u00a0\u3000]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 句点で文に分割する（句点は文末に残す）。 */
function splitSentences(text) {
  const output = [];
  let buffer = '';
  for (const char of text) {
    buffer += char;
    if (char === '。' || char === '！' || char === '？') {
      output.push(buffer.trim());
      buffer = '';
    }
  }
  if (buffer.trim()) output.push(buffer.trim());
  return output;
}

function stripSocialLabel(sentence) {
  return sentence.replace(/^【[^】]{1,30}】\s*/, '').trim();
}

const SKIP_SECTION = /^(公式情報|ハッシュタグ|出典|参考|関連|目次|参考文献)/;
const INTRO_SECTION = /^(概要|資格の対象|対象者|どんな資格|資格概要)/;
const DIFFICULTY_SECTION = /(難易度|学習|勉強|対策)/;
const DATE_HEAVY =
  /(20\d{2}年|令和|年度|日程|試験日|実施日|月\d{1,2}日|\d{1,2}月\d{1,2}日)/;
const GENERIC = /(確認してください|参照してください|ご覧ください|異なります|変わる|変動)/;
/** 助言・条件分岐の文は説明のリードにしない。 */
const ADVICE =
  /(のが近道|ましょう。|してください|迷っている場合|場合は、[^。]{0,40}(選ぶ|確認する|照合|判断)|照合してから)/;
/** 主語を前の文に依存する文は、説明の書き出しにしない。 */
const SUBJECTLESS =
  /^(出題は|日程は|実技は|筆記は|合格率は|結果は|第\d+回|既に|ここでいう|名称変更|また、|ただし|なお、|一方で|さらに)/;
/** ページ自身の構成に言及する文は説明に使わない。 */
const PAGE_META = /(このページ|本ページ|この記事|当ページ)/;

/** 本文から「説明に使える文」を文書順で取り出す。 */
function collectSentences(body) {
  const sections = [];
  let current = {heading: '', lines: []};
  for (const line of body.split(/\r?\n/)) {
    const heading = line.match(/^##\s+(.*)$/);
    if (heading) {
      sections.push(current);
      current = {heading: heading[1].trim(), lines: []};
    } else {
      current.lines.push(line);
    }
  }
  sections.push(current);

  const sentences = [];
  for (const section of sections) {
    if (section.heading && SKIP_SECTION.test(section.heading)) continue;

    // 見出し・表・箇条書き・HTML・画像行は説明文に混ぜない
    const prose = section.lines
      .filter((line) => {
        const trimmed = line.trim();
        if (!trimmed) return true;
        if (/^#{1,6}\s/.test(trimmed)) return false;
        if (/^\|/.test(trimmed)) return false;
        if (/^[-*+]\s/.test(trimmed)) return false;
        if (/^>/.test(trimmed)) return false;
        if (/^<[a-zA-Z/]/.test(trimmed)) return false;
        if (/^!\[/.test(trimmed)) return false;
        return true;
      })
      .join('\n');

    const sectionSentences = [];
    for (const paragraph of prose.split(/\n\s*\n/)) {
      const cleaned = cleanInline(paragraph.replace(/\r?\n/g, ' '));
      if (!cleaned) continue;
      for (const sentence of splitSentences(cleaned)) {
        const raw = sentence.trim();
        const value = stripSocialLabel(raw);
        if (value.length < 8) continue;
        if (/確認日|更新日|https?:\/\//.test(value)) continue;
        if (PAGE_META.test(value)) continue;
        sectionSentences.push({
          section: section.heading,
          text: value,
          hadLabel: /^【[^】]{1,30}】/.test(raw),
        });
      }
    }
    // 冒頭が【ラベル】で始まる概要は旧SNS投稿型の宣伝文なので、低優先に扱う。
    const social = sectionSentences.length > 0 && sectionSentences[0].hadLabel;
    for (const sentence of sectionSentences) {
      sentences.push({...sentence, social});
    }
  }
  return sentences;
}

/** 表から試験方式・受験資格などを取り出す。 */
function tableFacts(body) {
  const facts = {};
  const wanted = ['資格種別', '受験資格', '試験方式', '合格ライン', '試験時間'];
  for (const line of body.split(/\r?\n/)) {
    const match = line.match(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|/);
    if (!match) continue;
    const key = cleanInline(match[1]);
    const value = cleanInline(match[2]);
    if (!value || /^-+$/.test(value) || key === '項目' || key === '資格名') continue;
    if (wanted.includes(key) && !facts[key]) facts[key] = value;
  }
  return facts;
}

// -------------------------------------------------------------------- compose

/** タイトル表記ゆれ（副題・級・括弧）を落とした比較用の形。 */
function titleVariants(title) {
  const variants = new Set([title]);
  const base = title.replace(/（[^）]*）|\([^)]*\)/g, '').trim();
  if (base) variants.add(base);
  const short = base.replace(/\s*(1級|2級|3級|準1級|4級|I|II|III)$/u, '').trim();
  if (short) variants.add(short);
  return [...variants].filter((value) => value.length >= 3);
}

function makeClassifier(title) {
  const variants = titleVariants(title);
  const isDefinition = (text) =>
    variants.some((variant) => {
      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      return new RegExp(`^${escaped}(は|とは|は、|という)`).test(text);
    });

  return (sentence) => {
    const text = sentence.text;
    if (isDefinition(text)) return 'definition';
    if (sentence.social) return 'marketing';
    if (sentence.dateHeavy) return 'date';
    if (INTRO_SECTION.test(sentence.section)) return 'intro';
    if (ADVICE.test(text)) return 'generic';
    if (SUBJECTLESS.test(text)) return 'generic';
    if (DIFFICULTY_SECTION.test(sentence.section)) return 'difficulty';
    if (GENERIC.test(text)) return 'generic';
    return 'prose';
  };
}

const MIN_LENGTH_BY_KIND = {
  definition: 15,
  intro: 8,
  difficulty: 15,
  prose: 20,
  marketing: 8,
  generic: 20,
  date: 25,
};
const TARGET_LEN = 108;
const MARKETING_LEAD_MIN = 35;

/**
 * 本文から 90〜135 字の説明を組み立てる。
 *
 * 優先順位:
 *   1. タイトルを主語にした定義文（例:「◯◯は…です。」）
 *   2. 概要 / 資格の対象 セクションの文
 *   3. 旧SNS投稿型の概要（十分な長さがある場合のみリードに使う）
 *   4. その他の本文
 *   5. 表の試験方式・受験資格
 *   6. 難易度・学習セクション、日付中心の文
 */
function composeDescription({title, body, debug}) {
  const classify = makeClassifier(title);
  const tagged = collectSentences(body).map((sentence, index) => {
    const withMeta = {...sentence, index, dateHeavy: DATE_HEAVY.test(sentence.text)};
    return {...withMeta, kind: classify(withMeta)};
  });
  const facts = tableFacts(body);

  const parts = [];
  const used = new Set();
  let length = 0;

  /** 上限を超えないように1文を足す。途中で切ることはしない。 */
  const push = (text) => {
    let value = String(text).trim().replace(/^[、。，\s]+/, '');
    if (!value) return false;
    if (!/[。！？]$/.test(value)) value += '。';
    if (length + value.length > MAX_LEN) return false;
    parts.push(value);
    length += value.length;
    used.add(value);
    return true;
  };

  const pushSentences = (items) => {
    for (const sentence of items) {
      if (length >= TARGET_LEN) return;
      if (sentence.text.length < (MIN_LENGTH_BY_KIND[sentence.kind] ?? 20)) continue;
      if (used.has(sentence.text)) continue;
      push(sentence.text);
    }
  };

  const pushFacts = () => {
    for (const [key, build] of [
      ['試験方式', (value) => `試験方式は${value}。`],
      ['受験資格', (value) => `受験資格は${value}。`],
      ['資格種別', (value) => `資格種別は${value}。`],
    ]) {
      if (length >= MIN_LEN) return;
      const value = facts[key];
      if (value) push(build(value));
    }
  };

  const pool = (kind) => tagged.filter((sentence) => sentence.kind === kind);
  const marketingTotal = pool('marketing').reduce(
    (sum, sentence) => sum + sentence.text.length,
    0,
  );
  const marketingFirst = pool('marketing').find((sentence) => sentence.text.length >= 8);

  // 1) リード文
  const lead =
    pool('definition').find((sentence) => sentence.text.length >= 15) ??
    pool('intro').find((sentence) => sentence.text.length >= 8) ??
    (marketingTotal >= MARKETING_LEAD_MIN ? marketingFirst : undefined) ??
    pool('prose').find((sentence) => sentence.text.length >= 30) ??
    (marketingTotal >= 20 ? marketingFirst : undefined) ??
    pool('difficulty').find((sentence) => sentence.text.length >= 20) ??
    pool('date')[0] ??
    tagged[0];

  if (lead) {
    push(lead.text);
    if (debug) {
      console.log(`  lead(${lead.kind}) [${lead.section || '(冒頭)'}] ${lead.text.slice(0, 60)}`);
    }
  }

  // 2) リードと同じセクションの続き
  if (lead) {
    pushSentences(
      tagged.filter((sentence) => sentence.section === lead.section && sentence.index > lead.index),
    );
  }
  // 3) 概要セクションの残り
  pushSentences(pool('intro'));
  // 4) 表の事実
  pushFacts();
  // 5) 難易度・学習、その他の本文、日付中心の文
  for (const kind of ['difficulty', 'definition', 'prose', 'generic', 'date']) {
    if (length >= TARGET_LEN) break;
    pushSentences(pool(kind));
  }
  // 6) それでも足りなければ未使用の文を文書順で
  if (length < MIN_LEN) pushSentences(tagged);

  const description = parts.join('').trim();
  return {
    description,
    length: description.length,
    title,
    short: description.length < MIN_LEN,
  };
}

// ------------------------------------------------------------------------ main

async function walk(dir, output = []) {
  for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(absolute, output);
    else if (/\.mdx?$/.test(entry.name) && !entry.name.startsWith('_')) output.push(absolute);
  }
  return output;
}

function decodeXml(value) {
  return value.replaceAll('&amp;', '&').replaceAll('&lt;', '<').replaceAll('&gt;', '>');
}

async function sitemapRoutes() {
  let xml;
  try {
    xml = await fs.readFile(SITEMAP, 'utf8');
  } catch {
    throw new Error('build/sitemap.xml がありません。先に `npm run build` してください。');
  }
  const routes = new Set();
  for (const match of xml.matchAll(/<loc>([^<]*)<\/loc>/g)) {
    const url = new URL(decodeXml(match[1].trim()));
    if (url.origin !== ORIGIN) continue;
    routes.add(url.pathname);
  }
  return routes;
}

const routes = await sitemapRoutes();
const files = await walk(DOCS);

const results = [];
const skipped = {hasDescription: 0, notInSitemap: 0, noTitle: 0};

for (const file of files) {
  const relative = path.relative(DOCS, file).replace(/\\/g, '/');
  if (relative === 'intro.md' || /(^|\/)index\.mdx?$/.test(relative)) continue;

  const source = await fs.readFile(file, 'utf8');
  const {frontLines, afterFront, body, eol} = splitFrontMatter(source);
  const frontMatter = readFrontMatter(frontLines);
  const slug = frontMatter.slug
    ? String(frontMatter.slug).replace(/^\/+|\/+$/g, '')
    : relative.replace(/\.mdx?$/, '');
  const route = `/docs/${slug}/`;

  if (!routes.has(route)) {
    skipped.notInSitemap += 1;
    continue;
  }
  if (typeof frontMatter.description === 'string' && frontMatter.description.trim()) {
    skipped.hasDescription += 1;
    continue;
  }

  const title =
    frontMatter.title ||
    body.match(/^#\s+(.+)$/m)?.[1]?.trim() ||
    path.basename(file, path.extname(file));
  if (!title) {
    skipped.noTitle += 1;
    continue;
  }
  if (typeof body !== 'string' || body.trim().length === 0) {
    throw new Error(`本文が空のため中止: ${relative}`);
  }

  const composed = composeDescription({title, body, debug: verbose});
  results.push({file, relative, route, eol, frontLines, afterFront, source, body, ...composed});
}

// 同一 description が2ページ以上に出た場合は、固有化できていないので中止する
const byDescription = new Map();
for (const result of results) {
  const list = byDescription.get(result.description) ?? [];
  list.push(result.relative);
  byDescription.set(result.description, list);
}
const duplicated = [...byDescription.entries()].filter(([, list]) => list.length > 1);
if (duplicated.length) {
  for (const [description, list] of duplicated) {
    console.error('重複: ' + list.join(' / ') + ' -> ' + description.slice(0, 40) + '…');
  }
  throw new Error(`description が重複しています（${duplicated.length}組）。個別に直してください。`);
}

if (dryRun) {
  for (const result of results) {
    console.log(`\n--- ${result.relative}  (${result.length}字)`);
    console.log(result.description);
  }
} else {
  for (const result of results) {
    // 本文を壊さないための最終ガード
    if (typeof result.body !== 'string' || result.body.trim().length < 50) {
      throw new Error(`本文が想定外のため書き込みを中止: ${result.relative}`);
    }
    const escaped = result.description.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    const line = `description: "${escaped}"`;

    const frontLines = [...result.frontLines];
    const titleIndex = frontLines.findIndex((value) => /^title:\s/.test(value));
    if (titleIndex >= 0) frontLines.splice(titleIndex + 1, 0, line);
    else frontLines.push(line);

    const rebuild = (lines) =>
      '---' +
      result.eol +
      lines.join(result.eol) +
      result.eol +
      '---' +
      result.afterFront +
      result.body;

    // 追記した description 以外は元のファイルと完全一致することを確認する
    if (rebuild(result.frontLines) !== result.source) {
      throw new Error(`front matter 以外に差分が出るため中止: ${result.relative}`);
    }
    const rewritten = rebuild(frontLines);
    if (rewritten !== result.source) {
      await fs.writeFile(result.file, rewritten, 'utf8');
    }
  }
}

const lengths = results.map((result) => result.length).sort((a, b) => a - b);
const median = lengths.length ? lengths[Math.floor((lengths.length - 1) / 2)] : 0;
console.log(
  `${dryRun ? '[dry-run] ' : ''}description 生成: ${results.length}件 / ` +
    `字数 min=${lengths[0]} median=${median} max=${lengths[lengths.length - 1]} / ` +
    `90字未満=${results.filter((result) => result.short).length} / ` +
    `既存description保持=${skipped.hasDescription} / ` +
    `sitemap外スキップ=${skipped.notInSitemap}`,
);
if (verbose) {
  for (const result of results) {
    console.log(`${String(result.length).padStart(3)}  ${result.relative}`);
  }
}
