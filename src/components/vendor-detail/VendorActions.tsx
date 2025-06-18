import React from 'react'
import { Button } from '@/components/ui/button'
import { ShoppingBag, MessageCircle } from 'lucide-react'

export const VendorActions: React.FC = () => (
  <div className="my-6 flex flex-wrap gap-4">
    <Button className="bg-market-green hover:bg-market-green-dark">
      <ShoppingBag className="mr-2 h-4 w-4" />
      Shop Products
    </Button>
    <Button
      variant="outline"
      className="border-market-green text-market-green hover:bg-market-green/10"
    >
      <MessageCircle className="mr-2 h-4 w-4" />
      Contact Vendor
    </Button>
  </div>
)
