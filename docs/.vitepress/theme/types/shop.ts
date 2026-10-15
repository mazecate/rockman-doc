export interface ShopGroup {
  shopName: string
  currency: 'zenni' | 'bugFrag'
  items: {
    name: string
    price: number | string
    quantity?: number
  }[]
}