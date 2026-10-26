export interface ChipTradeItem {
    chapter: string
    location: string
    give: string[]
    receive: string[]
}

export interface ChipTradeData {
    trades: ChipTradeItem[]
}