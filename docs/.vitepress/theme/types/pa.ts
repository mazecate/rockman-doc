/**
 * 原始 PA 資料項目的介面定義
 */
export interface PaItem {
    no: number,
    nameZh: string,
    nameEn?: string,
    damage?: number,
    /** 
     * 晶片組合：
     * - 字串：例如 "加農砲 A + 加農砲 B / 加農大砲 A"
     * - 一維陣列：例如 ["加農砲 A", "加農砲 B"]
     * - 二維陣列（多組替代配方）：例如 [["加農砲 A", "加農砲 B"], ["加農大砲 A", "加農大砲 B"]]
     */
    combination: string | string[] | string[][],
    description: string,
  }
  
  /**
   * 經過格式化並附帶流水號（NO.）的表格顯示項目
   */
  export interface FormattedPaItem extends PaItem {
    /** 解析後的晶片組合陣列 (統一為二維陣列以便渲染) */
    comboGroups: string[][]
  }