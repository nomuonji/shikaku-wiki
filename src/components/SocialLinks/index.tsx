import React from 'react';
import styles from './styles.module.css';

export default function SocialLinks() {
    return (
        <div className={styles.socialLinksContainer}>
            <a
                href="https://x.com/shikaku_catalog"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialLink} ${styles.xTwitter}`}
            >
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                X (Twitter) でフォロー
            </a>
            <a
                href="https://www.threads.com/@certifications_catalog"
                target="_blank"
                rel="noopener noreferrer"
                className={`${styles.socialLink} ${styles.threads}`}
            >
                <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.004 21.998c-5.523 0-10-4.477-10-10s4.477-10 10-10 10 4.477 10 10-4.477 10-10 10zm0-18.5c-4.687 0-8.5 3.813-8.5 8.5s3.813 8.5 8.5 8.5 8.5-3.813 8.5-8.5-3.813-8.5-8.5-8.5zm0 13.5c-1.375 0-2.625-.563-3.531-1.469l1.063-1.063c.656.656 1.563 1.031 2.469 1.031 1.938 0 3.5-1.563 3.5-3.5s-1.563-3.5-3.5-3.5c-1.938 0-3.5 1.563-3.5 3.5 0 .469.094.906.25 1.313l-1.375.563c-.25-.594-.375-1.219-.375-1.875 0-2.75 2.25-5 5-5s5 2.25 5 5-2.25 5-5 5z" />
                </svg>
                Threads でフォロー
            </a>
        </div>
    );
}
