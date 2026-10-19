import { defineConfig } from 'vitepress'
import { fileURLToPath, URL } from 'node:url'
import path from 'node:path'
import { sidebar } from './sidebar'
import { navConfig } from './navbar'

// for js
// const isGithubActions = process.env.GITHUB_ACTIONS === 'true';

// time format 
// dateStyle: 'short' ➡️ 2026/10/17
// dateStyle: 'medium' ➡️ 2026年10月17日
// dateStyle: 'long' ➡️ 2026年10月17日
// dateStyle: 'full' ➡️ 2026年10月17日 星期六


const isGithubActions = import.meta.env?.GITHUB_ACTIONS === 'true' || process.env.GITHUB_ACTIONS === 'true';
const githubLink = 'https://github.com/mazecate';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: isGithubActions ? '/rockman-doc/' : '/',
  lang: 'zh-Hant',
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
    nav: navConfig,
    sidebar,
    outline: {
      label: '目錄'
    },
    sidebarMenuLabel: '選單',
    returnToTopLabel: '回到頂部',
    // darkModeSwitchLabel: '外觀',
    // lightModeSwitchTitle: '切換到淺色模式',
    // darkModeSwitchTitle: '切換到深色模式',
    lastUpdated: {
      text: '最後更新於',
      formatOptions: {
        dateStyle: 'short',
        // timeStyle: 'medium',     // 可選 'full', 'long', 'medium', 'short'
        // hour12: false            // 設置為 false 強制使用 24 小時制
      }
    },
    footer: {
      // message: 'this is message。',
      copyright: `&copy; ${new Date().getFullYear()} mazecate. All Rights Reserved.`
    },
    socialLinks: [
      { icon: 'github', link: githubLink }
    ]
  },
  vite: {
    resolve: {
      // alias: {
      //   // 設定 @ 指向 docs 資料夾
      //   // path.resolve(__dirname, '../')
      //   '@': fileURLToPath(new URL('../', import.meta.url))
      // }
      alias: [
        // 1. 讓開頭是 @/data 的路徑，直接對應到 docs/data 資料夾
        {
          find: '@/data',
          replacement: fileURLToPath(new URL('../data', import.meta.url))
        },
        // 2. 讓開頭是 @/theme 的路徑，直接對應到 docs/.vitepress/theme 資料夾
        {
          find: '@/theme',
          replacement: fileURLToPath(new URL('./theme', import.meta.url))
        },
        // 3. 預設的 @ 保險對應（指向 docs 根目錄）
        {
          find: '@',
          replacement: fileURLToPath(new URL('../', import.meta.url))
        }
      ]
    }
  }
})
