export type GameSeries = 'exe1' | 'exe2' | 'exe3' | 'exe4' | 'exe5' | 'exe6' | 'sf1' | 'sf2' | 'sf3'

export interface StarItem {
  id: string;
  name: string;
  color?: string;
  image?: string;
  condition: string;
  extra?: string;
}

export interface GameStarsData {
  series: GameSeries; // 遊戲系列：'exe1_3' (星星) | 'exe4_6' (標章/徽章)
  title: string;
  bannerImage?: string;
  ultimateNote?: string;
  ultimateExtra?: string; // 新增：用於最終頭目/通關機制的指令
  stars: StarItem[];
}
