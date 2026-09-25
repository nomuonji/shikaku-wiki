import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './methodology.module.css';

const principles = [
  {
    number: '01',
    title: '一次情報を最優先する',
    body: '試験日、受験料、受験資格、合格基準、登録・更新要件など、受験判断に直接影響する情報は、資格の実施団体、公的機関、法令・制度ページを優先して確認します。',
  },
  {
    number: '02',
    title: '公式値と目安を分ける',
    body: '勉強時間や難易度は、受験者の経験や前提知識で大きく変わります。公式に公表されていない数値を、公式値のように断定しません。',
  },
  {
    number: '03',
    title: '年度情報には鮮度がある',
    body: '日程、料金、試験方式、制度は改定されます。確認日や対象年度がある場合はそれを明示し、申込前には必ず公式の最新案内を確認する前提で掲載します。',
  },
  {
    number: '04',
    title: '比較データの正本を一つにする',
    body: '資格検索・比較画面のデータは、各資格記事のMarkdown本文からビルド時に自動生成します。同じ情報を別DBへ手入力して、更新ずれを生む設計を避けています。',
  },
];

export default function Methodology(): React.JSX.Element {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: '資格カタログの編集方針・情報の見方',
    url: 'https://shikaku.antonbase.com/methodology/',
    inLanguage: 'ja-JP',
    isPartOf: {
      '@type': 'WebSite',
      name: '資格カタログ',
      url: 'https://shikaku.antonbase.com/',
    },
  };

  return (
    <Layout
      title="編集方針・情報の見方"
      description="資格カタログが資格・検定情報をどのように調査し、公式情報と目安をどう区別し、検索・比較データをどのように生成しているかを説明します。">
      <Head>
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Head>

      <main className={styles.page}>
        <header className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>EDITORIAL STANDARD</p>
            <Heading as="h1">
              資格情報は、
              <br />
              「それっぽさ」で埋めない。
            </Heading>
            <p className={styles.lead}>
              資格は、受験料や申込期限だけでなく、就職・転職や法的な業務範囲にも関係します。
              だから資格カタログでは、公式に確認できる事実と、学習の目安や一般的な評価を分けて扱います。
            </p>
          </div>
        </header>

        <section className={`container ${styles.section}`}>
          <div className={styles.principleGrid}>
            {principles.map((principle) => (
              <article key={principle.number} className={styles.principle}>
                <span>{principle.number}</span>
                <Heading as="h2">{principle.title}</Heading>
                <p>{principle.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.sourceSection}>
          <div className={`container ${styles.section}`}>
            <div className={styles.twoColumn}>
              <div>
                <p className={styles.kicker}>SOURCE PRIORITY</p>
                <Heading as="h2">情報源の優先順位</Heading>
              </div>
              <ol className={styles.sourceList}>
                <li>
                  <strong>資格の実施団体・主管官庁・法令</strong>
                  <span>試験制度、申込、料金、受験資格、登録・更新などの正本として扱います。</span>
                </li>
                <li>
                  <strong>公的機関・業界団体の資料</strong>
                  <span>制度の背景、職務との関係、統計などを補うために使います。</span>
                </li>
                <li>
                  <strong>信頼できる二次情報</strong>
                  <span>公式だけでは把握しにくい学習上の論点などを補助的に参照します。</span>
                </li>
                <li>
                  <strong>一般的な目安・経験則</strong>
                  <span>勉強時間や難易度など。個人差が大きいため、確定値として扱いません。</span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        <section className={`container ${styles.section}`}>
          <div className={styles.explainer}>
            <div>
              <p className={styles.kicker}>HOW TO READ</p>
              <Heading as="h2">検索・比較画面の数字について</Heading>
              <p>
                「区分」「難易度」「勉強時間」「試験方式」などの比較項目は、資格記事の本文から自動抽出しています。
                記事に明記されていない項目は「未整理」「情報なし」と表示し、空欄を推測で埋めません。
              </p>
              <p>
                自動抽出は候補を探すための補助機能です。受験申込や資格の法的効力を判断するときは、各記事からリンクしている公式情報を最終確認してください。
              </p>
              <Link className="button button--primary button--md" to="/explore">
                資格検索・比較を開く
              </Link>
            </div>
            <div className={styles.diagram} aria-label="資格情報の生成フロー">
              <div>
                <small>STEP 1</small>
                <strong>公式情報を確認</strong>
              </div>
              <i aria-hidden="true" />
              <div>
                <small>STEP 2</small>
                <strong>資格記事に整理</strong>
              </div>
              <i aria-hidden="true" />
              <div>
                <small>STEP 3</small>
                <strong>検索データを自動生成</strong>
              </div>
            </div>
          </div>
        </section>

        <section className={styles.noticeSection}>
          <div className="container">
            <Heading as="h2">利用時の注意</Heading>
            <p>
              資格カタログは各資格の公式運営機関ではありません。試験制度や法令は変更されることがあります。
              願書提出、受験料の支払い、免許・登録・更新などを行う前に、必ず実施団体の最新案内を確認してください。
            </p>
          </div>
        </section>
      </main>
    </Layout>
  );
}
