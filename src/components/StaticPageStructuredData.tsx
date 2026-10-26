import React from 'react';
import Head from '@docusaurus/Head';

const SITE_URL = 'https://shikaku.antonbase.com';

type Props = {
  /** ページのパス。末尾スラッシュは付けても付けなくてもよい。 */
  path: string;
  /** ページのタイトル（front matter / Layout の title と同じ文言）。 */
  title: string;
  /** ページの description（front matter と同じ文言）。 */
  description: string;
};

/**
 * 資格 DB に紐づかない固定ページ（/birumen-shikaku/ など）用の構造化データ。
 *
 * docs の QualificationStructuredData と同じ @graph 構成に合わせ、
 * WebPage + BreadcrumbList を出す。資格エンティティ（EducationalOccupationalCredential）
 * を持たないページなので、その部分だけ省いている。
 */
export default function StaticPageStructuredData({
  path,
  title,
  description,
}: Props): React.JSX.Element {
  const normalized = path.endsWith('/') ? path : `${path}/`;
  const pageUrl = `${SITE_URL}${normalized}`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${title}｜資格カタログ`,
        description,
        inLanguage: 'ja-JP',
        isPartOf: {
          '@type': 'WebSite',
          '@id': `${SITE_URL}/#website`,
          url: `${SITE_URL}/`,
          name: '資格カタログ',
        },
        breadcrumb: {'@id': `${pageUrl}#breadcrumb`},
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${pageUrl}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: '資格カタログ',
            item: `${SITE_URL}/`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
    </Head>
  );
}
