import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const BUILD = path.join(ROOT, 'build');
const ORIGIN = 'https://shikaku.antonbase.com';
const SITEMAP = path.join(BUILD, 'sitemap.xml');

function parseAttrs(raw) {
  const attrs = {};
  for (const match of raw.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) {
    attrs[match[1].toLowerCase()] = match[2] ?? match[3] ?? '';
  }
  return attrs;
}

function hasNoindex(html) {
  for (const match of html.matchAll(/<meta\b([^>]*)>/gi)) {
    const attrs = parseAttrs(match[1]);
    if ((attrs.name || '').toLowerCase() !== 'robots') continue;
    if (/\bnoindex\b/i.test(attrs.content || '')) return true;
  }
  return false;
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

let xml = await fs.readFile(SITEMAP, 'utf8');
let removed = 0;
let kept = 0;

const blocks = [...xml.matchAll(/<url>[^]*?<\/url>/g)];
for (const match of blocks) {
  const block = match[0];
  const loc = block.match(/<loc>([^]*?)<\/loc>/)?.[1]?.trim();
  if (!loc) continue;

  const rawUrl = decodeXml(loc);
  let url;
  try {
    url = new URL(rawUrl);
  } catch {
    continue;
  }
  if (url.origin !== ORIGIN) continue;

  const target = pageTarget(url.pathname);
  try {
    const html = await fs.readFile(target, 'utf8');
    if (hasNoindex(html)) {
      xml = xml.replace(block, '');
      removed += 1;
    } else {
      kept += 1;
    }
  } catch {
    kept += 1;
  }
}

await fs.writeFile(SITEMAP, xml, 'utf8');
console.log(`Sitemap noindex pruning: removed ${removed}, kept ${kept}`);
