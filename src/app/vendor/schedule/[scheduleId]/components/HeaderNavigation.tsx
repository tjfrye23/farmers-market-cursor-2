'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { ClientMarketSchedule } from '@/types/marketSchedule'

interface HeaderNavigationProps {
  schedule: ClientMarketSchedule
}

export function HeaderNavigation({ schedule }: HeaderNavigationProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4 text-left">
      <Button
        variant="outline"
        onClick={() => router.push('/vendor/dashboard')}
        className="self-start"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Dashboard
      </Button>
      <div className="text-left">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {schedule.name}
        </h1>
      </div>
    </div>
  )
}
