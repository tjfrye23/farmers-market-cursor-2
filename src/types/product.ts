import z from 'zod'
import { ClientMarketDay } from './marketDay'
import { ClientVendor } from './vendors'
import { ProductCategory } from '@/generated/prisma'

export interface ClientMarketDayProduct {
  id: number
  name: string
  description: string | null
  imageUrl: string
  category: string
  unit: ClientProductUnit
  price: number
  variations: ClientMarketDayProductVariation[]
  organic: boolean
  local: boolean
  marketDay: ClientMarketDay
  vendor: Pick<ClientVendor, 'id' | 'businessName'>
}

export interface ClientMarketDayProductVariation {
  id: number
  name: string
  size: number
  packaged: boolean
  unit: ClientProductUnit
  price: number
  quantity: number
}

export interface ClientProductUnit {
  id: number
  name: string
  pluralName: string
  displayName: string
  symbol: string
}

export type ClientProduct = Omit<
  ClientMarketDayProduct,
  'variations' | 'marketDay'
> & {
  variations: ClientProductVariation[]
}

export type ClientProductVariation = Omit<
  ClientMarketDayProductVariation,
  'quantity'
>

export type ClientProductSimple = Omit<
  ClientProduct,
  'variations' | 'price' | 'unit'
>

export function isClientProduct(
  product: ClientProduct | ClientProductSimple
): product is ClientProduct {
  return 'variations' in product
}

export function isClientMarketDayProduct(
  product: ClientProduct | ClientMarketDayProduct
): product is ClientMarketDayProduct {
  return 'marketDay' in product
}

// Use Zod for category validation instead of manual type casting
const categorySchema = z.nativeEnum(ProductCategory)

export function isCategory(category: string): category is ProductCategory {
  return categorySchema.safeParse(category).success
}

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.nativeEnum(ProductCategory),
  imageUrl: z.string().url('Please provide a valid image URL'),
  organic: z.boolean(),
  local: z.boolean(),
  variations: z
    .array(
      z.object({
        name: z.string().min(1, 'Variation name is required'),
        price: z.number().min(0, 'Price must be non-negative'),
        size: z.number().min(1, 'Size must be at least 1'),
        packaged: z.boolean(),
        unitId: z.number().min(1, 'Unit is required'),
      })
    )
    .min(1, 'At least one variation is required'),
})

export type CreateProductSchema = z.infer<typeof createProductSchema>
