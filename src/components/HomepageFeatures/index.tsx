import type { ReactNode } from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '網羅的なデータベース',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        ビジネス、IT、語学、医療など、あらゆるジャンルの資格情報を体系的に整理。
        必要な情報にすぐにアクセスできます。
      </>
    ),
  },
  {
    title: '効率的な学習',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        試験の概要、難易度、合格率から、おすすめの学習方法や参考書まで。
        合格への最短ルートをサポートします。
      </>
    ),
  },
  {
    title: 'コミュニティ主導',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        実際の受験者や合格者の声を反映。
        最新の試験傾向や実務での活用事例など、生きた情報が集まります。
      </>
    ),
  },
];

function Feature({ title, Svg, description }: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="card padding--lg h-100">
        <div className="text--center">
          <Svg className={styles.featureSvg} role="img" />
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h3">{title}</Heading>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
