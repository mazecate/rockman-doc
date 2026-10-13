export interface PowerUpRoundItemEntry {
    cycle: number;
    type: 'reg' | 'hp' | 'parts' | 'expand' | 'side' | 'shop';
    method: string;
    name?: string;
    location: string;
    value?: string | number;
    price?: string;
}