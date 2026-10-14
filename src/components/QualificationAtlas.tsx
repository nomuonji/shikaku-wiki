import React from 'react';
import Link from '@docusaurus/Link';
import {usePluginData} from '@docusaurus/useGlobalData';
import {trackEvent} from '@site/src/utils/analytics';
import styles from './QualificationAtlas.module.css';

type Entry = {
  id: string; title: string; route: string; category: string; categoryKey: string;
  studyHours: string; difficulty: string; indexReady: boolean; availabilityStatus: string;
};
type Data = {items: Entry[]};
const fields = ['すべて','ビジネス','IT・技術','法律・会計','医療・福祉','ライフスタイル','安全・環境','クリエイティブ','業界別'];
const ranges = [
  {label:'すべて',limit:Infinity},
  {label:'〜50時間',limit:50},
  {label:'〜150時間',limit:150},
  {label:'〜300時間',limit:300},
  {label:'〜600時間',limit:600},
];
function hours(label: string): number | null {
  if (label === '情報なし') return null;
  const match = label.match(/(\d[\d,]*)\s*(?:〜|～|~|–|—|-)?/);
  return match ? Number(match[1].replace(/,/g,'')) : null;
}
export default function QualificationAtlas(): React.JSX.Element {
  const data = usePluginData('qualification-index') as Data;
  const [field,setField] = React.useState('すべて');
  const [range,setRange] = React.useState(0);
  const [includeUnknown,setIncludeUnknown] = React.useState(false);
  const entries = React.useMemo(() => data.items.filter(item =>
    item.availabilityStatus === 'active' && item.indexReady &&
    (field === 'すべて' || item.category === field) &&
    (range === 0 || (hours(item.studyHours) !== null
      ? hours(item.studyHours)! <= ranges[range].limit : includeUnknown))
  ),[data.items,field,range,includeUnknown]);
  const byField = React.useMemo(() => fields.slice(1).map(name => ({
    name, count: entries.filter(item => item.category === name).length
  })),[entries]);
  const max = Math.max(1,...byField.map(item => item.count));
  const sampled = entries.slice().sort((a,b) =>
    (hours(a.studyHours) ?? Infinity) - (hours(b.studyHours) ?? Infinity) ||
    a.title.localeCompare(b.title,'ja')
  ).slice(0,6);
  const explore = new URLSearchParams();
  if (field !== 'すべて') explore.set('category',field);
  const exploreUrl = '/explore/' + (explore.toString() ? '?' + explore.toString() : '');
  return <section className={styles.atlas} aria-labelledby="atlas-heading">
    <div className={styles.intro}>
      <div><p className={styles.kicker}>QUALIFICATION / DECISION ATLAS</p>
        <h2 id="atlas-heading">資格の選択肢を、見渡す。</h2>
        <p>分野と学習時間の目安を動かすと、候補の分布が変わります。まず全体をつかみ、気になった資格の詳細へ。</p>
      </div>
      <div className={styles.total} aria-live="polite"><strong>{entries.length}</strong><span>条件に合う資格</span></div>
    </div>
    <div className={styles.controls}>
      <fieldset className={styles.fieldset}><legend>興味のある分野</legend>
        <div className={styles.pills}>{fields.map(item => <button type="button" key={item}
          aria-pressed={field===item} className={field===item?styles.active:styles.pill}
          onClick={()=>{setField(item);trackEvent('qualification_atlas_filter',{field:item});}}>{item}</button>)}</div>
      </fieldset>
      <fieldset className={styles.fieldset}><legend>学習時間の目安（下限値で分類）</legend>
        <div className={styles.pills}>{ranges.map((item,index)=><button type="button"
          key={item.label} aria-pressed={range===index}
          className={range===index?styles.active:styles.pill} onClick={()=>setRange(index)}>{item.label}</button>)}</div>
        {range!==0 && <label className={styles.unknown}><input type="checkbox" checked={includeUnknown}
          onChange={event=>setIncludeUnknown(event.target.checked)} /> 学習時間が不明の資格も含める</label>}
      </fieldset>
    </div>
    <div className={styles.visual} aria-label="分野ごとの該当資格数">
      <div className={styles.axis}><span>分野別の候補数</span><span>多いほどバーが長い</span></div>
      {byField.map(item => <button type="button" className={styles.barRow} key={item.name}
        onClick={()=>setField(item.name)} aria-label={item.name+'、'+item.count+'件。分野で絞る'}>
        <span className={styles.barName}>{item.name}</span>
        <span className={styles.track}><span className={styles.fill} style={{width:(item.count/max*100)+'%'}} /></span>
        <strong>{item.count}</strong>
      </button>)}
    </div>
    <div className={styles.footer}>
      <div><h3>今の条件から見る</h3><p>勉強時間は公式の標準所要時間とは限らず、記事に記載された参考値です。未掲載・未確認の資格は含みません。</p></div>
      <div className={styles.samples}>{sampled.length ? sampled.map(item=><Link key={item.id} to={item.route}
        onClick={()=>trackEvent('qualification_open',{source:'home_atlas',qualification_id:item.id})}>
        <span>{item.title}</span><small>{item.studyHours === '情報なし'?'時間情報なし':item.studyHours} →</small>
      </Link>) : <p>該当する資格がありません。条件を広げてください。</p>}</div>
    </div>
    <Link className={styles.explore} to={exploreUrl}>すべての候補を検索・比較する <span aria-hidden="true">↗</span></Link>
  </section>;
}
