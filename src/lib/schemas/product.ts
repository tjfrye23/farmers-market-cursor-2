import { z } from 'zod'
import { ProductCategory } from '@/generated/prisma/client'

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().min(1, 'Description is required'),
  category: z.nativeEnum(ProductCategory),
  imageUrl: z.string().url('Please provide a valid image URL'),
  organic: z.boolean().default(false),
  local: z.boolean().default(false),
  variations: z.array(
    z.object({
      name: z.string().min(1, 'Variation name is required'),
      price: z.number().min(0, 'Price must be non-negative'),
      size: z.number().min(1, 'Size must be at least 1'),
      packaged: z.boolean().default(false),
      unitId: z.number().min(1, 'Unit is required'),
    })
  ),
})

export const updateProductSchema = createProductSchema.partial()

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>

export const productsQuerySchema = z.object({
  marketDayId: z.string().transform((val) => {
    const parsed = parseInt(val, 10)
    if (isNaN(parsed)) {
      throw new Error('Invalid marketDayId')
    }
    return parsed
  }),
  category: z.array(z.nativeEnum(ProductCategory)).optional(),
  vendor: z
    .array(
      z.string().transform((val) => {
        const parsed = parseInt(val, 10)
        if (isNaN(parsed)) {
          throw new Error('Invalid vendor ID')
        }
        return parsed
      })
    )
    .optional(),
  minPrice: z
    .string()
    .transform((val) => {
      const parsed = parseFloat(val)
      if (isNaN(parsed)) {
        throw new Error('Invalid minPrice')
      }
      return parsed
    })
    .optional(),
  maxPrice: z
    .string()
    .transform((val) => {
      const parsed = parseFloat(val)
      if (isNaN(parsed)) {
        throw new Error('Invalid maxPrice')
      }
      return parsed
    })
    .optional(),
})
