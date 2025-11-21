import React, { type ReactNode } from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import QualificationGacha from '@site/src/components/QualificationGacha';
import RandomQualificationCarousel from '@site/src/components/RandomQualificationCarousel';
import CategoryShowcase from '@site/src/components/CategoryShowcase';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  const triviaList = [
    "「ねこ検定」という資格があるのを知っていますか？",
    "「BBQインストラクター」になれば、ヒーローになれるかも？",
    "「チョコレート検定」で、甘い知識を深めよう！",
    "「掃除能力検定」で、お部屋も心もピカピカに。",
    "「夜景観光士検定」なんてロマンチックな資格も！",
    "資格は、新しい自分へのパスポート。",
  ];
  const [trivia, setTrivia] = React.useState("");

  React.useEffect(() => {
    setTrivia(triviaList[Math.floor(Math.random() * triviaList.length)]);
  }, []);

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={styles.sakuraContainer}>
        {/* Generating random sakura petals */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="sakura-particle"
            style={{
              left: `${Math.random() * 100}%`,
              animationDuration: `${5 + Math.random() * 10}s`,
              animationDelay: `${Math.random() * 5}s`
            }}
          />
        ))}
      </div>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <p className={styles.heroTrivia}>💡 {trivia}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro"
            style={{ color: '#1e3a8a', borderColor: '#d97706', borderWidth: '2px' }}>
            資格一覧を見る 📚
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />">
      <HomepageHeader />
      <main>
        <RandomQualificationCarousel />
        <QualificationGacha />
        <CategoryShowcase />
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
