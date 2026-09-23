import { defineConfig } from 'vitepress'
import { sidebar } from './sidebar'
// for js
// const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const isGithubActions = import.meta.env?.GITHUB_ACTIONS === 'true' || process.env.GITHUB_ACTIONS === 'true';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: isGithubActions ? '/rockman-doc/' : '/',
  title: "Rockman Series Documentation",
  description: "洛克人 EXE & 流星洛克人 完全攻略庫",
  srcDir: './',
  lastUpdated: true,
  themeConfig: {
    aside: false,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首頁', link: '/' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: '洛克人 EXE', link: '/exe/overview', activeMatch: '/exe/' },
      { text: '流星 ROCKMAN', link: '/starforce/overview', activeMatch: '/starforce/' },
    ],

    sidebar,



    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
