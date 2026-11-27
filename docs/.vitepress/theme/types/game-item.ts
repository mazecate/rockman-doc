import type { LocalizedText, GameSeries } from "./common";

export type ItemVersionKey =
  | "common" // 共通：雙版本都有
  | "exe1"
  | "exe2"
  | "exe3"
  | "exe3-black"
  | "exe4" // 只知係 EXE4，未分藍月 / 紅日
  | "exe4-blue-moon" // EXE4 藍月
  | "exe4-red-sun" // EXE4 紅日
  | "exe5" // 只知係 EXE5，未分隊伍
  | "exe5-team-protoman" // EXE5 布魯斯隊 / Team Protoman
  | "exe5-team-colonel" // EXE5 卡尼爾隊 / Team Colonel
  | "exe6" // 只知係 EXE6，未分版本
  | "exe6-gregar" // EXE6 格雷卡 / Gregar
  | "exe6-falzar" // EXE6 法爾薩 / Falzar
  | (string & {});

export interface GameItem {
  /** 唔顯示喺界面，只用嚟做 :key 同計道具總數。JSON 入面必須唯一。 */
  id: string;
  /** 界面只顯示 zh，en / ja 留喺 JSON 入面俾搜尋用。 */
  name: LocalizedText;
  /** 道具說明 */
  description?: string | null;
  /** 入手方法，冇就顯示 '-' */
  obtain?: string | null;
  /**
   * 版本。留空 / [] 會當共通處理。
   * - 共通：['common']
   * - 藍月限定：['exe4-blue-moon']
   * - 雙版本都有但想逐個列出：['exe4-blue-moon', 'exe4-red-sun']
   */
  versions?: ItemVersionKey[] | null;
}

/**
 * JSON file 成個形狀：{ series, data }
 * series 係你手動寫：'exe1' / 'exe2' / ...
 * data 係 GameItem[]
 */
export interface GameItemFile {
  series: GameSeries;
  data: GameItem[];
}
