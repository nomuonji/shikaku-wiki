import React, { useState, useEffect } from 'react';
import Link from '@docusaurus/Link';
import styles from './RandomQualificationCarousel.module.css';

type Qualification = {
    name: string;
    url: string;
    category: string;
    emoji: string;
    funFact: string;
};

const SURPRISING_QUALIFICATIONS: Qualification[] = [
    {
        name: 'ねこ検定',
        url: '/docs/lifestyle/General/sensuishi',
        category: 'ライフスタイル',
        emoji: '🐱',
        funFact: '猫好きなら知っておきたい、猫の生態や歴史の知識！',
    },
    {
        name: 'チョコレート検定',
        url: '/docs/lifestyle/Food/chocolate-kentei-chuukyuu',
        category: 'ライフスタイル',
        emoji: '🍫',
        funFact: 'カカオの歴史から製造法まで、甘い知識が満載！',
    },
    {
        name: 'BBQインストラクター',
        url: '/docs/lifestyle/Food/bbq-instructor-shokyuu',
        category: 'ライフスタイル',
        emoji: '🍖',
        funFact: 'アウトドアの達人になれる、意外と奥深い資格！',
    },
    {
        name: 'きもの文化検定',
        url: '/docs/lifestyle/General/kimo-no-bunka-kentei-3kyuu',
        category: 'ライフスタイル',
        emoji: '👘',
        funFact: '日本の伝統美を学び、着物の魅力を再発見！',
    },
    {
        name: 'インテリアコーディネーター',
        url: '/docs/lifestyle/General/interior-coordinator',
        category: 'ライフスタイル',
        emoji: '🛋️',
        funFact: '理想の空間をデザインする、クリエイティブな資格！',
    },
    {
        name: '世界遺産検定',
        url: '/docs/lifestyle/Health/kankou/sekai-isan-kentei-2kyuu',
        category: 'ライフスタイル',
        emoji: '🏛️',
        funFact: '世界中の歴史と文化を旅する、ロマンあふれる検定！',
    },
];

export default function RandomQualificationCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % SURPRISING_QUALIFICATIONS.length);
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const current = SURPRISING_QUALIFICATIONS[currentIndex];

    return (
        <section className={styles.carouselSection}>
            <div className="container">
                <h2 className={styles.sectionTitle}>
                    ✨ こんな資格もあるんです！
                </h2>
                <div className={styles.carouselContainer}>
                    <div className={styles.carouselCard}>
                        <div className={styles.emoji}>{current.emoji}</div>
                        <h3 className={styles.qualificationName}>{current.name}</h3>
                        <p className={styles.funFact}>{current.funFact}</p>
                        <Link to={current.url} className="button button--primary">
                            詳しく見る
                        </Link>
                    </div>
                    <div className={styles.indicators}>
                        {SURPRISING_QUALIFICATIONS.map((_, index) => (
                            <span
                                key={index}
                                className={`${styles.indicator} ${index === currentIndex ? styles.active : ''}`}
                                onClick={() => setCurrentIndex(index)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
