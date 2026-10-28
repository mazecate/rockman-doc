export interface BaseChipItem {
  no: number;
  nameZh: string;
  nameJp: string;
  nameEn: string;
  damage: string | number;
  element: string;
  rarity?: string; // 稀有度
  description: string; // 必定存在於基礎介面
  codes?: string[]; // 代碼陣列 (例如 ["K", "M", "S"])
  drops?: string[]; // 掉落敵人和出沒區域
}

// EXE2 / EXE3 專用（帶有記憶體容量 Memory）
export interface MemoryChipItem extends BaseChipItem {
  memory: string | number;
}

// exe3,exe4,exe5,exe6 not have
export interface RarityChipItem extends BaseChipItem {
  rarity?: string;
}

export type ChipItem = BaseChipItem & Partial<MemoryChipItem> & Partial<RarityChipItem>;