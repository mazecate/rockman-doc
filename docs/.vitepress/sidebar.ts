import type { DefaultTheme } from 'vitepress'

function getSubMenuItems(folderPath: string): DefaultTheme.SidebarItem[] {
  return [
    { text: '流程攻略', link: `${folderPath}/walkthrough` },
    { text: '數字交易機', link: `${folderPath}/trader` },
    { text: '機兵位置', link: `${folderPath}/navi-locations` },
    { text: '程式進化 (PA)', link: `${folderPath}/program-advances` },
    { text: '強化部件入手方法', link: `${folderPath}/powerups` }
  ]
}

export const sidebar: DefaultTheme.Sidebar = {
  // === 洛克人 EXE 系列 Sidebar ===
  '/exe/': [
    { text: '📌 系列簡介', link: '/exe/overview' },
    {
      text: '洛克人 EXE 1',
      collapsed: false,
      items: getSubMenuItems('/exe/exe1')
    },
    {
      text: '洛克人 EXE 2',
      collapsed: true,
      items: getSubMenuItems('/exe/exe2')
    },
    {
      text: '洛克人 EXE 3',
      collapsed: true,
      items: getSubMenuItems('/exe/exe3')
    },
    {
      text: '洛克人 EXE 4',
      collapsed: true,
      items: getSubMenuItems('/exe/exe4')
    },
    {
      text: '洛克人 EXE 5',
      collapsed: true,
      items: getSubMenuItems('/exe/exe5')
    },
    {
      text: '洛克人 EXE 6',
      collapsed: true,
      items: getSubMenuItems('/exe/exe6')
    }
  ],

  // === 流星洛克人系列 Sidebar ===
  '/starforce/': [
    { text: '📌 系列簡介', link: '/starforce/overview' },
    {
      text: '流星洛克人 1',
      collapsed: false,
      items: getSubMenuItems('/starforce/sf1')
    },
    {
      text: '流星洛克人 2',
      collapsed: true,
      items: getSubMenuItems('/starforce/sf2')
    },
    {
      text: '流星洛克人 3',
      collapsed: true,
      items: getSubMenuItems('/starforce/sf3')
    }
  ]
}