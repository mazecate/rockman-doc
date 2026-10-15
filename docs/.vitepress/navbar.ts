import type { DefaultTheme } from 'vitepress'

export const navConfig: DefaultTheme.NavItem[] = [
    { text: '首頁', link: '/' },
    { text: 'API', link: '/api-examples' },
    { text: 'Examples', link: '/markdown-examples' },
    { text: '洛克人 EXE', link: '/exe/overview', activeMatch: '/exe/' },
    { text: '流星洛克人', link: '/starforce/overview', activeMatch: '/starforce/' },
]

// Reference
// https://vitepress.dev/zh/reference/default-theme-config#nav