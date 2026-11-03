export interface ShopGroup {
  shopName: string
  shopNameEn?: string
  shopNameJp?: string
  currency: 'zenni' | 'bugFrag'
  type?: string
  items: {
    name: string
    nameEn?: string
    nameJp?: string
    price: number | string
    quantity?: number
    version?: 'black' | 'white' | string; // 新增版本屬性
  }[]
}