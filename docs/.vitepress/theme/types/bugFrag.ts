export type BugFragCategory = 'real' | 'net';

export interface BugFragItem {
  id: string;
  category: BugFragCategory;
  region: string;
  name: string;
  note?: string;
  locationImage?: string;
}

export interface BugFragDataset {
  game: string;
  category: string;
  data: BugFragItem[];
}