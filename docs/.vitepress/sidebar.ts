import type { DefaultTheme } from 'vitepress';
import type { MenuConfig } from './theme/types';

// Ref
// https://vitepress.dev/reference/default-theme-config#sidebar

type SidebarItem = DefaultTheme.SidebarItem;

function getSubMenuItems(folderPath: string, config: MenuConfig = {}): SidebarItem[] {

  const {
    walkthrough = true,
    trader = true,
    navi = true,
    pa = true,
    powerups = true,
    stars = true
  } = config;

  const items:SidebarItem[] = []

  if (walkthrough) items.push({ text: '流程攻略', link: `${folderPath}/walkthrough` });
  if (trader)      items.push({ text: '數字交易機', link: `${folderPath}/trader` });
  if (navi)        items.push({ text: '領航員位置', link: `${folderPath}/navi-locations` });
  if (pa)          items.push({ text: '程式進化 (PA)', link: `${folderPath}/program-advances` });
  if (powerups)    items.push({ text: '強化部件', link: `${folderPath}/powerups` });
  if (stars)        items.push({ text: '星之證', link: `${folderPath}/stars` });

  return items;
}

export const sidebar: DefaultTheme.Sidebar = {
  // === 洛克人 EXE 系列 Sidebar ===
  '/exe/': [
    { text: '📌 系列簡介', link: '/exe/overview' },
    {
      text: '洛克人 EXE 1',
      collapsed: false,
      items: getSubMenuItems('/exe/exe1', {trader: false})
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
      items: getSubMenuItems('/starforce/sf1', { trader: false, navi: false, pa: false })
    },
    {
      text: '流星洛克人 2',
      collapsed: true,
      items: getSubMenuItems('/starforce/sf2', { trader: false, navi: false, pa: false })
    },
    {
      text: '流星洛克人 3',
      collapsed: true,
      items: getSubMenuItems('/starforce/sf3', { trader: false, navi: false, pa: false })
    }
  ]
}