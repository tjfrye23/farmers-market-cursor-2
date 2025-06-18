// Product type migrated from the other project
export interface Product {
  id: number
  name: string
  description?: string
  price: number
  stock: number
  category?: string
  imageUrl?: string
  vendorProfileId: number
  createdAt?: string
  updatedAt?: string
  unit?: string
  organic?: boolean
  local?: boolean
}
