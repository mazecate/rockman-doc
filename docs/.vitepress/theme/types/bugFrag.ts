import type { LocalizedText } from './common'

export type BugFragCategory = "real" | "net";

// export interface LocalizedText {
//   zh: string;
//   en: string;
//   ja: string;
// }

export interface BugFragItem {
  id: string;
  category: BugFragCategory;
  region: string;
  location: LocalizedText;
  note?: LocalizedText;
  locationImage?: string;
}

export interface BugFragDataset {
  game: string;
  category: string;
  data: BugFragItem[];
}
