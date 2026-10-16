export interface ShopGroup {
  shopName: string
  shopNameEn?: string
  shopNameJp?: string
  currency: 'zenni' | 'bugFrag'
  items: {
    name: string
    nameEn?: string
    nameJp?: string
    price: number | string
    quantity?: number
  }[]
}