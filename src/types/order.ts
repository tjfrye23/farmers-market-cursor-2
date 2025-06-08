// Order type migrated from the other project
export interface Order {
  id: string
  orderNumber: string
  date: string
  customerInfo: {
    firstName: string
    lastName: string
  }
  status: 'processing' | 'processed'
  total: number
  // Add other fields as needed
}
