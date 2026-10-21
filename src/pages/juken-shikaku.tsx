
import React from 'react';
import Link from '@docusaurus/Link';
import Head from '@docusaurus/Head';
import Layout from '@theme/Layout';
import styles from './eligibility-guides.module.css';

export default function EligibilityHome():React.JSX.Element{
return <Layout title="受験資格を調べる｜免状・学歴・実務経験から逆引き" description="資格名を選ぶ前に、手持ちの免状、学歴、実務経験から受験できる経路と必要書類を整理。消防設備士甲種4類と甲種危険物取扱者の公式制度を確認する。">
<Head><link rel="canonical" href="https://shikaku.antonbase.com/juken-shikaku/"/></Head>
<main className={styles.shell}>
<header className={styles.hero}><span className={styles.kicker}>Eligibility / 資格選択の入口</span><h1>何を持っていれば、<br/>次の資格を受けられる？</h1><p className={styles.lead}>合格した、免状が交付された、実務経験がある。この3つは制度上、同じ意味ではありません。資格名だけでなく、今ある証明書や経歴から受験経路を確認するための入口です。</p></header>
<section className={styles.cards} aria-label="受験条件を調べる">
<article className={styles.card}><span className={styles.pill}>消防設備士</span><h2>甲種4類を受けられる？</h2><p>電気工事士の免状、別類の甲種免状、乙種取得後の実務経験、指定学歴。甲4に進める条件と科目免除を切り分けて確認します。</p><Link className={styles.anchor} to="/shoubou-kou4-juken-shikaku/">甲4の条件を確認 →</Link></article>
<article className={styles.card}><span className={styles.pill}>危険物取扱者</span><h2>乙4から甲種へ進める？</h2><p>乙種の4グループ取得、免状取得後2年間の実務経験、化学系の履修歴。保有している乙種の類を選んで、4種類ルートの不足分を確認できます。</p><Link className={styles.anchor} to="/kikenbutsu-kou-juken-shikaku/">甲種の経路を確認 →</Link></article>
</section>
<section className={styles.section}><h2>先に区別する3つのこと</h2><div className={styles.tableWrap}><table className={styles.table}><thead><tr><th>確かめること</th><th>なぜ必要か</th></tr></thead><tbody>
<tr><td>受験資格</td><td>申請できるか。保有免状・単位・実務年数などの要件を満たすか</td></tr>
<tr><td>科目免除</td><td>受験資格を満たしていても、免除は別条件・別申請の場合がある</td></tr>
<tr><td>証明書類</td><td>合格通知だけでは足りず、免状の交付や事業主の証明が必要な場合がある</td></tr>
</tbody></table></div><p>各ページの判定補助は、公式の複雑な受験資格をすべて自動審査するものではありません。最終的な出願条件は試験実施機関・各支部の案内で確認してください。</p></section>
<section className={styles.section}><h2>資格DBとあわせて使う</h2><p><Link to="/qualifications/">資格一覧</Link>には資格ごとの制度・試験情報があります。候補を増やしたい場合は<Link to="/explore/">資格検索・比較</Link>、関連する仕事を調べたい場合は<a href="https://job.antonbase.com/">しごと図鑑</a>から探せます。</p><p className={styles.small}>このコーナーは2026年10月21日に消防試験研究センターの一次情報を照合して制作しています。更新される出願条件は公式案内を優先してください。</p></section>
</main></Layout>;
}
