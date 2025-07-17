import { ClientMarketDay } from './marketDay'
import { ClientVendor } from './vendors'

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
