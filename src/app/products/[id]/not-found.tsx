import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/PageHeader'

export default function ProductNotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <PageHeader title="Product Not Found" />
        <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
          <h2 className="mb-4 text-2xl font-bold">Product Not Found</h2>
          <p className="mb-8 text-gray-600">
            The product you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link href="/shop">
            <Button className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Shop
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
