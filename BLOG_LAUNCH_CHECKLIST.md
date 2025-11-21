# 🚀 Astroブログ立ち上げ完全チェックリスト

このチェックリストは、Astroを使用して高機能かつプロフェッショナルなブログメディアを立ち上げるための標準ワークフローです。

## Phase 1: コンセプト・基盤構築
ブログの方向性を定め、技術的な土台を作ります。

- [ ] **コンセプト定義**
    - [ ] ターゲット層の決定
    - [ ] サイト名の決定
    - [ ] サイトのディスクリプション作成(SEO用)
- [ ] **プロジェクト初期化**
    - [ ] Astroプロジェクトの作成 (`npm create astro@latest`)
    - [ ] Gitリポジトリの初期化 (`git init`)
    - [ ] 必要なパッケージのインストール
        - `npm install @astrojs/sitemap @astrojs/mdx @astrojs/rss`
- [ ] **基本設定 (`src/consts.ts`)**
    - [ ] `SITE_TITLE` の設定
    - [ ] `SITE_DESCRIPTION` の設定

## Phase 2: デザイン・ブランディング
読者を惹きつける世界観を作ります。

- [ ] **カラーパレットの定義 (`src/styles/global.css`)**
    - [ ] メインカラー(`:root` 変数)
    - [ ] アクセントカラー
    - [ ] テキストカラー
    - [ ] 背景色
- [ ] **タイポグラフィの設定**
    - [ ] Google Fontsの選定(見出し・本文)
    - [ ] `src/components/BaseHead.astro` でのフォント読み込み
- [ ] **UIコンポーネントのスタイリング**
    - [ ] ボタン、カード、フォームのデザイン統一
    - [ ] ヘッダー・フッターのローカライズ(日本語化)とデザイン調整

## Phase 3: コンテンツ制作
質の高い記事と画像を用意します。

- [ ] **コンテンツスキーマの定義 (`src/content.config.ts`)**
    - [ ] 必須項目:タイトル、説明、公開日、画像
    - [ ] **追加項目:タグ (`tags`)** の定義追加
    - [ ] **追加項目:カテゴリ (`category`)** の定義追加
- [ ] **画像アセットの準備**
    - [ ] ヒーロー画像の生成・選定
    - [ ] プロフィール画像の準備
- [x] **キーワードリサーチ環境の構築**
    - [x] リサーチツール (`tools/keyword_research.mjs`) の作成
        - **API情報**:
            - Base URL: `https://api-three-gilt-37.vercel.app`
            - Endpoint: `POST /api/get-keyword-volumes`
            - Body: `{ "keywords": ["..."], "options": { "languageConstant": "1005", "geoTargetConstants": ["2392"], "includeAdultKeywords": true } }`
        - Google Ads APIプロキシを使用し、検索ボリュームと競合性を取得するNode.jsスクリプト
    - [x] AIエージェント用指示書 (`GEMINI.md`) の作成
        - **記述内容**:
            - 記事作成時の必須フロー(トピック特定 → リサーチ → 選定 → 執筆)
            - リサーチツール (`node tools/keyword_research.mjs`) の具体的な使用コマンド
            - 選定したキーワードの反映箇所(タイトル、ディスクリプション、見出し、本文)の指示
- [x] **アフィリエイト管理環境の構築**
    - [x] 商材リスト (`affiliate/products.json`) の作成
        - **データ形式**:
            ```json
            [
              {
                "id": "product-id",
                "name": "商品名",
                "description": "商品の特徴やターゲット",
                "affiliate_link": "https://...",
                "campaign_info": "キャンペーン情報(任意)"
              }
            ]
            ```
    - [x] AIエージェント用指示書 (`GEMINI.md`) へのアフィリエイト活用指示の追加
        - **記述内容**:
            - 商材リストの参照フロー
            - 「自然な紹介」の具体的な定義(課題解決としての提案)
            - キャンペーン情報の文章への組み込み指示
- [ ] **記事の執筆 (`src/content/blog/*.md`)**
    - [ ] マークダウンでの記事作成
    - [ ] フロントマター(メタデータ)の入力
    - [ ] 見出し構成(H2, H3)の最適化

## Phase 4: 機能実装(メディア化)
単なる日記ブログから「メディア」へ進化させます。

- [ ] **ホームページの刷新 (`src/pages/index.astro`)**
    - [ ] ヒーローセクション(キャッチコピー配置)
    - [ ] 注目の記事セクション(ピックアップ表示)
    - [ ] 最新記事グリッド表示
- [ ] **記事ページの機能強化 (`src/layouts/BlogPost.astro`)**
    - [ ] **目次 (TOC)** の自動生成ロジック実装
        - [ ] デスクトップ:サイドバー内に表示
        - [ ] モバイル:`<details>`タグで折りたたみ式TOCを記事上部に配置
    - [ ] **カテゴリ** の表示実装(記事タイトル上部にバッジ表示)
    - [ ] **タグ** の表示実装
    - [ ] **SNSシェアボタン** (X, LINE, Facebook) の設置
    - [ ] **著者プロフィール** の表示 (`src/components/AuthorProfile.astro`)
    - [ ] **関連記事レコメンド**(同じタグの記事を表示)
- [ ] **サイドバーウィジェット (`src/components/Sidebar.astro`)**
    - [ ] **検索ウィジェット** (検索フォーム)
    - [ ] **プロフィールウィジェット** (サイト紹介、アバター画像)
    - [ ] **目次ウィジェット** (記事ページのみ、PC表示)
    - [ ] **最近の投稿ウィジェット** (サムネイル付き最新5件)
    - [ ] **カテゴリウィジェット** (カテゴリ一覧と記事数)
    - [ ] **タグウィジェット** (記事のタグ一覧)
- [ ] **カテゴリ・タグアーカイブページ**
    - [ ] カテゴリ別記事一覧 (`src/pages/blog/category/[category].astro`)
    - [ ] タグ別記事一覧 (`src/pages/blog/tag/[tag].astro`)
- [ ] **サイト内検索機能**
    - [ ] 検索インデックスAPIの作成 (`src/pages/search.json.js`)
    - [ ] 検索ページの実装 (`src/pages/search.astro`)
    - [ ] ヘッダーへのリンク追加 (`src/components/Header.astro`)

## Phase 5: SEO・UX対策
検索エンジンとユーザーの両方に好かれるサイトにします。

- [ ] **SEO内部対策**
    - [ ] **サイトマップ** の自動生成設定 (`astro.config.mjs`)
    - [ ] **robots.txt** の設置 (`public/robots.txt`)
    - [ ] **構造化データ (JSON-LD)** の実装 (`src/components/BaseHead.astro`)
    - [ ] メタタグ (OGP, Twitter Card) の最適化
    - [ ] Canonical URL の設定
- [ ] **ユーザー体験 (UX) 向上**
    - [ ] **View Transitions** の導入 (`src/components/BaseHead.astro` に `<ClientRouter />`)
    - [ ] **カスタム404ページ** の作成 (`src/pages/404.astro`)
    - [ ] **レスポンシブ対応**(スマホ・PCでの表示確認)
        - [ ] モバイル:サイドバーを記事下に移動(1カラムレイアウト)
        - [ ] モバイル:折りたたみ式TOCを記事上部に表示
        - [ ] タッチデバイス向けのボタンサイズ調整

---

## 📂 主要ファイルマップ

| ファイルパス | 役割 |
| :--- | :--- |
| `src/consts.ts` | サイト名などの定数定義 |
| `src/styles/global.css` | 全体のデザイン、色、フォント |
| `src/components/BaseHead.astro` | SEO、メタタグ、フォント読み込み、View Transitions |
| `src/components/Header.astro` | ヘッダーナビゲーション |
| `src/components/Footer.astro` | フッター |
| `src/components/Sidebar.astro` | サイドバー(検索、プロフィール、TOC、最近の投稿、カテゴリ、タグ) |
| `src/components/AuthorProfile.astro` | 著者プロフィールコンポーネント |
| `src/layouts/BlogPost.astro` | 記事ページのレイアウト(目次、シェア、関連記事、著者プロフィール) |
| `src/pages/index.astro` | トップページのデザイン |
| `src/pages/blog/index.astro` | ブログ記事一覧ページ |
| `src/pages/blog/[...slug].astro` | 個別記事ページ |
| `src/pages/blog/category/[category].astro` | カテゴリ別記事一覧 |
| `src/pages/blog/tag/[tag].astro` | タグ別記事一覧 |
| `src/content.config.ts` | 記事データの型定義(タグ、カテゴリ追加など) |
| `src/pages/search.astro` | 検索ページ |
| `src/pages/search.json.js` | 検索用データ生成API |
| `public/robots.txt` | クローラー制御設定 |
