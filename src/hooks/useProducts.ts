import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  productsService,
  type CreateProductInput,
  type UpdateProductInput,
} from '../services/products'

export const useProducts = () => {
  return useQuery({
    queryKey: ['products'],
    queryFn: productsService.getAll,
  })
}

export const useProduct = (id: number) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsService.getById(id),
    enabled: !!id,
  })
}

export const useVendorProducts = (vendorId: number) => {
  return useQuery({
    queryKey: ['products', 'vendor', vendorId],
    queryFn: () => productsService.getByVendor(vendorId),
    enabled: !!vendorId,
  })
}

export const useCategoryProducts = (category: string) => {
  return useQuery({
    queryKey: ['products', 'category', category],
    queryFn: () => productsService.getByCategory(category),
    enabled: !!category,
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProductInput) => productsService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductInput }) =>
      productsService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['products', id] })
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => productsService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })
}
