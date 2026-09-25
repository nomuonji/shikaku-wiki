import React, {useMemo} from 'react';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import styles from './QualificationQuickFacts.module.css';

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
  examMethod: string;
  officialUrl: string | null;
  updatedFor2026: boolean;
  availabilityStatus: 'active' | 'ended' | 'check';
};

type QualificationIndexData = {
  count: number;
  items: CompactQualification[];
};

const CATEGORY_VISUALS: Record<string, {code: string; label: string}> = {
  business: {code: 'BIZ', label: 'Business'},
  technology: {code: 'TECH', label: 'Technology'},
  'legal-accounting': {code: 'LAW', label: 'Legal & Accounting'},
  'medical-welfare': {code: 'MED', label: 'Medical & Welfare'},
  lifestyle: {code: 'LIFE', label: 'Lifestyle'},
  'safety-environment': {code: 'SAFE', label: 'Safety & Environment'},
  creative: {code: 'CREATE', label: 'Creative'},
  industry: {code: 'FIELD', label: 'Industry'},
  etc: {code: 'OTHER', label: 'Other'},
};

function normalizeRoute(value: string) {
  return value.replace(/\/+$/, '') || '/';
}

export default function QualificationQuickFacts(): React.JSX.Element | null {
  const {metadata} = useDoc();
  const data = usePluginData('qualification-index') as QualificationIndexData;

  const current = useMemo(
    () =>
      data.items.find(
        (item) => normalizeRoute(item.route) === normalizeRoute(metadata.permalink),
      ),
    [data.items, metadata.permalink],
  );

  if (!current) return null;

  const facts = [
    current.credentialType !== '区分未整理'
      ? {label: '区分', value: current.credentialType}
      : null,
    current.difficulty !== '未整理'
      ? {label: '難易度', value: current.difficulty}
      : null,
    current.studyHours !== '情報なし'
      ? {label: '勉強時間', value: current.studyHours}
      : null,
    current.examMethod !== '未整理'
      ? {label: '試験方式', value: current.examMethod}
      : null,
  ].filter((fact): fact is {label: string; value: string} => Boolean(fact));

  const browseUrl = `/explore?category=${encodeURIComponent(current.category)}`;
  const visual = CATEGORY_VISUALS[current.categoryKey] ?? {
    code: 'CERT',
    label: current.category,
  };

  return (
    <aside
      className={styles.panel}
      data-category={current.categoryKey}
      aria-label="資格の要点">
      <div className={styles.visualBand} aria-hidden="true">
        <div className={styles.visualMark}>
          <span>{visual.code}</span>
          <small>{visual.label}</small>
        </div>
        <div className={styles.visualLines}>
          <i />
          <i />
          <i />
        </div>
        <span className={styles.visualCategory}>{current.category}</span>
      </div>
      {current.availabilityStatus !== 'active' ? (
        <div
          className={
            current.availabilityStatus === 'ended'
              ? styles.statusEnded
              : styles.statusNotice
          }>
          <strong>
            {current.availabilityStatus === 'ended'
              ? 'この資格・検定は終了済みです'
              : '現在の開催状況は公式情報で要確認です'}
          </strong>
          <span>
            比較用の過去情報として掲載しています。新規受験を考える場合は公式情報を確認してください。
          </span>
        </div>
      ) : null}

      <div className={styles.top}>
        <div>
          <span className={styles.kicker}>AT A GLANCE</span>
          <strong>資格の要点</strong>
        </div>
        <div className={styles.actions}>
          <Link to={browseUrl}>同じ分野を比較</Link>
          {current.officialUrl ? (
            <a
              href={current.officialUrl}
              target="_blank"
              rel="noopener noreferrer">
              公式情報 ↗
            </a>
          ) : null}
        </div>
      </div>

      {facts.length ? (
        <dl className={styles.facts}>
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt>{fact.label}</dt>
              <dd>{fact.value}</dd>
            </div>
          ))}
          {current.updatedFor2026 ? (
            <div className={styles.fresh}>
              <dt>更新</dt>
              <dd>2026情報あり</dd>
            </div>
          ) : null}
        </dl>
      ) : (
        <p className={styles.pending}>
          詳細データは本文と公式情報を確認してください。
        </p>
      )}

      <p className={styles.note}>
        表示値は記事本文から自動抽出した要約です。受験前は公式情報を確認してください。
      </p>
    </aside>
  );
}
