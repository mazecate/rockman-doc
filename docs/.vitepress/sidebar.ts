import type { DefaultTheme } from 'vitepress';
import type { MenuConfig, ChipsSubmenuConfig } from '@/theme/types';

// Ref: https://vitepress.dev/reference/default-theme-config#sidebar

type SidebarItem = DefaultTheme.SidebarItem;

function getChipsMenuItems(folderPath: string, config: ChipsSubmenuConfig): SidebarItem[] {
  const {
    standard = true,
    mega = true,
    giga = true,
    dark = true,
    secret = true
  } = config;

  const subItems: SidebarItem[] = [];

  if (standard) subItems.push({ text: '標準晶片', link: `${folderPath}/chips/standard` });
  if (mega)     subItems.push({ text: 'MEGA 晶片', link: `${folderPath}/chips/mega` });
  if (giga)     subItems.push({ text: 'GIGA 晶片', link: `${folderPath}/chips/giga` });
  if (dark)     subItems.push({ text: '暗黑晶片', link: `${folderPath}/chips/dark` });
  if (secret)   subItems.push({ text: '祕密晶片', link: `${folderPath}/chips/secret` });

  return subItems;
}

function getSubMenuItems(folderPath: string, config: MenuConfig = {}): SidebarItem[] {
  const {
    walkthrough = true,
    trader = true,
    navi = true,
    pa = true,
    chips = true,
    powerups = true,
    stars = true,
    shops = true,
    sidequest = true,
    chiptrade = true
  } = config;

  const items: SidebarItem[] = [];

  if (walkthrough) items.push({ text: '流程攻略', link: `${folderPath}/walkthrough` });

  // === 晶片圖鑑 Submenu 邏輯 ===
  if (chips) {
    if (typeof chips === 'object') {
      items.push({
        text: '晶片圖鑑',
        collapsed: true,
        items: getChipsMenuItems(folderPath, chips)
      });
    } else {
      items.push({ text: '晶片圖鑑', link: `${folderPath}/chips` });
    }
  }

  if (pa)        items.push({ text: '程式進化 (PA)', link: `${folderPath}/program-advances` });
  if (trader)    items.push({ text: '數字交易機', link: `${folderPath}/trader` });
  if (navi)      items.push({ text: '領航員位置', link: `${folderPath}/navi-locations` });
  if (powerups)  items.push({ text: '強化部件', link: `${folderPath}/powerups` });
  if (stars)     items.push({ text: '星之證', link: `${folderPath}/stars` });
  if (shops)     items.push({ text: '商店', link: `${folderPath}/shops` });
  if (sidequest) items.push({ text: '支線任務', link: `${folderPath}/side-quest` });
  if (chiptrade) items.push({ text: '晶片交換', link: `${folderPath}/chip-trade` });

  return items;
}

export const sidebar: DefaultTheme.Sidebar = {
  // === 洛克人 EXE 系列 Sidebar ===
  '/exe/': [
    { text: '📌 系列簡介', link: '/exe/overview' },
    {
      text: '洛克人 EXE 1',
      collapsed: false,
      items: getSubMenuItems('/exe/exe1', { trader: false, chips: true })
    },
    {
      text: '洛克人 EXE 2',
      collapsed: true,
      items: getSubMenuItems('/exe/exe2', { trader: false, chips: true })
    },
    {
      text: '洛克人 EXE 3',
      collapsed: true,
      items: getSubMenuItems('/exe/exe3', {
        chips: { standard: true, mega: true, giga: true }
      })
    },
    {
      text: '洛克人 EXE 4',
      collapsed: true,
      items: getSubMenuItems('/exe/exe4', {
        chiptrade: false,
        chips: { standard: true, mega: true, giga: true, dark: true, secret: true }
      })
    },
    {
      text: '洛克人 EXE 5',
      collapsed: true,
      items: getSubMenuItems('/exe/exe5', {
        chips: true
      })
    },
    {
      text: '洛克人 EXE 6',
      collapsed: true,
      items: getSubMenuItems('/exe/exe6', {
        chips: true
      })
    }
  ],

  // === 流星洛克人系列 Sidebar ===
  '/starforce/': [
    { text: '📌 系列簡介', link: '/starforce/overview' },
    {
      text: '流星洛克人 1',
      collapsed: false,
      items: getSubMenuItems('/starforce/sf1', { trader: false, navi: false, pa: false, chips: true })
    },
    {
      text: '流星洛克人 2',
      collapsed: true,
      items: getSubMenuItems('/starforce/sf2', { trader: false, navi: false, pa: false, chips: true })
    },
    {
      text: '流星洛克人 3',
      collapsed: true,
      items: getSubMenuItems('/starforce/sf3', { trader: false, navi: false, pa: false, chips: true })
    }
  ]
};