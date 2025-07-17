import { ClientMarketDay } from './marketDay'
import { ClientProductUnit } from './product'
import { ClientVendorSimple } from './vendors'

export interface ClientCart {
  marketDay: ClientMarketDay
  items: ClientCartItem[]
}

export interface ClientCartItem {
  name: string
  imageUrl: string
  price: number
  quantity: number
  unit: ClientProductUnit
  variationId: number
  packaged: boolean
  size: number
  vendor: ClientVendorSimple
}

export type ClientCartSimple = Omit<ClientCart, 'items'> & {
  items: ClientCartItemSimple[]
}

export interface ClientCartItemSimple {
  variationId: number
  quantity: number
}
