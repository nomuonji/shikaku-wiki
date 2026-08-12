# SNS bot（資格カタログ / shikaku.antonbase.com）

sns-manager の `unit/certifications` から移設した、X / Threads への自動投稿bot。
shikaku.antonbase.com の資格記事データから生成した投稿キューを、ラウンドロビンで毎日投稿する。

## 特徴

- **ゼロ依存**（Node.js 20+ の標準 fetch / crypto のみ。npm install 不要）
- **認証情報はコミットしない**。X OAuth1 と Threads トークンは **Secret Gist** で管理し、
  GitHub Actions は `GH_GIST_TOKEN` + `GIST_ID` で読み出す
- **Threads トークンは自動リフレッシュ**（有効期限が近づくと自己リフレッシュして Gist に書き戻す）
- 投稿位置（`certifications_state.json`）はコミットして同期（公開リポジトリで問題なし）

## ディレクトリ構成

```
sns-bot/
├── tweet.jsonl                  # 投稿キュー（コミット済み・非秘密）
├── certifications_state.json    # ラウンドロビン位置（コミット済み・非秘密）
├── concept.yml                  # アカウント設計（資格）
├── .env.example                 # 設定サンプル（認証情報は含まない）
└── src/
    ├── credStore.mjs            # 認証情報の Gist 読み書き
    ├── oauth1.mjs               # X API v2 OAuth 1.0a 署名
    ├── x.mjs                    # X 投稿クライアント
    ├── threadsClient.mjs        # Threads Graph API クライアント
    ├── threadsAuth.mjs          # Threads トークン自動リフレッシュ
    ├── threads-refresh.mjs      # Threads トークン強制リフレッシュ
    ├── queue.mjs                # キュー・ラウンドロビン状態管理
    ├── tweetSender.mjs          # X 投稿（1日1本）
    └── threadsSender.mjs        # Threads 投稿（1日1本）
```

## コマンド

```bash
# ドライラン（投稿せず文面のみ表示・状態は進めない）
node sns-bot/src/tweetSender.mjs --dry-run
node sns-bot/src/threadsSender.mjs --dry-run

# 実際に投稿（認証情報は Gist から）
node sns-bot/src/tweetSender.mjs
node sns-bot/src/threadsSender.mjs

# Threads トークンの強制リフレッシュ
node sns-bot/src/threads-refresh.mjs
```

## 認証情報の準備（初回のみ）

1. **Secret Gist を作成**し、`credentials.json` として以下を置く:
   ```json
   {
     "x": {
       "consumer_key": "...",
       "consumer_secret": "...",
       "access_token": "...",
       "access_token_secret": "..."
     },
     "threads": {
       "user_id": "...",
       "token": "...",
       "expires_at": null
     }
   }
   ```
2. リポジトリの **Actions secrets** に以下を設定:
   - `GH_GIST_TOKEN`: gist スコープのみの PAT
   - `GIST_ID`: 上記 Gist の ID
3. ローカル検証は `LOCAL_CRED_FILE=sns-bot/.credentials.local.json` を指定して
   Gist の代わりにローカルファイルを使う（`.gitignore` 済み）。

## GitHub Actions

| workflow | 実行 | 内容 |
|---|---|---|
| `sns-bot.yml` | 1日3回（JST 9/17/1時） | キューからXとThreadsに各1投稿 |
| `threads-refresh.yml` | 毎月1日 | Threadsトークンを強制リフレッシュ |

## 投稿文の形式

```
【資格紹介】

<資格名>

<1行紹介>

カテゴリ：<カテゴリ>

<ハッシュタグ>
```

URL（`official_url`）はSNSアルゴリズム対策として投稿に含めない（テキストのみ）。

## 注意

- キュー・状態ファイルは Actions がコミットして同期する。2つの workflow は同じ
  concurrency group（`sns-bot`）なので競合しない。
- 公開リポジトリでも認証情報が漏れない設計になっている（トークンは常に Gist 経由）。
