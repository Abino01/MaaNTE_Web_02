import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import { plumeTheme } from 'vuepress-theme-plume'
import { genNavigationComponents } from './navigation/genNavigationComponents.ts'

const navigationComponents = genNavigationComponents()

export default defineUserConfig({
  base: '/MaaNTE-Web/',
  lang: 'zh-CN',
  title: 'MaaNTE 文档站',
  description: 'MaaNTE | MAA 异环小助手',

  locales: {
    '/zh_cn/': {
      lang: 'zh-CN',
      title: 'MaaNTE 文档站',
      description: 'MaaNTE | MAA 异环小助手',
    },
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: 'images/logo_32x32.png' }],
  ],

  bundler: viteBundler(),
  shouldPrefetch: false,

  theme: plumeTheme({
    hostname: 'https://maa-nte.github.io',

    docsRepo: '1bananachicken/MaaNTE',
    docsDir: '/docs',
    docsBranch: 'main',

    editLink: true,

    cache: 'filesystem',

    autoFrontmatter: {
      permalink: false,
      createTime: false,
      title: false,
    },

    locales: {
      '/zh_cn/': {
        navbar: navigationComponents.navbar,
        collections: navigationComponents.collections,
      },
    },

    watermark: false,

    footer: false,
  }),
})
