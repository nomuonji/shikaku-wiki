import React, {useMemo} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import Heading from '@theme/Heading';
import styles from './CategoryLanding.module.css';

type Item = {
  id: string;
  title: string;
  route: string;
  categoryKey: string;
  category: string;
  section: string;
  credentialType: string;
  difficulty: string;
  studyHours: string;
  examMethod: string;
  verifiedAt: string | null;
  updatedFor2026: boolean;
  availabilityStatus: 'active' | 'ended' | 'check';
};

type IndexData = {items: Item[]};

type Props = {
  categoryKey: string;
  title: string;
  description: string;
  accent: string;
};

const FEATURED: Record<string, string[]> = {
  business: [
    '/docs/business/Finance/fudousan/takuchi-tatemono-torihikishi-takkenshi',
    '/docs/business/Finance/fudousan/fp-ginoushi-3kyuu-2kyuu-1kyuu',
  ],
  technology: [
    '/docs/technology/General/digital/it-passport-i-pass',
    '/docs/technology/General/kihon-jouhou-gijutsusha-fe',
    '/docs/technology/Data/toukei/toukei-kentei-2kyuu',
    '/docs/technology/General/rhcsa',
  ],
  'legal-accounting': [
    '/docs/legal-accounting/Legal/shigyou/shihou-shoshi',
    '/docs/legal-accounting/Legal/shigyou/gyousei-shoshi',
    '/docs/legal-accounting/Legal/chizai/benrishi',
    '/docs/legal-accounting/Accounting/kaikei/nisshou-boki-2kyuu-3kyuu-1kyuu',
  ],
  'medical-welfare': [
    '/docs/medical-welfare/Welfare/shakai-fukushishi',
    '/docs/medical-welfare/Medical/kyuukyuu-kyuumeishi',
    '/docs/medical-welfare/kangoshi',
    '/docs/medical-welfare/yakuzaishi',
  ],
  lifestyle: [
    '/docs/lifestyle/Language/eigo/toeic-l-r-800',
    '/docs/lifestyle/Language/eigo/toefl-ibt-80',
    '/docs/lifestyle/General/sensuishi',
    '/docs/lifestyle/Health/kenkou/yasai-sommelier',
  ],
  'safety-environment': [
    '/docs/safety-environment/Environment/kagaku/kikenbutsu-toriatsukaisha-koushu',
    '/docs/safety-environment/General/shisetsu/koushu-bouka-kanrisha',
    '/docs/safety-environment/Environment/jumokui',
  ],
  creative: [
    '/docs/creative/Design/dtp/adobe-illustrator-acp',
    '/docs/creative/Design/gazou/adobe-photoshop-acp',
    '/docs/creative/Design/shikisai/shikisai-kentei-3kyuu',
  ],
  industry: [
    '/docs/industry/Construction/sekkei/nikyuu-kenchikushi',
    '/docs/industry/Construction/kenchiku-sekisanshi',
    '/docs/industry/Manufacturing/seibi/jitensha-gishi',
    '/docs/industry/Construction/tobi-ginoushi-2kyuu',
  ],
};

const SECTION_LABELS: Record<string, string> = {
  Finance: '金融・不動産',
  HR: '人事・実務',
  Marketing: 'マーケティング',
  Management: '経営・マネジメント',
  Legal: '法務',
  Accounting: '会計',
  Medical: '医療',
  Welfare: '福祉・介護',
  Language: '語学',
  Culture: '文化・教養',
  Food: '食・飲料',
  Health: '健康・レジャー',
  Safety: '安全・防災',
  Environment: '環境',
  Design: 'デザイン',
  Media: 'メディア',
  Construction: '建設',
  Manufacturing: '製造・整備',
  Infrastructure: 'インフラ',
  Development: '開発',
  Data: 'データ',
  General: '総合・その他',
};

function completeness(item: Item) {
  let score = 0;
  if (item.credentialType !== '区分未整理') score += 1;
  if (item.difficulty !== '未整理') score += 1;
  if (item.studyHours !== '情報なし') score += 1;
  if (item.examMethod !== '未整理') score += 1;
  if (item.updatedFor2026) score += 1;
  return score;
}

export default function CategoryLanding({
  categoryKey,
  title,
  description,
  accent,
}: Props): React.JSX.Element {
  const data = usePluginData('qualification-index') as IndexData;

  const activeItems = useMemo(
    () =>
      data.items.filter(
        (item) =>
          item.categoryKey === categoryKey &&
          item.availabilityStatus === 'active',
      ),
    [data.items, categoryKey],
  );

  const featured = useMemo(() => {
    const preferred = FEATURED[categoryKey] ?? [];
    const byRoute = new Map(activeItems.map((item) => [item.route.replace(/\/+$/, ''), item]));
    const selected = preferred
      .map((route) => byRoute.get(route.replace(/\/+$/, '')))
      .filter((item): item is Item => Boolean(item));

    if (selected.length >= 4) return selected.slice(0, 4);

    const fallback = [...activeItems]
      .filter((item) => !selected.some((picked) => picked.id === item.id))
      .sort(
        (a, b) =>
          completeness(b) - completeness(a) ||
          a.title.localeCompare(b.title, 'ja'),
      );

    return [...selected, ...fallback].slice(0, 4);
  }, [activeItems, categoryKey]);

  const sections = useMemo(() => {
    const counts = new Map<string, number>();
    for (const item of activeItems) {
      const raw = item.id.split('/')[1] || 'General';
      counts.set(raw, (counts.get(raw) ?? 0) + 1);
    }

    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([key, count]) => ({
        key,
        label: SECTION_LABELS[key] ?? key,
        count,
      }));
  }, [activeItems]);

  const freshCount = activeItems.filter((item) => item.verifiedAt?.startsWith('2026-')).length;
  const exploreUrl = `/explore/?category=${encodeURIComponent(title)}`;
  const canonicalUrl = `https://shikaku.antonbase.com/docs/${categoryKey}/`;
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${title}の資格・検定｜資格カタログ`,
    description,
    url: canonicalUrl,
    inLanguage: 'ja-JP',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: activeItems.length,
      itemListElement: activeItems.slice(0, 20).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: `https://shikaku.antonbase.com${item.route}`,
      })),
    },
  };

  return (
    <> 
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>
    <div className={styles.page} style={{'--category-accent': accent} as React.CSSProperties}>
      <section className={styles.hero}>
        <div>
          <p className={styles.kicker}>FIELD GUIDE</p>
          <Heading as="h1">{title}</Heading>
          <p className={styles.lead}>{description}</p>
          <div className={styles.actions}>
            <Link className="button button--primary button--md" to={exploreUrl}>
              この分野を条件検索
            </Link>
            <Link className={styles.secondaryLink} to="/explore/">
              全資格から探す →
            </Link>
          </div>
        </div>
        <dl className={styles.stats}>
          <div><dt>{activeItems.length}</dt><dd>現行資格</dd></div>
          <div><dt>{sections.length}</dt><dd>主な領域</dd></div>
          <div><dt>{freshCount}</dt><dd>2026年に制度確認</dd></div>
        </dl>
      </section>

      {sections.length ? (
        <section className={styles.section}>
          <div className={styles.sectionHead}>
            <div>
              <span>AREAS</span>
              <Heading as="h2">この分野の内訳</Heading>
            </div>
            <p>掲載中の現行資格を、サイト内の領域ごとに集計しています。</p>
          </div>
          <div className={styles.areaGrid}>
            {sections.map((section) => (
              <div className={styles.areaCard} key={section.key}>
                <strong>{section.label}</strong>
                <span>{section.count}資格</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <div>
            <span>START HERE</span>
            <Heading as="h2">代表的な資格から見る</Heading>
          </div>
          <p>知名度だけでなく、情報の整理度も加味して入口になる資格を選んでいます。</p>
        </div>
        <div className={styles.cardGrid}>
          {featured.map((item) => (
            <Link className={styles.card} key={item.id} to={item.route}>
              <div className={styles.cardTop}>
                <span>{item.credentialType === '区分未整理' ? '資格・検定' : item.credentialType}</span>
                {item.verifiedAt ? <em>{item.verifiedAt}</em> : null}
              </div>
              <strong>{item.title}</strong>
              <dl>
                <div><dt>試験方式</dt><dd>{item.examMethod === '未整理' ? '—' : item.examMethod}</dd></div>
                <div><dt>難易度</dt><dd>{item.difficulty === '未整理' ? '—' : item.difficulty}</dd></div>
              </dl>
              <span className={styles.cardCta}>詳細を見る →</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.guide}>
        <div>
          <p className={styles.kicker}>HOW TO CHOOSE</p>
          <Heading as="h2">資格名だけで選ばない</Heading>
          <p>
            資格の知名度より、受験資格・試験方式・更新制度・仕事との接続を先に確認すると、
            「取った後に使わない資格」を減らせます。
          </p>
        </div>
        <div className={styles.guideSteps}>
          <span><b>01</b> 目的を決める</span>
          <span><b>02</b> 受験条件を見る</span>
          <span><b>03</b> 費用と試験方式を比べる</span>
          <span><b>04</b> 公式情報で最終確認する</span>
        </div>
      </section>
    </div>
    </>
  );
}
