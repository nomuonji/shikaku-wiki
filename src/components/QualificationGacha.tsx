import React, { useState } from 'react';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './QualificationGacha.module.css';

type Qualification = {
    name: string;
    url: string;
    description: string;
    category: string;
    emoji: string;
};

const QUALIFICATIONS: Qualification[] = [
    {
        name: 'BBQインストラクター',
        url: '/docs/lifestyle/Food/bbq-instructor-shokyuu',
        description: 'バーベキューの文化や技術を学び、スマートなBBQを実践！',
        category: 'ライフスタイル',
        emoji: '🍖',
    },
    {
        name: 'チョコレート検定',
        url: '/docs/lifestyle/Food/chocolate-kentei-chuukyuu',
        description: 'カカオの歴史から製造法まで、チョコ好きにはたまらない知識。',
        category: 'ライフスタイル',
        emoji: '🍫',
    },
    {
        name: 'G検定 (ジェネラリスト検定)',
        url: '/docs/technology/jdla-g-kentei-generalist',
        description: 'AI・ディープラーニングの基礎知識を証明する、今注目の資格。',
        category: 'IT・技術',
        emoji: '🤖',
    },
    {
        name: 'SEO検定',
        url: '/docs/business/Marketing/seo-kentei-2kyuu',
        description: 'Webサイトの検索順位を上げるための技術と知識を体系的に学ぶ。',
        category: 'ビジネス',
        emoji: '🔍',
    },
    {
        name: 'ITパスポート',
        url: '/docs/technology/General/kiso/it-passport',
        description: 'IT社会で働くすべての社会人が備えておくべき基礎知識。',
        category: 'IT・技術',
        emoji: '💻',
    },
    {
        name: '世界遺産検定',
        url: '/docs/lifestyle/Health/kankou/sekai-isan-kentei-2kyuu',
        description: '人類共通の宝物である世界遺産を通して、国際的な教養を身につける。',
        category: 'ライフスタイル',
        emoji: '🏛️',
    },
    {
        name: 'ファイナンシャル・プランニング技能士',
        url: '/docs/business/Finance/fudousan/fp-ginoushi-3kyuu-2kyuu-1kyuu',
        description: 'くらしとお金の専門家。家計管理から資産運用まで幅広く役立つ。',
        category: 'ビジネス',
        emoji: '💰',
    },
    {
        name: '色彩検定',
        url: '/docs/creative/shikisai-kentei',
        description: '色に関する幅広い知識や技能を問う検定試験。',
        category: 'クリエイティブ',
        emoji: '🎨',
    },
    {
        name: 'インテリアコーディネーター',
        url: '/docs/lifestyle/General/interior-coordinator',
        description: '快適な住空間を作るための専門知識を身につける。',
        category: 'ライフスタイル',
        emoji: '🛋️',
    },
    {
        name: 'きもの文化検定',
        url: '/docs/lifestyle/General/kimo-no-bunka-kentei-3kyuu',
        description: '着物の歴史や文化を学び、日本文化への理解を深める。',
        category: 'ライフスタイル',
        emoji: '👘',
    },
];

export default function QualificationGacha() {
    const [result, setResult] = useState<Qualification | null>(null);
    const [isSpinning, setIsSpinning] = useState(false);

    const spinGacha = () => {
        if (isSpinning) return;
        setIsSpinning(true);
        setResult(null);

        // Simple animation effect
        let count = 0;
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * QUALIFICATIONS.length);
            // Just visually update something if we wanted, but for now we wait
            count++;
            if (count > 10) {
                clearInterval(interval);
                const finalIndex = Math.floor(Math.random() * QUALIFICATIONS.length);
                setResult(QUALIFICATIONS[finalIndex]);
                setIsSpinning(false);
            }
        }, 100);
    };

    return (
        <section className={styles.gachaSection}>
            <div className="container">
                <div className={styles.gachaContainer}>
                    <h2 className={styles.gachaTitle}>
                        <span className={styles.gachaIcon}>🎁</span> 運命の資格ガチャ
                    </h2>
                    <p className={styles.gachaSubtitle}>
                        何から勉強すればいいかわからない？<br />
                        そんなあなたに、AI(ランダム)がおすすめの資格を提案します！
                    </p>

                    <div className={styles.gachaMachine}>
                        <button
                            className={clsx('button button--primary button--lg', styles.spinButton, { [styles.spinning]: isSpinning })}
                            onClick={spinGacha}
                            disabled={isSpinning}
                        >
                            {isSpinning ? '選定中...' : 'ガチャを回す！'}
                        </button>
                    </div>

                    {result && (
                        <div className={clsx(styles.resultCard, 'card')}>
                            <div className="card__header">
                                <div className={styles.resultCategory}>{result.category}</div>
                                <h3 className={styles.resultTitle}>
                                    <span className={styles.resultEmoji}>{result.emoji}</span> {result.name}
                                </h3>
                            </div>
                            <div className="card__body">
                                <p>{result.description}</p>
                            </div>
                            <div className="card__footer">
                                <Link
                                    to={result.url}
                                    className="button button--secondary button--block">
                                    この資格を見る
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
