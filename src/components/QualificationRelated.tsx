import React, {useMemo} from 'react';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Heading from '@theme/Heading';
import styles from './QualificationRelated.module.css';

type CompactQualification = {
  id: string;
  title: string;
  route: string;
  categoryKey: string;
  category: string;
  section: string;
  credentialType: string;
  difficulty: string;
  studyHours: string;
  availabilityStatus: 'active' | 'ended' | 'check';
};

type QualificationIndexData = {
  count: number;
  items: CompactQualification[];
};

function normalizeRoute(value: string) {
  return value.replace(/\/+$/, '') || '/';
}

function scoreRelated(
  current: CompactQualification,
  candidate: CompactQualification,
) {
  let score = 0;
  if (candidate.categoryKey === current.categoryKey) score += 4;
  if (candidate.section === current.section) score += 7;
  if (
    current.credentialType !== '区分未整理' &&
    candidate.credentialType === current.credentialType
  ) {
    score += 2;
  }
  if (
    current.difficulty !== '未整理' &&
    candidate.difficulty === current.difficulty
  ) {
    score += 1;
  }
  return score;
}

export default function QualificationRelated(): React.JSX.Element | null {
  const {metadata} = useDoc();
  const data = usePluginData('qualification-index') as QualificationIndexData;

  const current = useMemo(
    () =>
      data.items.find(
        (item) => normalizeRoute(item.route) === normalizeRoute(metadata.permalink),
      ),
    [data.items, metadata.permalink],
  );

  const related = useMemo(() => {
    if (!current) return [];
    return data.items
      .filter((item) => item.id !== current.id)
      .filter((item) =>
        current.availabilityStatus === 'active'
          ? item.availabilityStatus === 'active'
          : item.availabilityStatus === current.availabilityStatus,
      )
      .map((item) => ({item, score: scoreRelated(current, item)}))
      .filter(({score}) => score >= 4)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'ja'))
      .slice(0, 4)
      .map(({item}) => item);
  }, [current, data.items]);

  if (!current) return null;

  return (
      <section className={styles.section} aria-labelledby="related-qualifications">
        <div className={styles.headingRow}>
          <div>
            <span className={styles.kicker}>NEXT OPTIONS</span>
            <Heading as="h2" id="related-qualifications">
              この資格とあわせて見る
            </Heading>
          </div>
          <Link className={styles.exploreLink} to="/explore/">
            条件から探す <span aria-hidden="true">→</span>
          </Link>
        </div>

        {related.length ? (
          <div className={styles.grid}>
            {related.map((item) => (
              <Link key={item.id} className={styles.card} to={item.route}>
                <span className={styles.category}>{item.category}</span>
                <strong>{item.title}</strong>
                <dl>
                  <div>
                    <dt>難易度</dt>
                    <dd>{item.difficulty === '未整理' ? '—' : item.difficulty}</dd>
                  </div>
                  <div>
                    <dt>勉強時間</dt>
                    <dd>{item.studyHours === '情報なし' ? '—' : item.studyHours}</dd>
                  </div>
                </dl>
                <span className={styles.arrow} aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>近い資格は検索画面から条件を変えて探せます。</p>
            <Link to="/explore/">資格検索を開く →</Link>
          </div>
        )}
      </section>
  );
}
