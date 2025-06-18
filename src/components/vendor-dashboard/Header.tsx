import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { User } from 'lucide-react'

interface HeaderProps {
  userName?: string
}

export default function Header({ userName }: HeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div className="text-left">
        <h1 className="mb-2 text-left text-3xl font-bold text-gray-900">
          Vendor Dashboard
        </h1>
        <p className="text-left text-gray-600">
          Manage your orders and track your performance
        </p>
        {userName && (
          <p className="mt-1 text-left text-sm text-gray-500">
            Welcome, {userName}
          </p>
        )}
      </div>
      <Link href="/vendor/profile">
        <Button variant="outline" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Manage Shop Profile
        </Button>
      </Link>
    </div>
  )
}
