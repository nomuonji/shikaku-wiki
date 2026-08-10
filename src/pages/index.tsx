import React from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className="hero hero--primary">
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            資格一覧を見る 📚
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): React.JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="さまざまな資格情報を掲載する">
      <HomepageHeader />
    </Layout>
  );
}
