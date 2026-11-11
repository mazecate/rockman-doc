export interface NaviPartItem {
  nameZh: string;        // 中文名稱
  nameEn: string;        // 英文名稱
  nameJp: string;        // 日文名稱（括號內的字）
  color: string;         // 顏色
  method: string;        // 取得方法
  effect: string;        // 影響（效果）
  image?: string | null; // 圖片檔名
  compressionCommand?: string; // 壓縮指令 (EXE 4 會隱藏)
}

export interface NaviCustTableData {
  series: string;        // 系列判斷變數（例如 'exe3', 'exe4'）
  parts: NaviPartItem[]; // 程式部件列表
}

export interface NaviRotateItem {
  nameZh: string;
  nameEn: string;
  nameJp: string;
  color: string;
  method: string;
  effect: string;
  image?: string | null;
}

export interface NaviRotateItemTableData {
  series: string;
  items: NaviRotateItem[];
}