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
    title: '意外な資格との出会い',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        「BBQインストラクター」「チョコレート検定」「ねこ検定」...
        え、こんな資格があるの!? という驚きと発見がここに。
        あなたの新しい趣味が見つかるかも！
      </>
    ),
  },
  {
    title: '遊び心満載のガチャ機能',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        何を勉強しようか迷ったら、運命の資格ガチャを回してみよう！
        AI(ランダム)があなたにぴったりの資格を提案します。
        思わぬ出会いが、新しい人生の扉を開くかも？
      </>
    ),
  },
  {
    title: '真面目な資格も完全網羅',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        もちろん、ITパスポート、FP、簿記など、
        キャリアアップに役立つ定番資格も充実。
        遊びも学びも、すべてがここに揃っています！
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
