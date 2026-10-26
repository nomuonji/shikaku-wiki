
import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import styles from './eligibility-guides.module.css';
import StaticPageStructuredData from '@site/src/components/StaticPageStructuredData';

const source='https://www.shoubo-shiken.or.jp/kikenbutsu/qualified01.html';
const groups=[{title:'第1類 または 第6類',hint:'酸化性固体／酸化性液体',choices:[1,6]},{title:'第2類 または 第4類',hint:'可燃性固体／引火性液体',choices:[2,4]},{title:'第3類',hint:'自然発火性物質・禁水性物質',choices:[3]},{title:'第5類',hint:'自己反応性物質',choices:[5]}];

export default function KikenbutsuRoute():React.JSX.Element{
 const [held,setHeld]=React.useState<number[]>([]);
 const toggle=(n:number)=>setHeld(prev=>prev.includes(n)?prev.filter(x=>x!==n):[...prev,n].sort((a,b)=>a-b));
 const covered=groups.map(g=>g.choices.some(n=>held.includes(n)));
 const remaining=groups.filter((_,i)=>!covered[i]);
 return <Layout title="甲種危険物取扱者の受験資格｜乙4から進む4種類・実務2年・化学単位" description="乙4だけで甲種を受験できる？4種類の免状の組み合わせをチェック。実務経験2年、化学15単位、化学系学位による受験ルートと必要書類を公式制度から整理。">
 <Head><link rel="canonical" href="https://shikaku.antonbase.com/kikenbutsu-kou-juken-shikaku/"/></Head>
 <StaticPageStructuredData path="/kikenbutsu-kou-juken-shikaku/" title="甲種危険物取扱者の受験資格｜乙4から進む4種類・実務2年・化学単位" description="乙4だけで甲種を受験できる？4種類の免状の組み合わせをチェック。実務経験2年、化学15単位、化学系学位による受験ルートと必要書類を公式制度から整理。" />
 <main className={styles.shell}><div className={styles.crumbs}><Link to="/juken-shikaku/">受験資格を調べる</Link> / 危険物取扱者 甲種</div>
 <header className={styles.hero}><span className={styles.kicker}>Dangerous materials / 受験資格</span><h1>乙4だけで甲種を受けられる？<br/>保有免状から確認する受験経路</h1><p className={styles.lead}>結論からいうと、乙4の免状だけでは甲種の「4種類ルート」は満たしません。しかし、乙種免状の交付後に所定の危険物取扱いを2年以上経験した場合や、化学に関する学歴・単位などの別の受験経路があります。以下では条件を混ぜずに分けます。</p></header>
 <div className={styles.layout}>
 <div>
 <section className={styles.section} id="four"><h2>乙種4種類の組み合わせをチェック</h2><p>甲種危険物取扱者の「乙種4種類以上」ルートでは、種類が4つあれば何でもよいわけではありません。公式は4つのグループを指定しています。免状の交付を受けている類を選んでください（合格のみ・申請中は含めません）。</p>
 <div className={styles.card}><h3>保有する乙種免状を選択</h3>{[1,2,3,4,5,6].map(n=><label key={n} className={styles.group}><input type="checkbox" checked={held.includes(n)} onChange={()=>toggle(n)}/><div><strong>乙種第{n}類</strong><span>免状交付済みのときに選択</span></div></label>)}
 <div className={styles.result} role="status" aria-live="polite"><strong>{remaining.length===0?'4種類ルートの組み合わせを満たしています':'4種類ルートで不足しているグループがあります'}</strong>
 {remaining.length===0?'選択した乙種免状がすべて交付済みなら、公式が示す種類の組み合わせを満たします。願書には乙種免状を提示します。':<>満たしているグループは {4-remaining.length}/4。必要な追加グループ：{remaining.map(x=>x.title).join('、')}。これは4種類ルートだけの判定です。他の経路で出願できる場合があります。</>}
 </div><p className={styles.small}>判定対象は免状の種類の組み合わせのみです。試験実施機関による受験資格審査を代行するものではありません。</p></div></section>
 <section className={styles.section} id="routes"><h2>4種類以外にもある甲種の受験経路</h2><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>経路</th><th>公式の条件の概要</th><th>主な証明書</th></tr></thead><tbody>
 <tr><td>乙種免状＋実務</td><td>乙種免状交付後、危険物製造所等で危険物を取り扱う実務経験が2年以上</td><td>乙種免状と事業主等による実務経験証明書</td></tr>
 <tr><td>乙種4種類</td><td>上の4グループを各1つ以上満たす乙種免状が交付されている</td><td>乙種免状</td></tr>
 <tr><td>化学系学科の卒業</td><td>大学等で化学に関する学科・課程を修めて卒業。対象学校種と課程に条件あり</td><td>学科名の分かる卒業証明書等</td></tr>
 <tr><td>化学関連科目15単位</td><td>所定の学校で化学に関する授業科目を15単位以上修得。卒業前や中退後でも該当する場合あり</td><td>単位修得証明書または成績証明書</td></tr>
 <tr><td>化学専攻の修士・博士</td><td>化学に関する事項を専攻して所定の学位を取得</td><td>学位記等</td></tr>
 </tbody></table></div><p>学校種、授業科目、専攻分野には細かな条件があります。特に15単位ルートは科目名だけでは判断せず、<a href={source}>公式の受験資格チェック表</a>を照合してください。</p></section>
 <section className={styles.section}><h2>乙4から進むときの分岐</h2><h3>1. 乙4免状だけで、実務経験がまだない</h3><p>4種類ルートでは残り「第1類または第6類」「第3類」「第5類」が必要です。乙4と乙2は同じグループなので、乙2を追加しても別グループを満たしたことにはなりません。別の学歴・単位経路に該当しないかも確認します。</p>
 <h3>2. 乙4免状交付後、危険物を取り扱う実務が2年以上ある</h3><p>乙種免状＋実務2年の経路に該当する可能性があります。ただ勤務した年数だけで判断せず、対象となる危険物製造所等での取扱経験を事業主等が証明できるか確認します。異なる製造所等での期間も、個別に証明を取れれば合算できると公式FAQに説明があります。</p>
 <h3>3. 大学・専門学校等で化学を学んだ</h3><p>乙種免状を増やさなくても、指定の化学系課程の卒業や関連科目15単位以上の修得に該当する可能性があります。化学に似た科目名でも対象外になり得るため、出願前に公式のチェック表を使います。</p></section>
 <section className={styles.section}><h2>次に見る情報</h2><p>乙4自体の試験範囲は<Link to="/docs/safety-environment/Environment/kagaku/kikenbutsu-toriatsukaisha-otsushu-4rui/">危険物取扱者乙種4類</Link>、資格全体の種類は<Link to="/docs/safety-environment/Environment/kagaku/kikenbutsu-toriatsukaisha/">危険物取扱者</Link>で確認できます。受験資格とは別に、試験科目や日程も確認してください。</p></section>
 </div>
 <aside className={styles.card}><h2>申込み前の確認</h2><ol><li>使う受験資格の経路を1つ選ぶ</li><li>免状交付・実務証明・学校の履修記録を揃える</li><li>公式の支部案内で添付書類と受付方法を確認</li></ol><h3>一次資料</h3><ul className={styles.sources}><li><a href={source}>消防試験研究センター：危険物取扱者の受験資格</a></li><li><a href="https://www.shoubo-shiken.or.jp/faq/index_kiken.html">同センター：危険物試験FAQ</a></li><li><a href="https://www.shoubo-shiken.or.jp/news/2024/07/post-86.html">同センター：受験資格チェック表案内</a></li></ul><p className={styles.small}>制度確認：2026-10-21。申込み時点の最新要項・主催者の審査を優先。</p></aside>
 </div></main></Layout>;
}
