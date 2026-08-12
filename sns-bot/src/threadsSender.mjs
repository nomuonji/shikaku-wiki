// Threads 投稿（資格キューからラウンドロビンで1本選んで投稿）。
// X と同一のキュー・状態を共有するため、X と同じ投稿が Threads にも出る。

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as credStore from './credStore.mjs';
import { getThreadsCredentials } from './threadsAuth.mjs';
import { postText } from './threadsClient.mjs';
import { readJsonl, groupByCategory, loadState, selectNext, saveState } from './queue.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const BOT_ROOT = path.resolve(HERE, '..');
const QUEUE_FILE = path.join(BOT_ROOT, 'tweet.jsonl');
const STATE_FILE = path.join(BOT_ROOT, 'certifications_state.json');

function isDryRun() {
  return process.env.DRY_RUN === '1' || process.argv.includes('--dry-run');
}

function formatPost(t) {
  return `【資格紹介】\n\n${t.exam || ''}\n\n${t.tweet || ''}\n\nカテゴリ：${t.category || ''}\n\n${t.hashtags || ''}`.trim();
}

async function main() {
  try {
    const tweets = readJsonl(QUEUE_FILE);
    if (!tweets.length) { console.log('No tweets to send.'); return; }

    const categories = Object.keys(groupByCategory(tweets));
    const state = loadState(STATE_FILE, categories);
    const { post, newState } = selectNext(tweets, state);
    const text = formatPost(post);

    if (isDryRun()) {
      console.log('[DRY_RUN] Would post to Threads with text:');
      console.log(text);
      return; // 状態を進めない
    }

    const creds = await credStore.loadCredentials();
    const { userId, accessToken } = await getThreadsCredentials(creds, credStore, false);
    const res = await postText(accessToken, userId, text);
    console.log(`Threads post success: ${JSON.stringify(res)}`);
    console.log(text);

    saveState(STATE_FILE, newState);
    console.log('State updated.');
  } catch (err) {
    console.error('Error sending Threads post:', err?.message || err);
    if (err?.data) console.error('Error data:', JSON.stringify(err.data));
    process.exitCode = 1;
  }
}

main();
