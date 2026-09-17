import React from 'react';
import { useBlogPostStructuredData } from '@docusaurus/plugin-content-blog/client';
import BlogStructuredData from '@site/src/components/BlogStructuredData';

export default function BlogPostStructuredData(): React.JSX.Element {
  return <BlogStructuredData data={useBlogPostStructuredData()} />;
}
