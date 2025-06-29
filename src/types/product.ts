// Product type migrated from the other project
export interface UIProduct {
  id: number
  name: string
  description: string | null
  imageUrl: string
  category: string
  vendorId: number
  vendorName: string
  unit: string
  variations: {
    id: number
    name: string
    size: number
    packaged: boolean
    symbol: string
    price: number
  }[]
  organic: boolean
  local: boolean
}

export interface getShopProductsResponse {
  products: UIProduct[]
}
