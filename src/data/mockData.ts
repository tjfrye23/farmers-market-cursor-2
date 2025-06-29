// Mock data for products, vendors, and market days

export const mockProducts = [
  {
    id: '1',
    name: 'Organic Tomatoes',
    price: 3.99,
    unit: 'lb',
    image: '/images/products/tomatoes.webp',
    category: 'Vegetables',
    organic: true,
    local: true,
    user_id: '1',
    description: 'Fresh organic tomatoes, locally grown',
    stock: 20,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Sourdough Bread',
    price: 5.99,
    unit: 'loaf',
    image: '/images/products/sourdough.webp',
    category: 'Bakery',
    organic: false,
    local: true,
    user_id: '2',
    description: 'Freshly baked sourdough bread',
    stock: 10,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  // Add more mock products as needed
]

export const mockVendors = [
  {
    id: '1',
    name: 'Organic Farm',
    businessName: 'Organic Farm Fresh',
    imageUrl: '/images/products/farmer-field.jpeg',
    specialty: 'Vegetables',
    address: '123 Farm Road, Countryside',
  },
  {
    id: '2',
    name: 'Fresh Bakery',
    businessName: 'Fresh Baked Goods',
    imageUrl: '/images/products/farmer-field.jpeg',
    specialty: 'Bakery',
    address: '456 Baker Street, Downtown',
  },
  // Add more mock vendors as needed
]

export const mockMarketDays = [
  {
    id: 'm1',
    date: '2024-07-01',
    name: 'Monday Market',
    location: 'Downtown Square',
  },
  {
    id: 'm2',
    date: '2024-07-08',
    name: 'Monday Market',
    location: 'Downtown Square',
  },
  // Add more mock market days as needed
]
