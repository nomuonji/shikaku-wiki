import fs from 'fs';
import path from 'path';

const docsDir = path.join(process.cwd(), 'docs');

const categories = {
    'business': {
        label: 'ビジネス・実務',
        description: '経営、事務、秘書検定など、ビジネスシーンで即戦力となる資格群です。',
        position: 1
    },
    'legal-accounting': {
        label: '法律・会計',
        description: '弁護士、税理士、簿記など、法律やお金に関する専門資格です。',
        position: 2
    },
    'technology': {
        label: 'IT・情報技術',
        description: '基本情報技術者、AWS、プログラミングなど、IT業界で必須の資格です。',
        position: 3
    },
    'industry': {
        label: '工業・技術',
        description: '電気工事士、危険物取扱者など、現場や技術職で求められる資格です。',
        position: 4
    },
    'medical-welfare': {
        label: '医療・福祉',
        description: '看護師、薬剤師、介護福祉士など、医療や介護の現場で活躍する資格です。',
        position: 5
    },
    'safety-environment': {
        label: '安全・環境',
        description: '衛生管理者、気象予報士など、安全管理や環境保全に関する資格です。',
        position: 6
    },
    'creative': {
        label: 'クリエイティブ・芸術',
        description: 'デザイン、インテリア、色彩検定など、感性と技術を証明する資格です。',
        position: 7
    },
    'lifestyle': {
        label: 'ライフスタイル・趣味',
        description: 'アロマ、料理、旅行など、生活を豊かにする趣味や教養の資格です。',
        position: 8
    },
    'etc': {
        label: 'その他・教養',
        description: '語学、漢字検定、ご当地検定など、幅広い分野の知識を問う資格です。',
        position: 9
    }
};

for (const [dir, info] of Object.entries(categories)) {
    const dirPath = path.join(docsDir, dir);
    if (fs.existsSync(dirPath)) {
        const categoryJson = {
            label: info.label,
            position: info.position,
            link: {
                type: 'generated-index',
                description: info.description,
                slug: `/${dir}`
            }
        };
        fs.writeFileSync(path.join(dirPath, '_category_.json'), JSON.stringify(categoryJson, null, 2));
        console.log(`Created _category_.json for ${dir}`);
    } else {
        console.warn(`Directory ${dir} does not exist.`);
    }
}
