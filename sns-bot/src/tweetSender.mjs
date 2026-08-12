// X 投稿（資格キューからラウンドロビンで1本選んでツイート）。
// キュー・状態はリポジトリにコミット済み。認証情報は Gist（credStore）から読む。

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as credStore from './credStore.mjs';
import { postToX } from './x.mjs';
import { readJsonl, groupByCategory, loadState, selectNext, saveState } from './queue.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BOT_ROOT = path.resolve(HERE, '..');
const QUEUE_FILE = path.join(BOT_ROOT, 'tweet.jsonl');
const STATE_FILE = path.join(BOT_ROOT, 'certifications_state.json');

function isDryRun() {
  return process.env.DRY_RUN === '1' || process.argv.includes('--dry-run');
}

function formatPost(t) {
  return `【資格紹介】\n\n${t.exam || ''}\n\n${t.tweet || ''}\n\nカテゴリ：${t.category || ''}\n\n${t.hashtags || ''}`;
}

async function main() {
  try {
    const tweets = readJsonl(QUEUE_FILE);
    if (!tweets.length) { console.log('No tweets to send.'); return; }

    const categories = Object.keys(groupByCategory(tweets));
    const state = loadState(STATE_FILE, categories);
    const { post, newState } = selectNext(tweets, state);
    const text = formatPost(post);

    const creds = await credStore.loadCredentials();
    if (isDryRun()) {
      console.log('[DRY_RUN] Would tweet with text:');
      console.log(text);
      return; // 状態を進めない
    }

    const id = await postToX(text, creds);
    console.log(`Tweet sent successfully: ${id}`);
    console.log(text);

    saveState(STATE_FILE, newState);
    console.log('State updated.');
  } catch (err) {
    console.error('Error sending tweet:', err?.message || err);
    process.exitCode = 1;
  }
}

main();
