import type { DefaultTheme } from 'vitepress';
import type { MenuConfig, ChipsSubmenuConfig, NaviCustSubmenuConfig } from '@/theme/types';

// Ref: https://vitepress.dev/reference/default-theme-config#sidebar

type SidebarItem = DefaultTheme.SidebarItem;

// 1. 各版本顯示名稱對照表
const VERSION_NAME_MAP: Record<string, string> = {
  white: '⚪ 白版',
  black: '⚫ 黑版',
  redSun: '🔴 紅太陽',
  blueMoon: '🔵 藍月亮',
  teamBlues: '🔵 Team of Blues 版',
  teamColonel: '🟠 Team of Colonel 版',
  gregar: '🔥 Gregar 版',
  falzar: '⚡ Falzar 版',
};

function getVersionDisplayName(key: string): string {
  return VERSION_NAME_MAP[key] || `${key} 版`;
}

function getChipsMenuItems(folderPath: string, config: ChipsSubmenuConfig): SidebarItem[] {
  const {
    standard = false,
    mega = false,
    giga = false,
    dark = false,
    secret = false,
    versions
  } = config;

  const subItems: SidebarItem[] = [];

  if (standard) subItems.push({ text: '標準晶片', link: `${folderPath}/chips/standard` });
  if (mega)     subItems.push({ text: 'MEGA 晶片', link: `${folderPath}/chips/mega` });
  if (giga)     subItems.push({ text: 'GIGA 晶片', link: `${folderPath}/chips/giga` });

  // 2. 不分版本（EXE 1、2），共用的 Mega / Giga
  // if (!versions || Object.keys(versions).length === 0) {}

  // === 情況 A：如果有傳入 versions（代表有分雙版本） ===
  if (versions && Object.keys(versions).length > 0) {
    // 動態遍歷各個版本的專屬選單
    for (const [verKey, verConfig] of Object.entries(versions)) {
      const verItems: SidebarItem[] = [];
      
      // if (verConfig.standard) verItems.push({ text: '標準晶片', link: `${folderPath}/chips/${verKey}/standard` });
      if (verConfig.mega)     verItems.push({ text: 'MEGA 晶片', link: `${folderPath}/chips/${verKey}/mega` });
      if (verConfig.giga)     verItems.push({ text: 'GIGA 晶片', link: `${folderPath}/chips/${verKey}/giga` });

      if (verItems.length > 0) {
        subItems.push({
          text: getVersionDisplayName(verKey),
          collapsed: false,
          items: verItems
        });
      }
    }
  }

  if (dark)     subItems.push({ text: '暗黑晶片', link: `${folderPath}/chips/dark` });
  if (secret)   subItems.push({ text: '祕密晶片', link: `${folderPath}/chips/secret` });

  return subItems;
}

function getNaviCustMenuItems(folderPath: string, config: boolean | NaviCustSubmenuConfig): SidebarItem[] {
  const subConfig = typeof config === 'object' ? config : { intro: true, programs: true };
  const { intro = true, programs = true, rotate = true } = subConfig;

  const subItems: SidebarItem[] = [];

  if (intro) {
    const introLink = typeof intro === 'string' ? intro : `${folderPath}/navicust/intro`;
    const isExternal = introLink.startsWith('http');
    // subItems.push({ text: '官方簡介', link: introLink, target: isExternal ? '_blank' : undefined, rel: isExternal ? 'noopener noreferrer' : undefined, });
    subItems.push({ text: '官方簡介', link: introLink, });
  }

  if (programs) subItems.push({ text: '程式零件', link: `${folderPath}/navicust/programs` });
  if (rotate) subItems.push({ text: '旋轉道具', link: `${folderPath}/navicust/rotate` });

  return subItems;
}

function getSubMenuItems(folderPath: string, config: MenuConfig = {}): SidebarItem[] {
  const {
    walkthrough = true,
    underworld = true,
    trader = true,
    naviloc = true,
    navicust = false,
    pa = true,
    chips = true,
    powerups = true,
    stars = true,
    shops = true,
    sidequest = true,
    chiptrade = true
  } = config;

  const items: SidebarItem[] = [];

  if (walkthrough) items.push({ text: '表關攻略', link: `${folderPath}/walkthrough` });
  if (underworld) items.push({ text: '裏關要素', link: `${folderPath}/underworld` });

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

  // === 領航員個人化裝置 Submenu 邏輯 ===
  if (navicust) {
    if (typeof navicust === 'object') {
      items.push({
        text: '領航員個人化裝置',
        collapsed: true,
        items: getNaviCustMenuItems(folderPath, navicust)
      });
    } else {
      items.push({ text: '領航員個人化裝置', link: `${folderPath}/navicust` });
    }
  }

  if (pa)        items.push({ text: '程式進化 (PA)', link: `${folderPath}/program-advances` });
  if (trader)    items.push({ text: '數字交易機', link: `${folderPath}/trader` });
  if (naviloc)   items.push({ text: '領航員位置', link: `${folderPath}/navi-locations` });
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
        navicust: {
          intro: 'https://game.capcom.com/manual/REXEAC/vol1/zh-hant/switch/page/3/4',
          programs: true,
          rotate: true
        },
        chips: { 
          standard: true,
          mega: true,
          versions: {
            white: { giga: true },
            black: { giga: true }
          }
        }
      })
    },
    {
      text: '洛克人 EXE 4',
      collapsed: true,
      items: getSubMenuItems('/exe/exe4', {
        navicust: {
          intro: 'https://game.capcom.com/manual/REXEAC/vol2/zh-hant/switch/page/1/4',
          programs: true
        },
        chiptrade: false,
        chips: {
          standard: true,
          secret: true,
          versions: {
            redSun: { mega: true, giga: true },
            blueMoon: { mega: true, giga: true }
          }
        }
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
      items: getSubMenuItems('/starforce/sf1', { trader: false, naviloc: false, pa: false, chips: true })
    },
    {
      text: '流星洛克人 2',
      collapsed: true,
      items: getSubMenuItems('/starforce/sf2', { trader: false, naviloc: false, pa: false, chips: true })
    },
    {
      text: '流星洛克人 3',
      collapsed: true,
      items: getSubMenuItems('/starforce/sf3', { trader: false, naviloc: false, pa: false, chips: true })
    }
  ]
};