import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';
import sidebars from './sidebars';
import llmsTxtPlugin from './plugins/llms-txt';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'WSO2 Cloud Docs',
  tagline: 'Documentation for WSO2 Cloud',
  favicon: 'img/favicon.ico',

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Production docs host, as linked from the WSO2 Cloud console footer. The same
  // image is promoted dev -> stage -> prod, so this must be the prod URL.
  url: 'https://docs.wso2.com',
  baseUrl: '/',

  organizationName: 'wso2',
  projectName: 'docs-wso2cloud',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: 'docs',
        },
        blog: false,
        theme: {
          // theme.css layers the shared WSO2 docs theme over custom.css.
          customCss: ['./src/css/custom.css', './src/css/theme.css'],
        },
      } satisfies Preset.Options,
    ],
  ],

  // Machine-readable copies of the docs for AI agents: /llms.txt and friends.
  plugins: [[llmsTxtPlugin, {sidebars, sidebarId: 'docsSidebar'}]],

  themes: [
    [
      '@easyops-cn/docusaurus-search-local',
      {
        hashed: true,
        docsRouteBasePath: 'docs',
        indexBlog: false,
        indexPages: false,
      },
    ],
  ],

  themeConfig: {
    // TODO: add a 1200x630 social card image and set `image` here.
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'WSO2 Cloud',
      logo: {
        alt: 'WSO2 Cloud',
        src: 'img/favicon.ico',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentation',
        },
        {
          href: 'https://github.com/wso2/docs-wso2cloud',
          position: 'right',
          className: 'header-github-link',
          'aria-label': 'GitHub repository',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentation',
          items: [
            {
              label: 'What is WSO2 Cloud?',
              to: '/docs/get-started/what-is-wso2-cloud',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/wso2/docs-wso2cloud',
            },
            {
              label: 'WSO2',
              href: 'https://wso2.com',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} WSO2 LLC. Licensed under Apache License 2.0.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
