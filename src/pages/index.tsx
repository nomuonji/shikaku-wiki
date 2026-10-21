import React from 'react';
import Head from '@docusaurus/Head';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {usePluginData} from '@docusaurus/useGlobalData';
import QualificationAtlas from '@site/src/components/QualificationAtlas';
import {trackEvent} from '@site/src/utils/analytics';
import styles from './workspace.module.css';

type Item = {route:string; title:string; category:string; categoryKey:string; difficulty:string; studyHours:string; indexReady:boolean; availabilityStatus:string};
type Data = {indexReadyCount:number;items:Item[]};
const fields = [
  {key:'technology',label:'IT・技術',hint:'デジタル・情報処理',symbol:'01',to:'/docs/technology/'},
  {key:'legal-accounting',label:'法律・会計',hint:'制度・専門職',symbol:'02',to:'/docs/legal-accounting/'},
  {key:'business',label:'ビジネス',hint:'経営・不動産・金融',symbol:'03',to:'/docs/business/'},
  {key:'medical-welfare',label:'医療・福祉',hint:'医療・介護・ケア',symbol:'04',to:'/docs/medical-welfare/'},
  {key:'lifestyle',label:'ライフスタイル',hint:'語学・食・暮らし',symbol:'05',to:'/docs/lifestyle/'},
  {key:'safety-environment',label:'安全・環境',hint:'防災・設備・安全',symbol:'06',to:'/docs/safety-environment/'},
  {key:'creative',label:'クリエイティブ',hint:'デザイン・映像・表現',symbol:'07',to:'/docs/creative/'},
  {key:'industry',label:'業界別',hint:'製造・物流・専門業界',symbol:'08',to:'/docs/industry/'},
];
const website='https://shikaku.antonbase.com';
const structuredData = {
  '@context':'https://schema.org','@graph':[
    {'@type':'WebSite','@id':website+'/#website',url:website+'/',name:'資格カタログ',inLanguage:'ja-JP',
      description:'資格・検定の公式情報、勉強時間の目安、難易度、試験方式を調べて比較する'},
    {'@type':'CollectionPage','@id':website+'/#webpage',url:website+'/',
      name:'資格・検定を難易度・勉強時間から探す｜資格カタログ',
      isPartOf:{'@id':website+'/#website'},
      mainEntity:{'@type':'ItemList',itemListElement:fields.map((f,i)=>({
        '@type':'ListItem',position:i+1,name:f.label,url:website+f.to
      }))}}
  ]
};
export default function Home():React.JSX.Element {
  const data=usePluginData('qualification-index') as Data;
  const items=React.useMemo(()=>data.items.filter(item=>item.indexReady && item.availabilityStatus==='active'),[data.items]);
  const counts=React.useMemo(()=>{
    const m=new Map<string,number>();
    items.forEach(item=>m.set(item.categoryKey,(m.get(item.categoryKey)||0)+1));
    return m;
  },[items]);
  const [mode,setMode]=React.useState<'discover'|'compare'|'read'>('discover');
  const paths={
    discover:{number:'01',title:'知らない資格に出会う',summary:'ジャンルも名前も決めずに、選択肢の全体像から探す。',cta:'分布を探索する',href:'#atlas'},
    compare:{number:'02',title:'候補を並べて判断する',summary:'難易度・勉強時間・方式の差から、取る資格を絞る。',cta:'比較ツールへ',href:'/explore/'},
    read:{number:'03',title:'制度を確かめてから決める',summary:'公式情報と編集上の目安を区別して、資格の詳細へ。',cta:'資格一覧へ',href:'/qualifications/'}
  };
  const current=paths[mode];
  return <Layout title="資格・検定を難易度・勉強時間から探す" description="難易度・勉強時間・試験方式・活かせる仕事から資格を探索できる資格カタログ。">
    <Head><meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"/>
      <script type="application/ld+json">{JSON.stringify(structuredData)}</script></Head>
    <main className={styles.page}>
      <section className={styles.masthead} aria-labelledby="home-title">
        <div className={styles.topline}><span>SHIKAKU / INDEX</span><span>資格選択のためのナビゲーション</span><span>NO. 001—008 / FIELD GUIDE</span></div>
        <div className={styles.mastGrid}>
          <div className={styles.bigCopy}><span className={styles.pretitle}>YOUR NEXT QUALIFICATION</span>
            <h1 id="home-title">資格を、<br/><em>選べる</em>知識に。</h1>
            <p>名前を知っている資格だけで決めない。分野の広がり、学ぶ時間、試験の違い。資格選びを、一覧から判断できる体験へ。</p>
            <a className={styles.primaryLink} href="#atlas">資格の地図をひらく <span>↘</span></a>
          </div>
          <div className={styles.indexPanel}>
            <div className={styles.panelTop}><span>LIVE CATALOG</span><span>公式情報を確認できたページ</span></div>
            <strong className={styles.total}>{data.indexReadyCount}<small>件</small></strong>
            <div className={styles.panelLine}><span>08 FIELDS</span><span>閲覧・比較は登録不要</span></div>
            <div className={styles.fieldPreview} aria-hidden="true">{fields.map(f=><span key={f.key} style={{flex:Math.max(1,counts.get(f.key)||0)}} />)}</div>
            <small>帯の幅は分野別の公開対象件数に対応します。</small>
          </div>
        </div>
        <div className={styles.scrollLabel}>EXPLORE DOWNWARD <span>↓</span></div>
      </section>
      <section className={styles.choose} aria-label="目的から探す">
        <div className={styles.eyebrow}><span>START WITH A QUESTION</span><strong>資格探しの入口</strong></div>
        <div className={styles.modeGrid}>
          <div className={styles.modes}>{(Object.keys(paths) as Array<keyof typeof paths>).map(key=><button
            key={key} className={mode===key?styles.modeActive:styles.mode}
            type="button" aria-pressed={mode===key} onClick={()=>setMode(key)}>
            <span>{paths[key].number}</span><strong>{paths[key].title}</strong><span>↗</span>
          </button>)}</div>
          <div className={styles.modeDetail} aria-live="polite">
            <span>PATH / {current.number}</span><h2>{current.title}</h2>
            <p>{current.summary}</p>
            <Link to={current.href} onClick={()=>trackEvent('qualification_path_open',{path:mode})}>
              {current.cta} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>
      <section className={styles.fieldSection} aria-labelledby="seo-decision-heading">
        <div className={styles.sectionLine}><span>START FROM YOUR SITUATION</span><span>受験条件・仕事・比較から探す</span></div>
        <div className={styles.fieldHead}><h2 id="seo-decision-heading">資格の名前より、<br/>いまの条件から。</h2><p>すでに持っている免状、担当したい仕事、二つの資格の違い。受験前の具体的な疑問から調べられます。</p></div>
        <div className={styles.fieldRows}>
          <Link to="/juken-shikaku/" className={styles.fieldRow}><span className={styles.fieldNumber}>A</span><strong>受験資格から探す</strong><span>学歴・免状・実務経験を確認</span><span>条件を調べる</span><span className={styles.fieldArrow}>↗</span></Link>
          <Link to="/shikaku-hikaku/" className={styles.fieldRow}><span className={styles.fieldNumber}>B</span><strong>資格の違いを比べる</strong><span>甲種・乙種、電工、クラウド資格</span><span>比較する</span><span className={styles.fieldArrow}>↗</span></Link>
          <Link to="/shikaku-shigoto/" className={styles.fieldRow}><span className={styles.fieldNumber}>C</span><strong>仕事から逆引き</strong><span>担当業務から資格の範囲を見る</span><span>仕事で探す</span><span className={styles.fieldArrow}>↗</span></Link>
        </div>
      </section>
      <section id="atlas" className={styles.atlasWrap}>
        <div className={styles.sectionLine}><span>THE QUALIFICATION LANDSCAPE</span><span>01 — INTERACTIVE INDEX</span></div>
        <QualificationAtlas />
      </section>
      <section className={styles.fieldSection} aria-labelledby="fields-heading">
        <div className={styles.sectionLine}><span>EXPLORE THE DISCIPLINES</span><span>02 — ALL FIELDS</span></div>
        <div className={styles.fieldHead}><h2 id="fields-heading">専門分野を<br/>横断する。</h2><p>気になる領域が見つかったら、分野別の記事へ。ここから先は詳細を読み込む。</p></div>
        <div className={styles.fieldRows}>{fields.map(f=><Link to={f.to} key={f.key} className={styles.fieldRow}
          onClick={()=>trackEvent('qualification_category_open',{category:f.key,source:'home_workspace'})}>
          <span className={styles.fieldNumber}>{f.symbol}</span><strong>{f.label}</strong><span>{f.hint}</span>
          <span className={styles.fieldCount}>{counts.get(f.key)||0} 件</span><span className={styles.fieldArrow}>↗</span>
        </Link>)}</div>
      </section>
      <section className={styles.closing}>
        <div><span className={styles.closingTag}>THE FINAL CHECK</span><h2>数字だけで、<br/>決めない。</h2></div>
        <div><p>勉強時間や難易度は参考値。受験資格・試験方式・費用は公式情報を確認する。資格ごとの根拠と更新状況を明示し、情報が不足するページを検索公開対象から分けています。</p>
          <div className={styles.closingLinks}><Link to="/methodology/">情報の見方・編集方針 ↗</Link><Link to="https://job.antonbase.com/">資格の先にある仕事を探す ↗</Link><Link to="/blog/">比較・勉強法の記事 ↗</Link></div>
        </div>
      </section>
    </main>
  </Layout>;
}
