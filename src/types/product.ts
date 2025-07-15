export interface ClientProduct {
  id: number
  name: string
  description: string | null
  imageUrl: string
  category: string
  vendorId: number
  vendorName: string
  unit: string
  price: number
  variations: {
    id: number
    name: string
    size: number
    packaged: boolean
    unit: string
    price: number
  }[]
  organic: boolean
  local: boolean
}

export type ClientProductSimple = Omit<
  ClientProduct,
  'variations' | 'price' | 'unit'
>

export interface getShopProductsResponse {
  products: ClientProduct[]
}

export function isClientProduct(
  product: ClientProduct | ClientProductSimple
): product is ClientProduct {
  return 'variations' in product
}
