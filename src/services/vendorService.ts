import { ClientVendor } from '@/types/vendors'
import { api } from './api'
import { UpdateVendorProfileInput } from '@/app/api/vendors/route'

export interface VendorService {
  getVendorProfile: (vendorId: number) => Promise<ClientVendor>
  updateVendorProfile: (
    vendorId: number,
    data: UpdateVendorProfileInput
  ) => Promise<ClientVendor>
}

export const vendorService: VendorService = {
  async getVendorProfile(vendorId: number): Promise<ClientVendor> {
    return api.get<ClientVendor>(`/api/vendors/${vendorId}`)
  },

  async updateVendorProfile(
    vendorId: number,
    data: UpdateVendorProfileInput
  ): Promise<ClientVendor> {
    return api.put<ClientVendor>(`/api/vendors/${vendorId}`, data)
  },
}
