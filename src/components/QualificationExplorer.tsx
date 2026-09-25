import React, {useMemo, useState} from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './QualificationExplorer.module.css';

type StudyHours = {
  min: number | null;
  max: number | null;
  label: string;
};

type Qualification = {
  id: string;
  title: string;
  route: string;
  categoryKey: string;
  category: string;
  summary: string;
  credentialType: string;
  difficulty: string;
  studyHours: StudyHours;
  examMethod: string;
  officialUrl: string | null;
  updatedFor2026: boolean;
  searchText: string;
};

type QualificationData = {
  generatedAt: string;
  count: number;
  qualifications: Qualification[];
};

type Props = {
  qualificationData: QualificationData;
};

const CATEGORY_ORDER = [
  'ビジネス',
  'IT・技術',
  '法律・会計',
  '医療・福祉',
  'ライフスタイル',
  '安全・環境',
  'クリエイティブ',
  '業界別',
  'その他',
];

function includesQuery(item: Qualification, rawQuery: string) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;
  const tokens = query.split(/\s+/).filter(Boolean);
  return tokens.every((token) => item.searchText.includes(token));
}

function SortIcon({active}: {active: boolean}) {
  return <span aria-hidden="true">{active ? '●' : '○'}</span>;
}

export default function QualificationExplorer({
  qualificationData,
}: Props): React.JSX.Element {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('すべて');
  const [difficulty, setDifficulty] = useState('すべて');
  const [credentialType, setCredentialType] = useState('すべて');
  const [examMethod, setExamMethod] = useState('すべて');
  const [sortKey, setSortKey] = useState('recommended');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const categories = useMemo(() => {
    const values = new Set(qualificationData.qualifications.map((item) => item.category));
    return CATEGORY_ORDER.filter((item) => values.has(item));
  }, [qualificationData.qualifications]);

  const filtered = useMemo(() => {
    const result = qualificationData.qualifications.filter((item) => {
      if (!includesQuery(item, query)) return false;
      if (category !== 'すべて' && item.category !== category) return false;
      if (difficulty !== 'すべて' && item.difficulty !== difficulty) return false;
      if (credentialType !== 'すべて' && item.credentialType !== credentialType) return false;
      if (examMethod !== 'すべて' && !item.examMethod.includes(examMethod)) return false;
      return true;
    });

    if (sortKey === 'name') {
      return [...result].sort((a, b) => a.title.localeCompare(b.title, 'ja'));
    }
    if (sortKey === 'study') {
      return [...result].sort((a, b) => {
        const aValue = a.studyHours.min ?? Number.MAX_SAFE_INTEGER;
        const bValue = b.studyHours.min ?? Number.MAX_SAFE_INTEGER;
        return aValue - bValue;
      });
    }
    return result;
  }, [
    qualificationData.qualifications,
    query,
    category,
    difficulty,
    credentialType,
    examMethod,
    sortKey,
  ]);

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => qualificationData.qualifications.find((item) => item.id === id))
        .filter((item): item is Qualification => Boolean(item)),
    [selectedIds, qualificationData.qualifications],
  );

  const toggleCompare = (id: string) => {
    setSelectedIds((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= 3) return current;
      return [...current, id];
    });
  };

  const resetFilters = () => {
    setQuery('');
    setCategory('すべて');
    setDifficulty('すべて');
    setCredentialType('すべて');
    setExamMethod('すべて');
    setSortKey('recommended');
  };

  const hasActiveFilters =
    query ||
    category !== 'すべて' ||
    difficulty !== 'すべて' ||
    credentialType !== 'すべて' ||
    examMethod !== 'すべて' ||
    sortKey !== 'recommended';

  return (
    <Layout
      title="資格検索・比較"
      description="資格・検定を名前、カテゴリ、難易度、資格区分、試験方式、勉強時間で絞り込み、最大3件まで比較できます。">
      <Head>
        <meta
          name="robots"
          content="index,follow,max-image-preview:large,max-snippet:-1"
        />
      </Head>

      <main className={styles.page}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>QUALIFICATION EXPLORER</p>
            <Heading as="h1">資格を、条件から探す。</Heading>
            <p className={styles.lead}>
              名前を知っている資格だけを見るのではなく、分野・難易度・資格区分・試験方式・勉強時間から候補を発見できます。
            </p>
            <div className={styles.heroStats}>
              <span>
                <strong>{qualificationData.count}</strong>
                <small>掲載資格</small>
              </span>
              <span>
                <strong>{categories.length}</strong>
                <small>カテゴリ</small>
              </span>
              <span>
                <strong>3</strong>
                <small>同時比較</small>
              </span>
            </div>
          </div>
        </section>

        <section className={`container ${styles.workspace}`}>
          <aside className={styles.filters} aria-label="資格の絞り込み">
            <div className={styles.filterHeader}>
              <div>
                <span className={styles.filterKicker}>FILTER</span>
                <Heading as="h2">絞り込み</Heading>
              </div>
              {hasActiveFilters ? (
                <button className={styles.resetButton} type="button" onClick={resetFilters}>
                  すべて解除
                </button>
              ) : null}
            </div>

            <label className={styles.field}>
              <span>キーワード</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="例：宅建、AWS、英語、会計"
              />
            </label>

            <label className={styles.field}>
              <span>カテゴリ</span>
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option>すべて</option>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>難易度</span>
              <select value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
                <option>すべて</option>
                <option>初級</option>
                <option>中級</option>
                <option>上級</option>
                <option>複数レベル</option>
                <option>未整理</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>資格区分</span>
              <select
                value={credentialType}
                onChange={(event) => setCredentialType(event.target.value)}>
                <option>すべて</option>
                <option>国家資格</option>
                <option>公的資格</option>
                <option>民間資格</option>
                <option>国際資格</option>
                <option>区分未整理</option>
              </select>
            </label>

            <label className={styles.field}>
              <span>試験方式</span>
              <select value={examMethod} onChange={(event) => setExamMethod(event.target.value)}>
                <option>すべて</option>
                <option>CBT</option>
                <option>筆記</option>
                <option>実技</option>
                <option>面接</option>
                <option>オンライン</option>
              </select>
            </label>

            <div className={styles.sourceNote}>
              <strong>自動更新</strong>
              <p>
                この検索データは資格記事のMarkdownからビルド時に生成されます。別DBへの二重入力はありません。
              </p>
            </div>
          </aside>

          <div className={styles.results}>
            <div className={styles.resultToolbar}>
              <div>
                <span className={styles.resultCount}>
                  <strong>{filtered.length}</strong> 件
                </span>
                {query ? <span className={styles.queryLabel}>「{query}」</span> : null}
              </div>

              <div className={styles.sortGroup} aria-label="並び順">
                <button
                  type="button"
                  className={sortKey === 'recommended' ? styles.sortActive : ''}
                  onClick={() => setSortKey('recommended')}>
                  <SortIcon active={sortKey === 'recommended'} /> 標準
                </button>
                <button
                  type="button"
                  className={sortKey === 'study' ? styles.sortActive : ''}
                  onClick={() => setSortKey('study')}>
                  <SortIcon active={sortKey === 'study'} /> 勉強時間
                </button>
                <button
                  type="button"
                  className={sortKey === 'name' ? styles.sortActive : ''}
                  onClick={() => setSortKey('name')}>
                  <SortIcon active={sortKey === 'name'} /> 名前
                </button>
              </div>
            </div>

            {filtered.length ? (
              <div className={styles.cardGrid}>
                {filtered.map((item) => {
                  const selectedForCompare = selectedIds.includes(item.id);
                  return (
                    <article key={item.id} className={styles.card}>
                      <div className={styles.cardTop}>
                        <span className={styles.categoryBadge}>{item.category}</span>
                        {item.updatedFor2026 ? (
                          <span className={styles.freshBadge}>2026情報あり</span>
                        ) : null}
                      </div>

                      <Heading as="h3">
                        <Link to={item.route}>{item.title}</Link>
                      </Heading>

                      <p className={styles.summary}>
                        {item.summary || '概要は資格詳細ページで確認できます。'}
                      </p>

                      <dl className={styles.facts}>
                        <div>
                          <dt>区分</dt>
                          <dd>{item.credentialType}</dd>
                        </div>
                        <div>
                          <dt>難易度</dt>
                          <dd>{item.difficulty}</dd>
                        </div>
                        <div>
                          <dt>勉強時間</dt>
                          <dd>{item.studyHours.label}</dd>
                        </div>
                        <div>
                          <dt>方式</dt>
                          <dd>{item.examMethod}</dd>
                        </div>
                      </dl>

                      <div className={styles.cardActions}>
                        <Link className={styles.detailLink} to={item.route}>
                          詳細を見る <span aria-hidden="true">→</span>
                        </Link>
                        <button
                          type="button"
                          className={selectedForCompare ? styles.compareSelected : styles.compareButton}
                          onClick={() => toggleCompare(item.id)}
                          disabled={!selectedForCompare && selectedIds.length >= 3}
                          aria-pressed={selectedForCompare}>
                          {selectedForCompare ? '比較から外す' : '比較に追加'}
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className={styles.emptyState}>
                <span aria-hidden="true">⌕</span>
                <Heading as="h3">条件に合う資格が見つかりませんでした</Heading>
                <p>キーワードを短くするか、絞り込みを減らしてみてください。</p>
                <button type="button" onClick={resetFilters}>条件をリセット</button>
              </div>
            )}
          </div>
        </section>

        {selected.length ? (
          <section className={styles.compareDock} aria-label="資格比較">
            <div className={`container ${styles.compareInner}`}>
              <div className={styles.compareTitle}>
                <span>COMPARE</span>
                <strong>{selected.length}/3件を比較</strong>
              </div>

              <div className={styles.compareTableWrap}>
                <table className={styles.compareTable}>
                  <thead>
                    <tr>
                      <th>項目</th>
                      {selected.map((item) => (
                        <th key={item.id}>
                          <Link to={item.route}>{item.title}</Link>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th>分野</th>
                      {selected.map((item) => <td key={item.id}>{item.category}</td>)}
                    </tr>
                    <tr>
                      <th>区分</th>
                      {selected.map((item) => <td key={item.id}>{item.credentialType}</td>)}
                    </tr>
                    <tr>
                      <th>難易度</th>
                      {selected.map((item) => <td key={item.id}>{item.difficulty}</td>)}
                    </tr>
                    <tr>
                      <th>勉強時間</th>
                      {selected.map((item) => <td key={item.id}>{item.studyHours.label}</td>)}
                    </tr>
                    <tr>
                      <th>試験方式</th>
                      {selected.map((item) => <td key={item.id}>{item.examMethod}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>

              <button
                className={styles.clearCompare}
                type="button"
                onClick={() => setSelectedIds([])}>
                比較をクリア
              </button>
            </div>
          </section>
        ) : null}
      </main>
    </Layout>
  );
}
