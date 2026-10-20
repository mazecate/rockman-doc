export interface ChipItem {
  no: number;
  nameZh: string;
  nameJp: string;
  nameEn: string;
  damage: string | number;
  element: string;
  rarity?: string; // 稀有度
  codes?: string[]; // 代碼陣列 (例如 ["K", "M", "S"])
  drops?: string[]; // 掉落敵人和出沒區域
}
