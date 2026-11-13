export interface MultiLangText {
  zh: string
  ja: string
  en?: string
}

export interface VirusVersionInfo {
  location: MultiLangText
  rewards: MultiLangText
  image?: string // 預留給該地點的截圖路徑 (選填)
}

export interface VirusItem {
  id: string
  name: MultiLangText
  normal: VirusVersionInfo
  sp: VirusVersionInfo
}

export interface VirusProgressRecord {
  normal: boolean
  sp: boolean
}