import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {usePluginData} from '@docusaurus/useGlobalData';
import styles from './index.module.css';

type QualificationIndexData = {
  count: number;
  activeCount: number;
  sourceCount: number;
  hiddenCount: number;
};

const categories = [
  { icon: '💼', title: 'ビジネス', description: '営業・人事・経営・マーケティング', to: '/docs/business' },
  { icon: '💻', title: 'IT・技術', description: '情報処理・クラウド・データ・開発', to: '/docs/technology' },
  { icon: '⚖️', title: '法律・会計', description: '士業・法務・簿記・会計・金融', to: '/docs/legal-accounting' },
  { icon: '🩺', title: '医療・福祉', description: '医療・介護・福祉・ヘルスケア', to: '/docs/medical-welfare' },
  { icon: '🌿', title: 'ライフスタイル', description: '語学・食・暮らし・教養', to: '/docs/lifestyle' },
  { icon: '🦺', title: '安全・環境', description: '安全衛生・設備・環境・防災', to: '/docs/safety-environment' },
  { icon: '🎨', title: 'クリエイティブ', description: 'デザイン・写真・映像・メディア', to: '/docs/creative' },
  { icon: '🏭', title: '業界別', description: '不動産・物流・製造など業界特化', to: '/docs/industry' },
];

const popularQualifications = [
  {
    name: 'ITパスポート',
    note: 'ITの基礎を広く学ぶ国家試験',
    meta: 'IT・入門',
    to: '/docs/technology/General/digital/it-passport-i-pass',
  },
  {
    name: '基本情報技術者',
    note: 'エンジニアの土台になる国家試験',
    meta: 'IT・定番',
    to: '/docs/technology/General/kihon-jouhou-gijutsusha-fe',
  },
  {
    name: '宅地建物取引士（宅建）',
    note: '不動産業界の代表的な国家資格',
    meta: '法律・不動産',
    to: '/docs/business/Finance/fudousan/takuchi-tatemono-torihikishi-takkenshi',
  },
  {
    name: '日商簿記',
    note: '会計・経理の基礎から実務まで',
    meta: '会計・経理',
    to: '/docs/legal-accounting/Accounting/kaikei/nisshou-boki-2kyuu-3kyuu-1kyuu',
  },
  {
    name: '行政書士',
    note: '許認可・法務分野の国家資格',
    meta: '法律・士業',
    to: '/docs/legal-accounting/Legal/shigyou/gyousei-shoshi',
  },
  {
    name: 'FP技能士',
    note: 'お金・保険・税・相続を体系化',
    meta: '金融・生活',
    to: '/docs/business/Finance/fudousan/fp-ginoushi-3kyuu-2kyuu-1kyuu',
  },
  {
    name: 'MOS',
    note: 'Word・Excelなどの操作スキルを証明',
    meta: 'PC・実務',
    to: '/docs/technology/General/mos',
  },
  {
    name: 'TOEIC L&R 800',
    note: '英語力の目標ラインを具体化',
    meta: '語学・英語',
    to: '/docs/lifestyle/Language/eigo/toeic-l-r-800',
  },
];

const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': 'https://shikaku.antonbase.com/#website',
      url: 'https://shikaku.antonbase.com/',
      name: '資格カタログ',
      description: '公式情報を確認しながら、難易度・勉強時間・試験方式から資格・検定を探せる総合情報サイト',
      inLanguage: 'ja-JP',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://shikaku.antonbase.com/explore?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'CollectionPage',
      '@id': 'https://shikaku.antonbase.com/#webpage',
      url: 'https://shikaku.antonbase.com/',
      name: '資格・検定を難易度・勉強時間から探す｜資格カタログ',
      isPartOf: { '@id': 'https://shikaku.antonbase.com/#website' },
      about: { '@type': 'Thing', name: '資格・検定' },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: popularQualifications.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          url: `https://shikaku.antonbase.com${item.to}/`,
        })),
      },
    },
  ],
};

function QualificationMap(): React.JSX.Element {
  return (
    <div className={styles.mapVisual} aria-label="資格ジャンルのイメージ図">
      <div className={styles.mapGrid} aria-hidden="true" />
      <div className={`${styles.orbit} ${styles.orbitOne}`} aria-hidden="true" />
      <div className={`${styles.orbit} ${styles.orbitTwo}`} aria-hidden="true" />
      <div className={styles.mapCenter}>
        <span>資格</span>
        <strong>CATALOG</strong>
      </div>
      <span className={`${styles.mapChip} ${styles.chipIt}`}>IT</span>
      <span className={`${styles.mapChip} ${styles.chipLaw}`}>法律</span>
      <span className={`${styles.mapChip} ${styles.chipMoney}`}>会計</span>
      <span className={`${styles.mapChip} ${styles.chipLanguage}`}>語学</span>
      <span className={`${styles.mapChip} ${styles.chipMedical}`}>医療</span>
      <span className={`${styles.mapChip} ${styles.chipCreative}`}>創作</span>
    </div>
  );
}

function HomepageHeader({qualificationCount}: {qualificationCount: number}): React.JSX.Element {
  return (
    <header className={styles.hero}>
      <div className={`container ${styles.heroInner}`}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>資格を「名前」ではなく「目的」から探す</p>
          <Heading as="h1" className={styles.heroTitle}>
            次に取る資格が、
            <br />
            ちゃんと見えてくる。
          </Heading>
          <p className={styles.heroLead}>
            難易度・勉強時間・試験方式・活かせる仕事を整理。
            公開品質を満たした{qualificationCount}件の資格・検定から、自分に合う候補を探索できます。
          </p>
          <div className={styles.heroActions}>
            <Link className="button button--primary button--lg" to="/explore">
              条件から資格を探す
            </Link>
            <Link className={styles.textLink} to="/blog">
              勉強法・比較記事を見る <span aria-hidden="true">→</span>
            </Link>
          </div>
          <dl className={styles.stats}>
            <div>
              <dt>{qualificationCount}</dt>
              <dd>公開中の資格・検定</dd>
            </div>
            <div>
              <dt>8</dt>
              <dd>主要カテゴリ</dd>
            </div>
            <div>
              <dt>無料</dt>
              <dd>登録不要</dd>
            </div>
          </dl>
        </div>
        <QualificationMap />
      </div>
    </header>
  );
}

export default function Home(): React.JSX.Element {
  const qualificationData = usePluginData('qualification-index') as QualificationIndexData;
  const qualificationCount = qualificationData.activeCount;

  return (
    <Layout
      title="資格・検定を難易度・勉強時間から探す"
      description="公式情報を重視し、難易度・勉強時間・試験方式・活かせる仕事から資格を探せる資格カタログ。IT、法律、会計、医療、語学など幅広く掲載しています。">
      <Head>
        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <HomepageHeader qualificationCount={qualificationCount} />

      <main className={styles.main}>
        <section className={`container ${styles.section}`} aria-labelledby="category-heading">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionKicker}>EXPLORE BY FIELD</p>
              <Heading as="h2" id="category-heading">
                分野から探す
              </Heading>
            </div>
            <p>まずは興味のある分野へ。各カテゴリから関連資格を一覧できます。</p>
          </div>

          <div className={styles.categoryGrid}>
            {categories.map((category) => (
              <Link key={category.title} className={styles.categoryCard} to={category.to}>
                <span className={styles.categoryIcon} aria-hidden="true">
                  {category.icon}
                </span>
                <span>
                  <strong>{category.title}</strong>
                  <small>{category.description}</small>
                </span>
                <span className={styles.arrow} aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.popularSection} aria-labelledby="popular-heading">
          <div className={`container ${styles.section}`}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionKicker}>START HERE</p>
                <Heading as="h2" id="popular-heading">
                  まず見ておきたい定番資格
                </Heading>
              </div>
              <p>知名度が高く、比較の基準にしやすい資格から全体像をつかめます。</p>
            </div>

            <div className={styles.qualificationGrid}>
              {popularQualifications.map((qualification, index) => (
                <Link
                  key={qualification.name}
                  className={styles.qualificationCard}
                  to={qualification.to}>
                  <span className={styles.cardNumber}>{String(index + 1).padStart(2, '0')}</span>
                  <span className={styles.cardMeta}>{qualification.meta}</span>
                  <strong>{qualification.name}</strong>
                  <p>{qualification.note}</p>
                  <span className={styles.cardCta}>
                    詳細を見る <span aria-hidden="true">→</span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.trustSection} aria-labelledby="trust-heading">
          <div className={`container ${styles.section}`}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.sectionKicker}>RESEARCH STANDARD</p>
                <Heading as="h2" id="trust-heading">
                  数字の出どころを、曖昧にしない。
                </Heading>
              </div>
              <p>
                資格選びでは、試験日や受験料のような公式情報と、勉強時間のような目安を分けて読むことが重要です。
              </p>
            </div>

            <div className={styles.trustGrid}>
              <div className={styles.trustCard}>
                <span>01</span>
                <strong>公式情報を優先</strong>
                <p>試験制度・日程・受験料・受験資格は、実施団体や公的機関の情報を優先して確認します。</p>
              </div>
              <div className={styles.trustCard}>
                <span>02</span>
                <strong>目安は目安として表示</strong>
                <p>勉強時間や難易度は個人差があります。公式値と推定・一般的な目安を混同しない方針です。</p>
              </div>
              <div className={styles.trustCard}>
                <span>03</span>
                <strong>記事から比較データを自動生成</strong>
                <p>検索・比較画面は資格記事を正本として生成し、別データベースとの情報ずれを減らします。</p>
              </div>
            </div>

            <div className={styles.trustFooter}>
              <Link to="/methodology">編集方針と情報の見方を詳しく読む →</Link>
            </div>
          </div>
        </section>

        <section className={`container ${styles.section}`}>
          <div className={styles.routePanel}>
            <div className={styles.routeVisual} aria-hidden="true">
              <span>資格</span>
              <i />
              <span>スキル</span>
              <i />
              <span>仕事</span>
            </div>
            <div className={styles.routeCopy}>
              <p className={styles.sectionKicker}>QUALIFICATION → CAREER</p>
              <Heading as="h2">資格を取った先の仕事まで見る</Heading>
              <p>
                「取れそう」だけで資格を選ばず、その資格がどんな仕事につながるかもセットで確認。
                しごと図鑑では、職種や業界を別の角度から探索できます。
              </p>
              <Link className="button button--secondary button--md" to="https://job.antonbase.com">
                しごと図鑑へ
              </Link>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
