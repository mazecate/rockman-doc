export type NaviVersionType = 'V2' | 'V3' | 'EX' | 'SP' | 'FZ' | 'DS' | 'XX';

export interface NaviLocationDetail {
  versionType: NaviVersionType
  location: string
  locationJp?: string
  isRandom: boolean
  note?: string
}

export interface NaviLocation {
  name: string
  nameEn?: string
  nameJp?: string
  gameVersion?: string
  locations: NaviLocationDetail[]
}