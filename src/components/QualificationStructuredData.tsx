import React, {useMemo} from 'react';
import Head from '@docusaurus/Head';
import {usePluginData} from '@docusaurus/useGlobalData';
import {useDoc} from '@docusaurus/plugin-content-docs/client';

type Qualification = {
  id: string;
  title: string;
  route: string;
  summary: string;
  categoryKey: string;
  category: string;
  credentialType: string;
  officialUrl: string | null;
  availabilityStatus: 'active' | 'ended' | 'check';
};

type QualificationIndexData = {
  items: Qualification[];
};

function normalizeRoute(value: string) {
  return value.replace(/\/+$/, '') || '/';
}

export default function QualificationStructuredData(): React.JSX.Element | null {
  const {metadata} = useDoc();
  const data = usePluginData('qualification-index') as QualificationIndexData;

  const current = useMemo(
    () =>
      data.items.find(
        (item) => normalizeRoute(item.route) === normalizeRoute(metadata.permalink),
      ),
    [data.items, metadata.permalink],
  );

  if (!current) return null;

  const pageUrl = `https://shikaku.antonbase.com${current.route}`;
  const description =
    current.summary ||
    `${current.title}の試験制度・受験条件・学習情報を整理した資格ガイドです。`;

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: `${current.title}｜資格カタログ`,
        description,
        inLanguage: 'ja-JP',
        isPartOf: {
          '@type': 'WebSite',
          '@id': 'https://shikaku.antonbase.com/#website',
          url: 'https://shikaku.antonbase.com/',
          name: '資格カタログ',
        },
        mainEntity: {'@id': `${pageUrl}#credential`},
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
            item: 'https://shikaku.antonbase.com/',
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: current.category,
            item: `https://shikaku.antonbase.com/docs/${current.categoryKey}/`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: current.title,
            item: pageUrl,
          },
        ],
      },
      {
        '@type': 'EducationalOccupationalCredential',
        '@id': `${pageUrl}#credential`,
        name: current.title,
        description,
        url: pageUrl,
        credentialCategory:
          current.credentialType === '区分未整理'
            ? '資格・検定'
            : current.credentialType,
        ...(current.officialUrl ? {sameAs: current.officialUrl} : {}),
      },
    ],
  };

  return (
    <Head>
      {current.availabilityStatus === 'check' ? (
        <meta name="robots" content="noindex,follow" />
      ) : null}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
}
