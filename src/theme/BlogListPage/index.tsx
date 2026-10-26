import React, {type ReactNode} from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import {
  PageMetadata,
  HtmlClassNameProvider,
  ThemeClassNames,
} from '@docusaurus/theme-common';
import BlogLayout from '@theme/BlogLayout';
import BlogListPaginator from '@theme/BlogListPaginator';
import SearchMetadata from '@theme/SearchMetadata';
import BlogPostItems from '@theme/BlogPostItems';
import BlogListPageStructuredData from '@theme/BlogListPage/StructuredData';
import Heading from '@theme/Heading';
import type {Props} from '@theme/BlogListPage';

/**
 * 一覧ページ（/blog/）に h1 が無く、記事タイトルの h2 だけが並んでいた。
 * 見出し階層を直すため、ブログ名と説明文のヘッダーを記事一覧の前に置く。
 * 既定実装にヘッダーを足しただけなので、ページネーションや構造化データの
 * 挙動は Docusaurus 標準のまま。
 */
function BlogListPageMetadata({metadata}: Props): ReactNode {
  const {
    siteConfig: {title: siteTitle},
  } = useDocusaurusContext();
  const {blogDescription, blogTitle, permalink} = metadata;
  const isBlogOnlyMode = permalink === '/';
  const title = isBlogOnlyMode ? siteTitle : blogTitle;
  return (
    <>
      <PageMetadata title={title} description={blogDescription} />
      <SearchMetadata tag="blog_posts_list" />
    </>
  );
}

function BlogListPageContent({metadata, items, sidebar}: Props): ReactNode {
  return (
    <BlogLayout sidebar={sidebar}>
      <header className="margin-bottom--lg">
        <Heading as="h1">{metadata.blogTitle}</Heading>
        {metadata.blogDescription ? (
          <p className="margin-bottom--none">{metadata.blogDescription}</p>
        ) : null}
      </header>
      <BlogPostItems items={items} />
      <BlogListPaginator metadata={metadata} />
    </BlogLayout>
  );
}

export default function BlogListPage(props: Props): ReactNode {
  return (
    <HtmlClassNameProvider
      className={clsx(
        ThemeClassNames.wrapper.blogPages,
        ThemeClassNames.page.blogListPage,
      )}>
      <BlogListPageMetadata {...props} />
      <BlogListPageStructuredData {...props} />
      <BlogListPageContent {...props} />
    </HtmlClassNameProvider>
  );
}
