import React from 'react';
import Head from '@docusaurus/Head';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { applyTrailingSlash } from '@docusaurus/utils-common';

export default function BlogStructuredData({ data }: { data: unknown }): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const origin = new URL(siteConfig.url).origin;
  const content = JSON.stringify(data, (_key, value) => {
    if (!value || typeof value !== 'object' || !['Blog', 'BlogPosting'].includes(value['@type'])) {
      return value;
    }

    const normalized = { ...value };
    for (const key of ['@id', 'url', 'mainEntityOfPage']) {
      if (typeof normalized[key] !== 'string') {
        continue;
      }
      const url = new URL(normalized[key], siteConfig.url);
      if (url.origin === origin) {
        url.pathname = applyTrailingSlash(url.pathname, siteConfig);
        normalized[key] = url.href;
      }
    }
    return normalized;
  });

  return (
    <Head>
      <script type="application/ld+json">{content.replace(/</g, '\\u003c')}</script>
    </Head>
  );
}
