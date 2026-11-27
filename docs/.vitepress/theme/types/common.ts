export interface LocalizedText {
  zh: string;
  en: string;
  ja: string;
}

export type GameSeries = 'exe1' | 'exe2' | 'exe3' | 'exe4' | 'exe5' | 'exe6' | 'sf1' | 'sf2' | 'sf3' | (string & {});