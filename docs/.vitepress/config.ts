import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { sidebar } from './sidebar'
// for js
// const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

const isGithubActions = import.meta.env?.GITHUB_ACTIONS === 'true' || process.env.GITHUB_ACTIONS === 'true';
const githubLink = 'https://github.com/mazecate';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: isGithubActions ? '/rockman-doc/' : '/',
  title: "Rockman Series",
  description: "洛克人 EXE & 流星洛克人 資料庫",
  srcDir: './',
  lastUpdated: true,
  sitemap: {
    hostname: githubLink
  },
  themeConfig: {
    aside: true,
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首頁', link: '/' },
      { text: 'API', link: '/api-examples' },
      { text: 'Examples', link: '/markdown-examples' },
      { text: '洛克人 EXE', link: '/exe/overview', activeMatch: '/exe/' },
      { text: '流星洛克人', link: '/starforce/overview', activeMatch: '/starforce/' },
    ],
    sidebar,
    socialLinks: [
      { icon: 'github', link: githubLink }
    ]
  },
  vite: {
    resolve: {
      alias: {
        // 設定 @ 指向 docs 資料夾
        // path.resolve(__dirname, '../')
        '@': fileURLToPath(new URL('../', import.meta.url))
      }
    }
  }
})
