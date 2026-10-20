export interface EXE4SpecialQuestMeta {
  type: "timeline" | "assembly";
  title: string;
  description?: string;
  prerequisites?: string[];
  totalCost?: string;
  reward?: string;
  hiddenFeatures?: string[];
}

export interface EXE4QuestStep {
  stepNumber: number;
  location: string;
  content: string;
  tips?: string;
}

export interface EXE4AssemblyPart {
  name: string;
  location: string;
  cost: string;
}

export interface EXE4AssemblyInfo {
  parts: EXE4AssemblyPart[];
  assemblyText: string; // 整合後的組裝說明
}

export interface EXE4SpecialQuestData {
  meta: EXE4SpecialQuestMeta;
  steps?: EXE4QuestStep[];
  assembly?: EXE4AssemblyInfo;
}
