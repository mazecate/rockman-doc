import { withBase } from 'vitepress'
import type { PowerUpRoundItemEntry } from '../types'

export const getImagePath = (path: string): string | undefined => {
  if (!path || path.trim() === '') {
    return undefined
  }
  return withBase(path)
}

export const getDataObjectImagePath = (item: PowerUpRoundItemEntry): string | undefined => {
  let rawPath = item?.locationImage
  
  if (!rawPath && item?.location) {
    const cleanLoc = item.location.replace(/[📍\s]/g, '').replace(/\(.*?\)/g, '')
    if (cleanLoc) {
      rawPath = `/assets/images/exe4/locations/${cleanLoc}.png`
    }
  }

  return rawPath ? getImagePath(rawPath) : undefined
}