'use client'

import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Calendar,
  Clock,
  MapPin,
  ArrowLeft,
  Globe,
  Package,
} from 'lucide-react'
import {
  ClientMarketDay,
  getMarketDayStatusDisplayName,
  getMarketDayStatusVariant,
} from '@/types/marketDay'
import { ClientProduct } from '@/types/product'
import Image from 'next/image'

interface MarketDayDetailClientProps {
  marketDay: ClientMarketDay
  marketDayProducts: ClientProduct[]
}

export default function MarketDayDetailClient({
  marketDay,
  marketDayProducts,
}: MarketDayDetailClientProps) {
  const router = useRouter()

  const handleBackToDashboard = () => {
    router.push('/vendor/dashboard')
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="container mx-auto flex-grow px-4 py-8">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={handleBackToDashboard}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>

          <div className="flex items-center justify-between">
            <div className="text-left">
              <h1 className="mb-2 text-left text-3xl font-bold text-gray-900">
                {marketDay.name}
              </h1>
              <p className="text-left text-gray-600">Market Day Details</p>
            </div>
            <Badge variant={getMarketDayStatusVariant(marketDay.status)}>
              {getMarketDayStatusDisplayName(marketDay.status)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Market Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-left">
                <Calendar className="h-5 w-5" />
                Market Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-1 text-left font-medium text-gray-900">
                  Date
                </h3>
                <p className="text-left text-gray-600">
                  {new Date(marketDay.startTime).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              <div>
                <h3 className="mb-1 flex items-center gap-2 text-left font-medium text-gray-900">
                  <Clock className="h-4 w-4" />
                  Market Hours
                </h3>
                <p className="text-left text-gray-600">
                  {new Date(marketDay.startTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(marketDay.endTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div>
                <h3 className="mb-1 flex items-center gap-2 text-left font-medium text-gray-900">
                  <MapPin className="h-4 w-4" />
                  Location
                </h3>
                <p className="text-left text-gray-600">{marketDay.location}</p>
              </div>

              <div>
                <h3 className="mb-1 text-left font-medium text-gray-900">
                  Description
                </h3>
                <p className="text-left text-gray-600">
                  {marketDay.description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Online Shop Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-left">
                <Globe className="h-5 w-5" />
                Online Shop Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="mb-1 text-left font-medium text-gray-900">
                  Online Shop Hours
                </h3>
                <p className="text-left text-gray-600">
                  {new Date(marketDay.onlineStartTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}{' '}
                  -{' '}
                  {new Date(marketDay.onlineEndTime).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>

              <div>
                <h3 className="mb-1 text-left font-medium text-gray-900">
                  Online Shop Dates
                </h3>
                <div className="text-gray-600">
                  <p className="text-left">
                    Opens:{' '}
                    {new Date(marketDay.onlineStartTime).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </p>
                  <p className="text-left">
                    Closes:{' '}
                    {new Date(marketDay.onlineEndTime).toLocaleDateString(
                      'en-US',
                      {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }
                    )}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="mb-2 text-left font-medium text-gray-900">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() =>
                      router.push(`/vendor/marketDay/${marketDay.id}/products`)
                    }
                  >
                    <Package className="mr-2 h-4 w-4" />
                    Manage Products for this Market
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left"
                    onClick={() => router.push('/vendor/dashboard')}
                  >
                    View Orders
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Market Day Products */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-left">
              <Package className="h-5 w-5" />
              Products for This Market Day
            </CardTitle>
          </CardHeader>
          <CardContent>
            {marketDayProducts.length === 0 ? (
              <div className="py-8 text-center">
                <Package className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <h3 className="mb-2 text-lg font-medium text-gray-900">
                  No products added yet
                </h3>
                <p className="mb-6 text-gray-500">
                  Add products from your profile to this market day.
                </p>
                <Button
                  onClick={() =>
                    router.push(`/vendor/marketDay/${marketDay.id}/products`)
                  }
                >
                  <Package className="mr-2 h-4 w-4" />
                  Add Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-left text-sm text-gray-600">
                    {marketDayProducts.length} product
                    {marketDayProducts.length !== 1 ? 's' : ''} added
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/vendor/marketDay/${marketDay.id}/products`)
                    }
                  >
                    Edit Products
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {marketDayProducts.map((product) => (
                    <div key={product.id} className="rounded-lg border p-4">
                      <div className="mb-3 flex items-center gap-3">
                        <Image
                          src={product.imageUrl}
                          alt={product.name}
                          className="h-12 w-12 rounded object-cover"
                          width={48}
                          height={48}
                        />
                        <div className="flex-1">
                          <h4 className="text-left font-medium">
                            {product.name}
                          </h4>
                          <p className="text-left text-sm text-gray-600">
                            ${product.price.toFixed(2)} per {product.unit.name}
                          </p>
                        </div>
                      </div>
                      <div className="rounded bg-gray-50 p-2">
                        <p className="text-left text-sm text-gray-600">
                          Quantity:{' '}
                          {/* <span className="font-medium">
                            {product.quantity} {product.productUnit}
                          </span> */}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-left">Important Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <h4 className="mb-2 text-left font-medium text-blue-900">
                Vendor Guidelines
              </h4>
              <ul className="space-y-1 text-sm text-blue-800">
                <li className="text-left">
                  • Arrive at least 30 minutes before market opening for setup
                </li>
                <li className="text-left">
                  • Ensure all products are properly labeled with prices
                </li>
                <li className="text-left">
                  • Online orders will be available for pickup during market
                  hours
                </li>
                <li className="text-left">
                  • Contact market organizers if you need to cancel or modify
                  your participation
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
