import React from 'react';
import { useBlogListPageStructuredData } from '@docusaurus/plugin-content-blog/client';
import type { Props } from '@theme/BlogListPage/StructuredData';
import BlogStructuredData from '@site/src/components/BlogStructuredData';

export default function BlogListPageStructuredData(props: Props): React.JSX.Element {
  return <BlogStructuredData data={useBlogListPageStructuredData(props)} />;
}
