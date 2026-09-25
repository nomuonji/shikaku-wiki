import React, {useMemo} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import CategoryGlyph from '@site/src/components/CategoryGlyph';
import styles from './QualificationFieldPage.module.css';

type Qualification = {
  id: string;
  title: string;
  route: string;
  summary: string;
  categoryKey: string;
  category: string;
  section: string;
  credentialType: string;
  difficulty: string;
  studyHours: string;
  examMethod: string;
  officialUrl: string | null;
  updatedFor2026: boolean;
  availabilityStatus: 'active' | 'ended' | 'check';
};

type QualificationIndexData = {
  count: number;
  activeCount: number;
  sourceCount: number;
  hiddenCount: number;
  items: Qualification[];
};

const FIELD_INFO: Record<string, {
  label: string;
  english: string;
  lead: string;
  description: string;
  terms: string[];
  icon: string;
}> = {
  business: {
    label: 'ビジネス',
    english: 'BUSINESS',
    lead: '仕事を動かす知識を、資格から。',
    description: '経営・人事・営業・金融・マーケティングなど、組織とビジネスを支える資格をまとめています。',
    terms: ['経営', '人事', '金融'],
    icon: 'business',
  },
  technology: {
    label: 'IT・技術',
    english: 'TECHNOLOGY',
    lead: '技術を、体系として身につける。',
    description: '情報処理、クラウド、データ、開発、インフラなど、デジタル領域の知識・実務スキルを確認する資格をまとめています。',
    terms: ['IT', 'クラウド', 'データ'],
    icon: 'technology',
  },
  'legal-accounting': {
    label: '法律・会計',
    english: 'LEGAL & ACCOUNTING',
    lead: '制度と数字を、専門性に変える。',
    description: '士業、法務、登記、知的財産、簿記、会計など、法律と数字を扱う専門資格をまとめています。',
    terms: ['法律', '会計', '士業'],
    icon: 'legal',
  },
  'medical-welfare': {
    label: '医療・福祉',
    english: 'MEDICAL & WELFARE',
    lead: '人を支える専門性を、制度から知る。',
    description: '医療、介護、福祉、リハビリテーションなど、人の生活と健康を支える資格をまとめています。',
    terms: ['医療', '福祉', 'ケア'],
    icon: 'medical',
  },
  lifestyle: {
    label: 'ライフスタイル',
    english: 'LIFESTYLE',
    lead: '暮らしの知識を、深く広く。',
    description: '語学、食、健康、文化、生活実務など、日常と教養の延長で学べる資格・検定をまとめています。',
    terms: ['語学', '食', '文化'],
    icon: 'lifestyle',
  },
  'safety-environment': {
    label: '安全・環境',
    english: 'SAFETY & ENVIRONMENT',
    lead: '安全を守る知識には、根拠がいる。',
    description: '防火、防災、安全衛生、環境、設備管理など、事故防止と持続可能な運用に関わる資格をまとめています。',
    terms: ['安全', '防災', '環境'],
    icon: 'safety',
  },
  creative: {
    label: 'クリエイティブ',
    english: 'CREATIVE',
    lead: 'つくる力を、言語化して証明する。',
    description: 'デザイン、色彩、写真、映像、メディアなど、創作と表現に関わる資格・検定をまとめています。',
    terms: ['デザイン', '色彩', 'メディア'],
    icon: 'creative',
  },
  industry: {
    label: '業界別',
    english: 'INDUSTRY',
    lead: '現場ごとの専門知識を、資格でたどる。',
    description: '建設、製造、運輸、不動産など、特定業界の実務と密接につながる資格をまとめています。',
    terms: ['建設', '製造', '運輸'],
    icon: 'industry',
  },
  etc: {
    label: 'その他',
    english: 'OTHER FIELDS',
    lead: '分類しきれない専門性も、拾い上げる。',
    description: '主要8分野に収まりにくい専門資格・検定をまとめています。',
    terms: ['専門', '技能', '教養'],
    icon: 'industry',
  },
};

export default function QualificationFieldPage(): React.JSX.Element {
  const location = useLocation();
  const data = usePluginData('qualification-index') as QualificationIndexData;
  const categoryKey = location.pathname.split('/').filter(Boolean).pop() ?? 'etc';
  const info = FIELD_INFO[categoryKey] ?? FIELD_INFO.etc;

  const qualifications = useMemo(
    () =>
      data.items
        .filter(
          (item) =>
            item.categoryKey === categoryKey &&
            item.availabilityStatus === 'active',
        )
        .sort(
          (a, b) =>
            Number(b.updatedFor2026) - Number(a.updatedFor2026) ||
            a.title.localeCompare(b.title, 'ja'),
        ),
    [categoryKey, data.items],
  );

  const updatedCount = qualifications.filter((item) => item.updatedFor2026).length;
  const typeCount = new Set(
    qualifications
      .map((item) => item.credentialType)
      .filter((value) => value && value !== '区分未整理'),
  ).size;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${info.label}の資格・検定｜資格カタログ`,
    description: info.description,
    url: `https://shikaku.antonbase.com/field/${categoryKey}/`,
    inLanguage: 'ja-JP',
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: qualifications.length,
      itemListElement: qualifications.slice(0, 20).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.title,
        url: `https://shikaku.antonbase.com${item.route}/`,
      })),
    },
  };

  return (
    <Layout
      title={`${info.label}の資格・検定`}
      description={info.description}>
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <main className={styles.page}>
        <header className={styles.hero}>
          <div className={`container ${styles.heroGrid}`}>
            <div className={styles.heroCopy}>
              <p className={styles.eyebrow}>{info.english}</p>
              <Heading as="h1">{info.lead}</Heading>
              <p className={styles.lead}>{info.description}</p>

              <dl className={styles.stats}>
                <div>
                  <dt>{qualifications.length}</dt>
                  <dd>現行資格</dd>
                </div>
                <div>
                  <dt>{updatedCount}</dt>
                  <dd>2026情報あり</dd>
                </div>
                <div>
                  <dt>{typeCount}</dt>
                  <dd>資格区分</dd>
                </div>
              </dl>

              <div className={styles.actions}>
                <Link
                  className="button button--primary button--md"
                  to={`/explore?category=${encodeURIComponent(info.label)}`}>
                  条件を指定して探す
                </Link>
                <Link className={styles.listLink} to="/docs/intro">
                  全資格一覧へ <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>

            <div className={styles.visual} aria-hidden="true">
              <div className={styles.visualIcon}>
                <CategoryGlyph name={info.icon} />
              </div>
              <strong>{info.english}</strong>
              <div className={styles.termRow}>
                {info.terms.map((term) => <span key={term}>{term}</span>)}
              </div>
              <div className={styles.visualLines}>
                <i /><i /><i /><i />
              </div>
            </div>
          </div>
        </header>

        <section className={`container ${styles.section}`}>
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.kicker}>QUALIFICATIONS</p>
              <Heading as="h2">{info.label}の資格を見る</Heading>
            </div>
            <p>
              2026年の情報を含むページを先に表示しています。
              日程・料金など年度で変わる項目は、各ページの公式リンクも確認してください。
            </p>
          </div>

          {qualifications.length ? (
            <div className={styles.grid}>
              {qualifications.slice(0, 18).map((item) => (
                <Link key={item.id} className={styles.card} to={item.route}>
                  <div className={styles.cardMeta}>
                    <span>
                      {item.credentialType === '区分未整理'
                        ? info.label
                        : item.credentialType}
                    </span>
                    {item.updatedFor2026 ? <small>2026</small> : null}
                  </div>
                  <Heading as="h3">{item.title}</Heading>
                  <p>{item.summary || '試験制度・取得方法・公式情報を確認できます。'}</p>
                  <dl>
                    <div>
                      <dt>方式</dt>
                      <dd>{item.examMethod === '未整理' ? '—' : item.examMethod}</dd>
                    </div>
                    <div>
                      <dt>学習目安</dt>
                      <dd>{item.studyHours === '情報なし' ? '—' : item.studyHours}</dd>
                    </div>
                  </dl>
                  <span className={styles.cardArrow} aria-hidden="true">→</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className={styles.empty}>
              <p>現在公開中の資格はありません。</p>
            </div>
          )}

          {qualifications.length > 18 ? (
            <div className={styles.more}>
              <p>この分野には、ほかにも{qualifications.length - 18}件の現行資格があります。</p>
              <Link
                className="button button--secondary button--md"
                to={`/explore?category=${encodeURIComponent(info.label)}`}>
                {info.label}をすべて表示
              </Link>
            </div>
          ) : null}
        </section>

        <section className={styles.otherFields}>
          <div className={`container ${styles.section}`}>
            <div className={styles.sectionHeading}>
              <div>
                <p className={styles.kicker}>OTHER FIELDS</p>
                <Heading as="h2">別の分野から探す</Heading>
              </div>
            </div>
            <div className={styles.fieldLinks}>
              {Object.entries(FIELD_INFO)
                .filter(([key]) => key !== categoryKey && key !== 'etc')
                .map(([key, field]) => (
                  <Link key={key} to={`/field/${key}`}>
                    <CategoryGlyph name={field.icon} />
                    <span>{field.label}</span>
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
