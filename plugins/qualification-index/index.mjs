import fs from 'node:fs/promises';
import path from 'node:path';

const VERIFICATION_MAX_AGE_DAYS = 270;

const CATEGORY_LABELS = {
  business: 'ビジネス',
  technology: 'IT・技術',
  'legal-accounting': '法律・会計',
  'medical-welfare': '医療・福祉',
  lifestyle: 'ライフスタイル',
  'safety-environment': '安全・環境',
  creative: 'クリエイティブ',
  industry: '業界別',
  etc: 'その他',
};

async function walk(dir) {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  const files = [];
  for (const entry of entries) {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(absolute)));
    } else if (/\.mdx?$/.test(entry.name) && !entry.name.startsWith('_')) {
      files.push(absolute);
    }
  }
  return files;
}

function parseFrontMatter(source) {
  if (!source.startsWith('---')) {
    return {frontMatter: {}, body: source};
  }
  const end = source.indexOf('\n---', 3);
  if (end === -1) {
    return {frontMatter: {}, body: source};
  }
  const block = source.slice(3, end).trim();
  const frontMatter = {};
  for (const line of block.split('\n')) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.+)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    frontMatter[key] = rawValue.trim().replace(/^['"]|['"]$/g, '');
  }
  return {frontMatter, body: source.slice(end + 4).trim()};
}

function cleanMarkdown(value) {
  return value
    .replace(/<[^>]+>/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/[*_~`>#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeSearchValue(value) {
  return String(value ?? '')
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[\s・･_\-‐–—/／()（）\[\]【】{}「」『』.,，。:：;；'"]/g, '');
}

function toIsoDate(year, month, day) {
  return [
    String(year).padStart(4, '0'),
    String(month).padStart(2, '0'),
    String(day).padStart(2, '0'),
  ].join('-');
}

function isRecentVerification(verifiedAt) {
  if (!verifiedAt) return false;
  const verified = Date.parse(verifiedAt + 'T00:00:00Z');
  if (!Number.isFinite(verified)) return false;
  const ageDays = (Date.now() - verified) / 86_400_000;
  return ageDays >= -1 && ageDays <= VERIFICATION_MAX_AGE_DAYS;
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

function extractSummary(body) {
  const overview = body.match(/##\s*概要\s*\n+([\s\S]*?)(?=\n##\s|$)/);
  const source = overview?.[1] ?? body;
  const paragraphs = source
    .split(/\n\s*\n/)
    .map(cleanMarkdown)
    .filter((text) => text && !/^[-|]/.test(text) && text.length >= 18);
  const summary = paragraphs[0] ?? '';
  return summary.length > 170 ? `${summary.slice(0, 167)}…` : summary;
}

function detectCredentialType(body) {
  const sample = body.slice(0, 2200);
  const types = [
    ['国家資格', '国家資格'],
    ['国家試験', '国家資格'],
    ['国家免許', '国家資格'],
    ['国家検定', '国家資格'],
    ['公的資格', '公的資格'],
    ['登録経理試験', '公的資格'],
    ['民間資格', '民間資格'],
    ['民間検定', '民間資格'],
    ['民間認定', '民間資格'],
    ['ベンダー認定', '民間資格'],
    ['国際資格', '国際資格'],
    ['国際認定資格', '国際資格'],
  ];
  for (const [needle, label] of types) {
    if (sample.includes(needle)) return label;
  }
  return '区分未整理';
}

function detectDifficulty(body) {
  const section = body.match(/##\s*難易度[^\n]*\n([\s\S]{0,700}?)(?=\n##\s|$)/)?.[1] ?? '';
  const nearby = body.match(/難易度[\s\S]{0,250}/)?.[0] ?? '';
  const sample = `${section}\n${nearby}`;
  const hits = ['初級', '中級', '上級'].filter((label) => sample.includes(label));
  if (hits.length > 1) return '複数レベル';
  if (hits.length === 1) return hits[0];
  if (/難関|極めて高度|非常に高/.test(sample)) return '上級';
  return '未整理';
}

function explicitStudyHours(frontMatter) {
  const label = frontMatter.study_hours_label;
  const rawMin = frontMatter.study_hours_min;
  const rawMax = frontMatter.study_hours_max;

  if (!label && rawMin == null && rawMax == null) return null;

  const min = rawMin == null || rawMin === '' ? null : Number(rawMin);
  const max = rawMax == null || rawMax === '' ? min : Number(rawMax);
  return {
    min: Number.isFinite(min) ? min : null,
    max: Number.isFinite(max) ? max : null,
    label: label || (
      Number.isFinite(min) && Number.isFinite(max)
        ? min === max
          ? `約${min}時間`
          : `${min}〜${max}時間`
        : '情報なし'
    ),
  };
}

function extractStudyHours(body) {
  const samples = [
    body.match(/勉強時間[\s\S]{0,420}/)?.[0] ?? '',
    body.match(/学習時間[\s\S]{0,420}/)?.[0] ?? '',
  ];
  for (const sample of samples) {
    const range = sample.match(/(\d{1,4})\s*(?:時間)?\s*[～〜~\-–—]\s*(\d{1,4})\s*時間/);
    if (range) {
      const first = Number(range[1]);
      const second = Number(range[2]);
      const min = Math.min(first, second);
      const max = Math.max(first, second);
      return {min, max, label: `${min}〜${max}時間`};
    }
    const single = sample.match(/(\d{1,4})\s*時間/);
    if (single) {
      const value = Number(single[1]);
      return {min: value, max: value, label: `約${value}時間`};
    }
  }
  return {min: null, max: null, label: '情報なし'};
}

function detectExamMethod(body) {
  const section =
    body.match(/(?:試験方式|試験詳細)[\s\S]{0,900}/)?.[0] ??
    body.slice(0, 1800);
  const methods = [];
  if (/CBT|コンピュータ|パソコン受験/i.test(section)) methods.push('CBT');
  if (/筆記|マークシート|択一/.test(section)) methods.push('筆記');
  if (/実技|実地/.test(section)) methods.push('実技');
  if (/面接|口述/.test(section)) methods.push('面接');
  if (/オンライン|IBT/.test(section)) methods.push('オンライン');
  return methods.length ? [...new Set(methods)].slice(0, 2).join('＋') : '未整理';
}

function detectAvailabilityStatus(title, body) {
  const sample = `${title}\n${body.slice(0, 3200)}`;
  if (
    /終了済み|現在は実施されていません|新規受験[^\n]{0,20}不可|実施団体[^\n]{0,80}解散/.test(
      sample,
    )
  ) {
    return 'ended';
  }
  if (
    /休止中|開催休止|新規開催案内[^\n]{0,50}確認できない|最新の開催案内[^\n]{0,50}20\d{2}年/.test(
      sample,
    )
  ) {
    return 'check';
  }
  return null;
}

function extractOfficialUrl(body) {
  const preferred = body.match(/\[(?:公式サイト|公式情報|公式ページ)[^\]]*\]\((https?:\/\/[^)]+)\)/i);
  if (preferred) return preferred[1];
  const section = body.match(/##\s*公式情報[\s\S]{0,500}/)?.[0] ?? '';
  const fallback = section.match(/\((https?:\/\/[^)]+)\)/);
  return fallback?.[1] ?? null;
}

function toRoute(relativePath, slug) {
  if (slug) {
    const clean = String(slug).replace(/^\/+|\/+$/g, '');
    return clean ? `/docs/${clean}/` : '/docs/';
  }
  return `/docs/${relativePath.replace(/\\/g, '/').replace(/\.mdx?$/, '').replace(/\/index$/, '')}/`;
}

export default function qualificationIndexPlugin(context) {
  const docsDir = path.join(context.siteDir, 'docs');

  return {
    name: 'qualification-index',

    async loadContent() {
      const files = await walk(docsDir);
      const qualifications = [];
      let sourceCount = 0;
      let hiddenCount = 0;

      for (const file of files) {
        const relativePath = path.relative(docsDir, file).replace(/\\/g, '/');
        if (relativePath === 'intro.md' || /(^|\/)index\.mdx?$/.test(relativePath)) continue;

        sourceCount += 1;
        const source = await fs.readFile(file, 'utf8');
        const {frontMatter, body} = parseFrontMatter(source);
        const isHidden =
          String(frontMatter.unlisted ?? '').toLowerCase() === 'true' ||
          String(frontMatter.draft ?? '').toLowerCase() === 'true';
        if (isHidden) {
          hiddenCount += 1;
          continue;
        }

        const heading = body.match(/^#\s+(.+)$/m)?.[1]?.trim();
        const title = frontMatter.title || heading || path.basename(file, path.extname(file));
        const categoryKey = relativePath.split('/')[0];
        const studyHours =
          explicitStudyHours(frontMatter) ?? extractStudyHours(body);
        const summary = extractSummary(body);
        const verifiedAt = extractVerifiedAt(frontMatter, body);
        const currentYear = new Date().getUTCFullYear();
        const verifiedThisYear =
          verifiedAt?.startsWith(`${currentYear}-`) ?? false;
        const detectedStatus = detectAvailabilityStatus(title, body);
        const declaredStatus = frontMatter.qualification_status || '';
        const availabilityStatus =
          declaredStatus === 'ended' || declaredStatus === 'check'
            ? declaredStatus
            : detectedStatus || (isRecentVerification(verifiedAt) ? 'active' : 'check');

        qualifications.push({
          id: relativePath.replace(/\.mdx?$/, ''),
          title,
          route: toRoute(relativePath, frontMatter.slug),
          categoryKey,
          category: CATEGORY_LABELS[categoryKey] || categoryKey,
          summary,
          credentialType:
            frontMatter.credential_type || detectCredentialType(body),
          difficulty:
            frontMatter.difficulty || detectDifficulty(body),
          studyHours,
          examMethod:
            frontMatter.exam_method || detectExamMethod(body),
          officialUrl:
            frontMatter.official_url || extractOfficialUrl(body),
          verifiedAt,
          verifiedThisYear,
          availabilityStatus,
          searchText: normalizeSearchValue(
            cleanMarkdown(
              `${title} ${summary} ${CATEGORY_LABELS[categoryKey] || categoryKey} ${relativePath} ${frontMatter.search_aliases || ''}`,
            ),
          ),
        });
      }

      qualifications.sort((a, b) => a.title.localeCompare(b.title, 'ja'));
      const activeCount = qualifications.filter(
        (item) => item.availabilityStatus === 'active',
      ).length;
      return {
        generatedAt: new Date().toISOString(),
        count: qualifications.length,
        activeCount,
        sourceCount,
        hiddenCount,
        qualifications,
      };
    },

    async contentLoaded({content, actions}) {
      const {createData, addRoute, setGlobalData} = actions;

      setGlobalData({
        count: content.count,
        activeCount: content.activeCount,
        sourceCount: content.sourceCount,
        hiddenCount: content.hiddenCount,
        items: content.qualifications.map((item) => ({
          id: item.id,
          title: item.title,
          route: item.route,
          summary: item.summary,
          categoryKey: item.categoryKey,
          category: item.category,
          section: item.id.split('/').slice(0, -1).join('/'),
          credentialType: item.credentialType,
          difficulty: item.difficulty,
          studyHours: item.studyHours.label,
          examMethod: item.examMethod,
          officialUrl: item.officialUrl,
          verifiedAt: item.verifiedAt,
          verifiedThisYear: item.verifiedThisYear,
          availabilityStatus: item.availabilityStatus,
        })),
      });

      const dataPath = await createData(
        'qualifications.json',
        JSON.stringify(content),
      );

      addRoute({
        path: '/explore',
        component: '@site/src/components/QualificationExplorer.tsx',
        modules: {qualificationData: dataPath},
        exact: true,
      });

    },
  };
}
