import type { LocalizedText } from "./common";

export interface VirusVersionInfo {
  location: LocalizedText
  rewards: LocalizedText
  image?: string // 預留給該地點的截圖路徑 (選填)
}

export interface VirusItem {
  id: string
  name: LocalizedText
  normal: VirusVersionInfo
  sp: VirusVersionInfo
}

export interface VirusProgressRecord {
  normal: boolean
  sp: boolean
}