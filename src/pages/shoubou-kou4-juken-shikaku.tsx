
import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import styles from './eligibility-guides.module.css';

const routes=[
 {value:'electric',label:'第一種・第二種電気工事士の免状が交付されている',result:'電気工事士免状は、甲種4類（特類以外）の受験資格となる経路の一つです。',next:'免状の写しを用意し、科目免除の申請をするか別途確認します。電気工事士試験に合格しただけで免状未交付の場合は、この選択肢では確定できません。'},
 {value:'other-kou',label:'受ける類とは別の甲種消防設備士免状を持っている',result:'別類の甲種消防設備士免状は、甲種4類の受験資格となる経路です。',next:'受験する類と保有する免状の類を照合し、共通法令等の免除範囲を公式表で確認します。'},
 {value:'otsu',label:'乙種消防設備士免状の交付後、対象設備の整備を2年以上経験',result:'乙種免状交付後の所定の整備経験2年以上は、甲種4類に進む受験資格の一経路です。',next:'「免状交付後」であること、政令で定められた整備経験であること、証明書の内容を支部で確認します。乙種合格後すぐでは足りません。'},
 {value:'degree',label:'関連分野の学歴・単位・別の国家資格がある',result:'学歴・単位や他の国家資格等による受験経路に該当する場合があります。',next:'学校種・指定学科・必要単位・資格種類で条件が異なるため、公式の受験資格一覧と証明書類の表を照合してください。ここでは自動的に受験可能と判定できません。'},
 {value:'none',label:'上記に当てはまるものが分からない',result:'この簡易確認だけでは甲種4類の受験資格を確認できません。',next:'甲種の公式一覧には工事補助など他の経路もあります。受験資格の詳細を支部へ確認するか、受験資格のない乙種4類を検討してください。'}
];
export default function ShoubouRoute():React.JSX.Element{
 const [chosen,setChosen]=React.useState('none');
 const found=routes.find(r=>r.value===chosen)||routes[4];
 return <Layout title="消防設備士甲種4類の受験資格と科目免除｜電気工事士・乙種から進める？" description="電気工事士免状や別類の甲種免状、乙種取得後の整備経験で消防設備士甲種4類を受験できるか。受験資格と試験科目免除の違い、甲4・乙4の試験範囲を公式資料から確認。">
 <Head><link rel="canonical" href="https://shikaku.antonbase.com/shoubou-kou4-juken-shikaku/"/></Head>
 <main className={styles.shell}><div className={styles.crumbs}><Link to="/juken-shikaku/">受験資格を調べる</Link> / 消防設備士甲種4類</div>
 <header className={styles.hero}><span className={styles.kicker}>Fire equipment / 受験資格</span><h1>電気工事士があれば、<br/>消防設備士の甲4を受けられる？</h1><p className={styles.lead}>電気工事士の免状は甲種4類の受験資格の一つです。ただし「受験できること」と「試験の一部が免除されること」は別の判定です。乙種4類との違いも含め、保有資格ごとに確認します。</p></header>
 <div className={styles.layout}><div>
 <section className={styles.section} id="check"><h2>手元の免状・経歴から経路を確認</h2><div className={styles.card}><label htmlFor="route"><strong>最も近い状況を選択</strong></label><select id="route" className={styles.control} value={chosen} onChange={e=>setChosen(e.target.value)}>{routes.map(r=><option value={r.value} key={r.value}>{r.label}</option>)}</select><div role="status" aria-live="polite" className={styles.result}><strong>{found.result}</strong>{found.next}</div><p className={styles.small}>この表示は受験資格の主要経路を整理するものです。個別の証明書類の有効性や科目免除の有無は自動判定しません。</p></div></section>
 <section className={styles.section}><h2>電気工事士の保有者が確認する2点</h2><h3>受験資格：免状の交付が基準</h3><p>消防試験研究センターは、電気工事士免状の交付を受けている者を甲種（特類以外）の受験資格に挙げています。試験に合格しただけで免状を受け取っていない場合、出願書類をそのまま満たすとは断定できません。<a href="https://www.shoubo-shiken.or.jp/shoubou/annai/qualified01.html">公式の甲種受験資格</a>に沿って確認します。</p>
 <h3>科目免除：希望すれば自動で全科目免除ではない</h3><p>電気工事士免状等の保有者は、受験する類に応じて試験の一部免除を申請できる場合があります。対象科目と免除後の問題数・時間は<a href="https://www.shoubo-shiken.or.jp/shoubou/annai/subject.html">公式の科目・問題数ページ</a>に掲載された「一部免除・試験時間・試験問題数一覧表」で確認します。受験資格があるというだけで製図や実技全体まで免除されると考えないでください。</p></section>
 <section className={styles.section}><h2>甲種4類と乙種4類、選択の基準</h2><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>判断材料</th><th>甲種4類</th><th>乙種4類</th></tr></thead><tbody>
 <tr><td>業務範囲</td><td>第4類設備の工事・整備・点検</td><td>第4類設備の整備・点検。工事は含まない</td></tr>
 <tr><td>受験資格</td><td>免状・学歴・経験等の条件が必要</td><td>なし（誰でも受験可）</td></tr>
 <tr><td>実技試験</td><td>鑑別等5問＋製図2問</td><td>鑑別等5問（製図なし）</td></tr>
 <tr><td>免除なしの試験時間</td><td>3時間15分</td><td>1時間45分</td></tr>
 </tbody></table></div><p>対象設備が「警報設備」かどうかも重要です。消火器の整備・点検は乙種6類の範囲であり、乙4・甲4で代替できません。詳細は<Link to="/docs/safety-environment/Safety/bousai/shoubou-setsubishi-koushu-4rui/">甲種4類の個別資格ガイド</Link>で確認してください。</p></section>
 <section className={styles.section}><h2>乙種4類から甲種4類へ進める？</h2><p>乙種4類に合格しただけで、すぐ甲種4類を受けられるわけではありません。乙種免状の交付後、政令で定められた工事整備対象設備等の整備経験が2年以上必要となる経路があります。一方、電気工事士の免状や関連学歴など別の条件を満たす場合は、乙種4類を経由しなくても甲種4類の受験資格を満たす可能性があります。</p></section>
 <section className={styles.section}><h2>次の行動</h2><ol><li>受験資格となる免状・学歴・実務経験の証明を決める。</li><li>必要なら科目免除一覧表で、申請する免除と試験時間を確認する。</li><li>出願先の都道府県支部の案内で受理される書類・申込方法を確認する。</li></ol><p><Link to="/docs/etc/General/daini-shu-denki-koujishi/">第二種電気工事士の資格記事</Link>と<Link to="/docs/safety-environment/Safety/bousai/shoubou-setsubishi-koushu-4rui/">消防設備士甲種4類の資格記事</Link>も参照できます。</p></section>
 </div>
 <aside className={styles.card}><h2>一次資料</h2><ul className={styles.sources}>
 <li><a href="https://www.shoubo-shiken.or.jp/shoubou/annai/qualified01.html">消防試験研究センター：甲種受験資格</a></li>
 <li><a href="https://www.shoubo-shiken.or.jp/shoubou/qualified01.html">消防設備士：受験資格の概要</a></li>
 <li><a href="https://www.shoubo-shiken.or.jp/shoubou/annai/subject.html">試験科目・一部免除の一覧表</a></li>
 <li><a href="https://www.shoubo-shiken.or.jp/shoubou/annai/way.html">試験の方法・時間</a></li>
 <li><a href="https://www.shoubo-shiken.or.jp/faq/index_shoubou.html">よくある質問（科目免除）</a></li></ul><p className={styles.small}>制度確認：2026-10-21。免除・受験資格の最終確認は受験支部へ。</p></aside></div></main></Layout>;
}
