# 資格カタログ

一次情報を基準に、資格・検定を「名前」ではなく、受験条件・試験方式・学習負荷・活かし方から比較する資格選択カタログ。

Production: https://shikaku.antonbase.com/

## サイトの役割

資格記事のMarkdownがデータの正本です。別DBへ同じ資格情報を二重入力せず、ビルド時に検索・比較データを生成します。

このサイトでは **DBに存在すること** と **Googleへ個別ページを公開してよいこと** を分けます。

### Catalogued

資格ページが存在し、サイト内検索・比較の候補として利用できます。

### Index-ready

個別資格ページを検索エンジンへ公開する条件は3つです。

1. 現行資格として扱えること（`availabilityStatus === active`）
2. 制度確認日が270日以内であること
3. 公式情報URLが保存されていること

3条件を満たさない資格ページはURLを維持したまま `noindex,follow` にします。

- 開催状況要確認
- 終了済み
- 公式URL未確認
- 制度確認日が古い / 不明

これらは削除対象ではありません。調査・比較用のDB資産として残し、公式情報を再確認できたらindex-readyへ戻します。

## SEO公開境界

Index対象:
- トップ
- 分野カテゴリ
- index-readyな個別資格
- 一次情報ベースの比較・意思決定記事
- methodology等の固定説明ページ

Noindex:
- `/explore/`（ユーザー用検索UI）
- check / ended / unsourced / stale な個別資格
- draft / unlisted
- その他robotsでnoindex指定されたページ

postbuildでHTMLのrobotsを読み、noindexページを `sitemap.xml` から自動除外します。
`verify_built_site.mjs` は noindex URL がsitemapへ戻った場合にbuildを失敗させます。

## 情報源

優先順位:

1. 資格実施団体・主管官庁・法令
2. 公的機関・業界団体
3. 信頼できる二次情報
4. 一般的な目安・経験則

受験料、試験日、受験資格、登録・更新、法的業務範囲などは一次情報を優先します。

勉強時間・難易度・就職効果などは、公式値でない限り確定値として扱いません。

## 成長方針

資格件数の量産をKPIにしません。

優先順位:
1. GSCですでに需要が観測されている資格
2. 受験判断への影響が大きい資格
3. 公式情報が取得可能で、制度更新を追える資格
4. 比較・選択のハブとして価値があるクラスタ

資格ページの追加より、既存ページをsource-readyへ昇格させることを優先します。

## 開発

```bash
npm install
npm run audit:site
npm run audit:quality
npm run build
```

`npm run build` は以下まで実行します。

- サイト構造監査
- 資格品質監査
- Docusaurus build
- noindex sitemap pruning
- build成果物検証

## 主要実装

- `plugins/qualification-index/index.mjs`: 資格DB・現行性・indexReady判定
- `src/components/QualificationExplorer.tsx`: noindexの資格検索・比較UI
- `src/components/QualificationQuickFacts.tsx`: 個別資格の状態・robots
- `scripts/prune_noindex_sitemap.mjs`: noindexページのsitemap除外
- `scripts/verify_built_site.mjs`: canonical / robots / sitemap / internal link監査
- `src/pages/methodology.tsx`: 編集方針
