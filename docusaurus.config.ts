import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: '資格カタログ',
  tagline: '難易度・合格率・勉強法がわかる、資格・検定の総合情報サイト',
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
  organizationName: 'facebook', // Usually your GitHub org/user name.
  projectName: 'docusaurus', // Usually your repo name.

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
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
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
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-pwa',
      {
        debug: true,
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
      src: 'https://www.googletagmanager.com/gtag/js?id=G-PTXZKSKY58',
      async: true,
    },
    {
      src: 'https://shikaku.antonbase.com/gtag-init.js',
    },
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/og-default.png',
    metadata: [
      { name: 'keywords', content: '資格, 検定, 試験, 勉強法, 難易度, 合格率, 過去問, 独学, キャリアアップ, 転職, 就職' },
      { name: 'description', content: '資格カタログは、さまざまな資格・検定試験の情報を提供する総合情報サイトです。難易度、合格率、勉強法、試験日程など、資格取得に役立つ最新情報を提供します。' },
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
        {
          type: 'docSidebar',
          sidebarId: 'tutorialSidebar',
          position: 'left',
          label: '📚 資格一覧',
        },
        { to: '/blog', label: '📝 ブログ', position: 'left' },
        {
          href: 'https://job.antonbase.com',
          label: '🧭 しごと図鑑',
          position: 'left',
        },
        {
          href: 'https://x.com/shikaku_catalog',
          label: 'X (Twitter)',
          position: 'right',
        },
        {
          href: 'https://www.threads.com/@certifications_catalog',
          label: 'Threads',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '資格カテゴリー',
          items: [
            {
              label: 'ビジネス',
              to: '/docs/business',
            },
            {
              label: 'IT・技術',
              to: '/docs/technology',
            },
            {
              label: 'ライフスタイル',
              to: '/docs/lifestyle',
            },
          ],
        },
        {
          title: 'コミュニティ',
          items: [
            {
              label: 'ブログ',
              to: '/blog',
            },
            {
              label: '🧭 しごと図鑑（資格が活きる仕事）',
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
        {
          title: 'その他',
          items: [
            {
              label: '医療・福祉',
              to: '/docs/medical-welfare',
            },
            {
              label: '安全・環境',
              to: '/docs/safety-environment',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} 資格カタログ. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
    announcementBar: {
      id: 'support_us',
      content:
        '⭐️ 記事の更新や資格コラムをSNSで発信中！ <a target="_blank" rel="noopener noreferrer" href="https://x.com/shikaku_catalog">X (Twitter)</a> と <a target="_blank" rel="noopener noreferrer" href="https://www.threads.com/@certifications_catalog">Threads</a> をフォローしてね！ ⭐️',
      backgroundColor: '#fafbfc',
      textColor: '#091E42',
      isCloseable: true,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
