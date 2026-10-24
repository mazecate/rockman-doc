export interface PowerUpRoundItemEntry {
    cycle: number;
    type: 'reg' | 'hp' | 'parts' | 'expand' | 'side' | 'shop';
    method: string;
    name?: string;
    location: string;
    locationImage?: string;
    value?: string | number;
    price?: string;
}

export interface PowerUpItem {
    type: string       // 'hp' | '子彈強化' | 'reg' | 'sub' | 'expand' | 'armor' 等
    name: string       // 道具名稱
    method: string     // 入手方法 / 購買說明
    location: string   // 地點
    price?: string     // 價格 (選填)
    value?: number     // 數值增量（例如常駐 UP 的 +1、+2 等）
    locationImage?: string | null // 地圖截圖路徑
}