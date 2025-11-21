import React from 'react';
import Link from '@docusaurus/Link';
import styles from './CategoryShowcase.module.css';

type Category = {
    title: string;
    emoji: string;
    description: string;
    url: string;
    color: string;
};

const CATEGORIES: Category[] = [
    {
        title: 'ビジネス',
        emoji: '💼',
        description: 'キャリアアップに直結する実務系資格',
        url: '/docs/business',
        color: '#1e3a8a',
    },
    {
        title: 'IT・技術',
        emoji: '💻',
        description: 'デジタル時代の必須スキルを証明',
        url: '/docs/technology',
        color: '#059669',
    },
    {
        title: 'ライフスタイル',
        emoji: '🌸',
        description: '趣味や生活を豊かにする楽しい資格',
        url: '/docs/lifestyle',
        color: '#d97706',
    },
    {
        title: 'クリエイティブ',
        emoji: '🎨',
        description: '表現力と感性を磨く芸術系資格',
        url: '/docs/creative',
        color: '#7c3aed',
    },
    {
        title: '医療・福祉',
        emoji: '⚕️',
        description: '人々の健康と幸せを支える専門資格',
        url: '/docs/medical-welfare',
        color: '#dc2626',
    },
    {
        title: '安全・環境',
        emoji: '🌍',
        description: '社会の安全と地球の未来を守る',
        url: '/docs/safety-environment',
        color: '#0891b2',
    },
];

export default function CategoryShowcase() {
    return (
        <section className={styles.showcaseSection}>
            <div className="container">
                <h2 className={styles.sectionTitle}>
                    📚 カテゴリーから探す
                </h2>
                <div className={styles.categoryGrid}>
                    {CATEGORIES.map((category, index) => (
                        <Link
                            key={index}
                            to={category.url}
                            className={styles.categoryCard}
                            style={{ '--category-color': category.color } as React.CSSProperties}
                        >
                            <div className={styles.categoryEmoji}>{category.emoji}</div>
                            <h3 className={styles.categoryTitle}>{category.title}</h3>
                            <p className={styles.categoryDescription}>{category.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
