export interface MissionItem {
  title: string;
  trigger_location: string;
  content: string;
  answers?: string[];
  reward: string;
}

export interface ChapterGroup {
  chapter: string;
  missions: MissionItem[];
}

export interface SideQuestData {
  side_missions: ChapterGroup[];
}