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
      description="難易度・合格率・勉強法がわかる、資格・検定の総合情報サイト。資格の先にある仕事をしごと図鑑で探索できます。">
      <HomepageHeader />
      <main>
        <div className="container">
          <section className="row" style={{ marginTop: '2.5rem' }}>
            <div className="col">
              <div
                style={{
                  border: '1px solid #c9d3e1',
                  borderRadius: '12px',
                  padding: '1.5rem 2rem',
                  background: 'var(--ifm-color-secondary-contrast-background)',
                }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  🧭 資格の先にある「仕事」を探す
                </h2>
                <p>
                  資格は、その先の仕事があってこそ意味を持ちます。
                  <strong>「しごと図鑑」</strong>では、普通に生きていたら出会わない仕事を、
                  業界・扱うもの・感覚のつながりから探索できます。
                </p>
                <Link
                  className="button button--secondary button--md"
                  to="https://job.antonbase.com">
                  しごと図鑑で仕事を探索する →
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
