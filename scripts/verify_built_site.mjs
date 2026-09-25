import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const BUILD = path.join(ROOT, 'build');
const ORIGIN = 'https://shikaku.antonbase.com';

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

async function walk(dir, predicate) {
  const output = [];
  for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) output.push(...(await walk(absolute, predicate)));
    else if (!predicate || predicate(absolute)) output.push(absolute);
  }
  return output;
}

function fail(message) {
  throw new Error(message);
}

function parseAttrs(raw) {
  const attrs = {};
  for (const match of raw.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? '';
  }
  return attrs;
}

function tags(html, name) {
  const re = new RegExp('<' + name + '\\b([^>]*)>', 'gi');
  return [...html.matchAll(re)].map((match) => ({
    raw: match[0],
    attrs: parseAttrs(match[1]),
  }));
}

function jsonLdNodes(html) {
  const result = [];
  const re = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
  for (const match of html.matchAll(re)) {
    const attrs = parseAttrs(match[1]);
    if ((attrs.type || '').toLowerCase() !== 'application/ld+json') continue;
    try {
      result.push(JSON.parse(match[2].trim()));
    } catch (error) {
      fail('Invalid JSON-LD: ' + error.message);
    }
  }
  return result;
}

function hasType(value, wanted) {
  if (Array.isArray(value)) return value.some((item) => hasType(item, wanted));
  if (!value || typeof value !== 'object') return false;
  if (value['@type'] === wanted) return true;
  return Object.values(value).some((item) => hasType(item, wanted));
}

function decodeXml(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'");
}

function pageTarget(pathname) {
  let decoded;
  try {
    decoded = decodeURIComponent(pathname);
  } catch {
    decoded = pathname;
  }
  const clean = decoded.replace(/^\/+/, '');
  if (!clean) return path.join(BUILD, 'index.html');
  if (path.extname(clean)) return path.join(BUILD, clean);
  return path.join(BUILD, clean, 'index.html');
}

function assetTarget(urlValue) {
  let value = urlValue;
  try {
    const url = new URL(urlValue, ORIGIN);
    if (url.origin !== ORIGIN) return null;
    value = url.pathname;
  } catch {
    return null;
  }
  return path.join(BUILD, decodeURIComponent(value).replace(/^\/+/, ''));
}

async function verifyPage(pathname, options = {}) {
  const target = pageTarget(pathname);
  if (!(await exists(target))) fail('Missing generated page: ' + pathname);
  const html = await fs.readFile(target, 'utf8');

  const canonicals = tags(html, 'link')
    .filter((tag) => tag.attrs.rel === 'canonical')
    .map((tag) => tag.attrs.href);
  if (canonicals.length !== 1) {
    fail('Expected exactly one canonical for ' + pathname + ': ' + canonicals.join(', '));
  }
  const expectedCanonical = ORIGIN + pathname;
  if (canonicals[0] !== expectedCanonical) {
    fail('Canonical mismatch for ' + pathname + ': ' + canonicals[0]);
  }
  if (canonicals[0].includes('pages.dev')) {
    fail('pages.dev canonical leaked: ' + pathname);
  }

  const robots = tags(html, 'meta')
    .filter((tag) => (tag.attrs.name || '').toLowerCase() === 'robots')
    .map((tag) => tag.attrs.content || '');
  if (options.noindex && !robots.some((value) => /\bnoindex\b/i.test(value))) {
    fail('Expected noindex: ' + pathname);
  }
  if (options.indexable && robots.some((value) => /\bnoindex\b/i.test(value))) {
    fail('Unexpected noindex: ' + pathname);
  }

  const nodes = jsonLdNodes(html);
  for (const type of options.schemaTypes || []) {
    if (!nodes.some((node) => hasType(node, type))) {
      fail('Missing JSON-LD type ' + type + ': ' + pathname);
    }
  }

  return html;
}

if (!(await exists(BUILD))) fail('build directory does not exist');

const sitemapXml = await fs.readFile(path.join(BUILD, 'sitemap.xml'), 'utf8');
const sitemapUrls = [...sitemapXml.matchAll(/<loc>([\s\S]*?)<\/loc>/g)].map((m) =>
  decodeXml(m[1].trim()),
);
if (!sitemapUrls.length) fail('sitemap.xml contains no URLs');

const sitemapSet = new Set(sitemapUrls);
for (const rawUrl of sitemapUrls) {
  const url = new URL(rawUrl);
  if (url.origin !== ORIGIN) fail('Unexpected sitemap origin: ' + rawUrl);
  if (!url.pathname.endsWith('/')) fail('Sitemap URL missing trailing slash: ' + rawUrl);
  if (!(await exists(pageTarget(url.pathname)))) {
    fail('Sitemap URL has no generated page: ' + rawUrl);
  }
}

const requiredInSitemap = [
  '/',
  '/docs/business/',
  '/docs/technology/',
  '/docs/legal-accounting/',
  '/docs/medical-welfare/',
  '/docs/safety-environment/',
  '/docs/creative/',
  '/docs/lifestyle/',
  '/docs/industry/',
  '/docs/technology/General/mos/',
  '/blog/mos-qualification-guide/',
];
for (const pathname of requiredInSitemap) {
  if (!sitemapSet.has(ORIGIN + pathname)) {
    fail('Expected sitemap URL missing: ' + pathname);
  }
}
if (sitemapSet.has(ORIGIN + '/explore/')) {
  fail('/explore/ must not be in sitemap');
}

const home = await verifyPage('/', {
  indexable: true,
  schemaTypes: ['WebSite', 'CollectionPage', 'ItemList'],
});
if (home.includes('/field/')) fail('Obsolete /field/ link leaked into homepage HTML');
if (home.includes('"SearchAction"') || home.includes("'SearchAction'")) {
  fail('Deprecated SearchAction leaked into homepage');
}

await verifyPage('/explore/', {noindex: true});

for (const pathname of [
  '/docs/business/',
  '/docs/technology/',
  '/docs/legal-accounting/',
  '/docs/medical-welfare/',
  '/docs/safety-environment/',
  '/docs/creative/',
  '/docs/lifestyle/',
  '/docs/industry/',
]) {
  await verifyPage(pathname, {
    indexable: true,
    schemaTypes: ['CollectionPage', 'ItemList'],
  });
}

for (const pathname of [
  '/docs/technology/General/digital/it-passport-i-pass/',
  '/docs/technology/General/kihon-jouhou-gijutsusha-fe/',
  '/docs/business/Finance/fudousan/takuchi-tatemono-torihikishi-takkenshi/',
  '/docs/legal-accounting/Accounting/kaikei/nisshou-boki-2kyuu-3kyuu-1kyuu/',
  '/docs/legal-accounting/Legal/shigyou/gyousei-shoshi/',
  '/docs/business/Finance/fudousan/fp-ginoushi-3kyuu-2kyuu-1kyuu/',
  '/docs/technology/General/mos/',
  '/docs/lifestyle/Language/eigo/toeic-l-r-800/',
]) {
  await verifyPage(pathname, {
    indexable: true,
    schemaTypes: ['WebPage', 'EducationalOccupationalCredential', 'BreadcrumbList'],
  });
}

const mosBlog = await verifyPage('/blog/mos-qualification-guide/', {
  indexable: true,
  schemaTypes: ['BlogPosting'],
});
const blogImageMetas = tags(mosBlog, 'meta').filter((tag) =>
  ['og:image', 'twitter:image'].includes(
    (tag.attrs.property || tag.attrs.name || '').toLowerCase(),
  ),
);
for (const meta of blogImageMetas) {
  const target = assetTarget(meta.attrs.content);
  if (target && !(await exists(target))) {
    fail('Blog social image is missing: ' + meta.attrs.content);
  }
}

const htmlFiles = await walk(BUILD, (file) => file.endsWith('.html'));
for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  for (const tag of tags(html, 'a')) {
    const href = tag.attrs.href;
    if (!href || !href.startsWith('/') || href.startsWith('//')) continue;

    const pathname = href.split(/[?#]/, 1)[0];
    if (!pathname || pathname === '/') continue;
    const target = pageTarget(pathname);
    if (!(await exists(target))) {
      fail(
        'Broken internal link: ' +
          path.relative(BUILD, file) +
          ' -> ' +
          href,
      );
    }
  }

  for (const tag of tags(html, 'meta')) {
    const key = (tag.attrs.property || tag.attrs.name || '').toLowerCase();
    if (!['og:image', 'twitter:image'].includes(key)) continue;
    const target = assetTarget(tag.attrs.content);
    if (target && !(await exists(target))) {
      fail(
        'Missing social image: ' +
          path.relative(BUILD, file) +
          ' -> ' +
          tag.attrs.content,
      );
    }
  }
}

console.log(
  'Built-site verification: OK (' +
    htmlFiles.length +
    ' HTML files, ' +
    sitemapUrls.length +
    ' sitemap URLs)',
);
