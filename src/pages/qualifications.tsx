import React, {useMemo} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import {usePluginData} from '@docusaurus/useGlobalData';

type Qualification = {
  id: string;
  title: string;
  route: string;
  categoryKey: string;
  category: string;
  verifiedAt: string | null;
  indexReady: boolean;
};

type QualificationIndexData = {
  indexReadyCount: number;
  items: Qualification[];
};

const CATEGORY_ORDER = [
  'ビジネス',
  'IT・技術',
  '法律・会計',
  '医療・福祉',
  '安全・環境',
  'クリエイティブ',
  'ライフスタイル',
  '業界別',
  'その他',
];

export default function QualificationsPage(): React.JSX.Element {
  const data = usePluginData('qualification-index') as QualificationIndexData;

  const groups = useMemo(() => {
    const ready = data.items
      .filter((item) => item.indexReady)
      .sort((a, b) => a.title.localeCompare(b.title, 'ja'));

    return CATEGORY_ORDER
      .map((category) => ({
        category,
        items: ready.filter((item) => item.category === category),
      }))
      .filter((group) => group.items.length > 0);
  }, [data.items]);

  const listItems = groups.flatMap((group) => group.items);
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '資格・検定一覧',
    numberOfItems: listItems.length,
    itemListElement: listItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.title,
      url: `https://shikaku.antonbase.com${item.route}`,
    })),
  };

  return (
    <Layout
      title="資格一覧｜公式情報を確認した資格・検定"
      description="公式情報URLと制度確認日が揃った現行資格・検定を分野別に一覧化。国家資格・民間資格などの区分と確認日を見ながら、次に調べる資格を探せます。">
      <Head>
        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"
        />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Head>

      <main className="container margin-vert--lg">
        <header className="margin-bottom--lg">
          <p><strong>QUALIFICATION DIRECTORY</strong></p>
          <Heading as="h1">資格・検定一覧</Heading>
          <p>
            DBに登録されている資格をそのまま全部並べるページではありません。
            現行資格で、制度確認日が新しく、公式情報URLを確認できた
            <strong>{data.indexReadyCount}件</strong>だけを検索向け一覧に載せています。
          </p>
          <p>
            条件で絞り込みたい場合は <Link to="/explore/">資格検索・比較</Link> を使えます。
            検索・比較画面には調査中のレコードも含まれるため、個別ページの公開状態とは別です。
          </p>
        </header>

        {groups.map((group) => (
          <section key={group.category} className="margin-bottom--xl">
            <Heading as="h2">{group.category} <small>（{group.items.length}件）</small></Heading>
            <div className="row">
              {group.items.map((item) => (
                <div key={item.id} className="col col--6 margin-bottom--md">
                  <article className="card">
                    <div className="card__body">
                      <Heading as="h3">
                        <Link to={item.route}>{item.title}</Link>
                      </Heading>
                      <p className="margin-bottom--none">
                        {item.verifiedAt ? `制度確認 ${item.verifiedAt}` : '公式情報を確認済み'}
                      </p>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </section>
        ))}

        <aside className="alert alert--secondary">
          <strong>一覧にない資格について</strong>
          <p className="margin-bottom--none">
            サイト内にページが存在しても、開催状況・確認日・公式情報のいずれかが不足している場合は
            検索公開の対象外です。ページを削除せず、再確認できるまでnoindexで維持します。
          </p>
        </aside>
      </main>
    </Layout>
  );
}
