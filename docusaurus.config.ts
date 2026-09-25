import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '資格カタログ',
  tagline: '公式情報を重視し、難易度・勉強時間・試験方式から探せる資格・検定カタログ',
  favicon: 'img/favicon.png',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://shikaku.antonbase.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  // 本番では末尾スラッシュなしのURLが末尾スラッシュ付きへ308されるため、
  // 生成HTMLのcanonical・sitemap・内部リンクも最終200 URLに合わせる。
  trailingSlash: true,

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'nomuonji', // Usually your GitHub org/user name.
  projectName: 'shikaku-wiki', // Usually your repo name.

  onBrokenLinks: 'throw',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          showLastUpdateTime: true,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/nomuonji/shikaku-wiki/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/nomuonji/shikaku-wiki/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
        sitemap: {
          lastmod: 'date',
          changefreq: 'weekly',
          priority: 0.5,
          filename: 'sitemap.xml',
          ignorePatterns: ['/search/**', '/explore', '/explore/**'],
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    './plugins/qualification-index/index.mjs',
    [
      '@docusaurus/plugin-pwa',
      {
        debug: false,
        offlineModeActivationStrategies: [
          'appInstalled',
          'standalone',
          'queryString',
        ],
        pwaHead: [
          {
            tagName: 'link',
            rel: 'icon',
            href: '/img/logo.png',
          },
          {
            tagName: 'link',
            rel: 'manifest',
            href: '/manifest.json',
          },
          {
            tagName: 'meta',
            name: 'theme-color',
            content: 'rgb(31, 58, 95)',
          },
        ],
      },
    ],
  ],

  scripts: [
    {
      src: '/gtag-init.js',
      defer: true,
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/og-default.png',
    metadata: [
      { name: 'keywords', content: '資格, 検定, 試験, 勉強時間, 難易度, 受験資格, 試験方式, 独学, キャリアアップ, 転職, 就職' },
      { name: 'description', content: '資格カタログは、公式情報を重視しながら、受験資格・試験方式・日程・難易度・勉強時間の目安を整理する資格・検定の情報サイトです。' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:site', content: '@shikaku_catalog' },
      { name: 'twitter:creator', content: '@shikaku_catalog' },
    ],
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: '資格カタログ',
      logo: {
        alt: '資格カタログ Logo',
        src: 'img/logo.png',
      },
      items: [
        { to: '/explore/', label: '資格検索', position: 'left' },
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '資格一覧',
        },
        { to: '/blog/', label: 'ブログ', position: 'left' },
        {
          href: 'https://job.antonbase.com',
          label: 'しごと図鑑',
          position: 'left',
        },

      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '資格を探す',
          items: [
            { label: '資格検索・比較', to: '/explore/' },
            { label: 'ビジネス', to: '/docs/business/' },
            { label: 'IT・技術', to: '/docs/technology/' },
            { label: '法律・会計', to: '/docs/legal-accounting/' },
            { label: '医療・福祉', to: '/docs/medical-welfare/' },
          ],
        },
        {
          title: 'さらに分野を見る',
          items: [
            { label: '安全・環境', to: '/docs/safety-environment/' },
            { label: 'クリエイティブ', to: '/docs/creative/' },
            { label: 'ライフスタイル', to: '/docs/lifestyle/' },
            { label: '業界別', to: '/docs/industry/' },
            { label: 'ブログ', to: '/blog/' },
          ],
        },
        {
          title: 'このサイトについて',
          items: [
            {
              label: '編集方針・情報の見方',
              to: '/methodology/',
            },
            {
              label: 'しごと図鑑（資格が活きる仕事）',
              href: 'https://job.antonbase.com',
            },
            {
              label: 'X (Twitter)',
              href: 'https://x.com/shikaku_catalog',
            },
            {
              label: 'Threads',
              href: 'https://www.threads.com/@certifications_catalog',
            },
          ],
        },
      ],
      copyright: `© ${new Date().getFullYear()} 資格カタログ`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
