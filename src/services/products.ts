import { api } from './api'
import type { Product } from '../generated/prisma/client'
import {
  CreateProductInput,
  UpdateProductInput,
} from '@/app/api/products/route'

export const productsService = {
  async getAll(): Promise<Product[]> {
    return api.get<Product[]>('/api/products')
  },

  async getById(id: number): Promise<Product> {
    return api.get<Product>(`/api/products/${id}`)
  },

  async create(data: CreateProductInput): Promise<Product> {
    return api.post<Product>('/api/products', data)
  },

  async update(id: number, data: UpdateProductInput): Promise<Product> {
    return api.put<Product>(`/api/products/${id}`, data)
  },

  async delete(id: number): Promise<void> {
    return api.delete(`/api/products/${id}`)
  },

  async getByVendor(vendorId: number): Promise<Product[]> {
    return api.get<Product[]>(`/api/vendors/${vendorId}/products`)
  },

  async getByCategory(category: string): Promise<Product[]> {
    return api.get<Product[]>(`/api/products/category/${category}`)
  },
}
