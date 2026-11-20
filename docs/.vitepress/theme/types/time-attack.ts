export interface LocalizedText {
  zh: string
  ja: string
  en?: string
}

export interface TaBoss {
  id: string
  name: LocalizedText
  location: LocalizedText
  targetTime: string
  folder: LocalizedText[]
  note?: LocalizedText
}

export interface TaProgressRecord {
  bestTimeSeconds: number | null
  cleared: boolean
}

export interface FolderLocStep {
  name: LocalizedText
  loc: LocalizedText
  image: string
}

export interface TaDataFile {
  data: TaBoss[]
  notice?: LocalizedText[]
  folderLoc?: FolderLocStep[]
}