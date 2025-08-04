'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { MarketSchedule, MarketScheduleStatus } from '@/types/marketSchedule'
import { Session } from 'next-auth'
import { toast } from 'sonner'
import { marketScheduleService } from '@/services/marketScheduleService'
import { ScheduleHeader, StatusWarning, ScheduleOverview } from './components'

interface MarketScheduleDetailClientProps {
  schedule: MarketSchedule
  user: Session['user']
  isSubscribed: boolean
}

export default function MarketScheduleDetailClient({
  user,
  schedule,
  isSubscribed: initialIsSubscribed,
}: MarketScheduleDetailClientProps) {
  const router = useRouter()
  const [isEditing, setIsEditing] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed)
  const [isLoading, setIsLoading] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentStatus, setCurrentStatus] = useState<MarketScheduleStatus>(
    schedule.status
  )

  const handleSubscribe = async () => {
    setIsLoading(true)
    try {
      await marketScheduleService.subscribeToSchedule(schedule.id)
      setIsSubscribed(true)
      toast.success('Successfully subscribed to market schedule')
    } catch (error) {
      console.error('Error subscribing:', error)
      toast.error('Failed to subscribe to market schedule')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUnsubscribe = async () => {
    setIsLoading(true)
    try {
      await marketScheduleService.unsubscribeFromSchedule(schedule.id)
      setIsSubscribed(false)
      toast.success('Successfully unsubscribed from market schedule')
    } catch (error) {
      console.error('Error unsubscribing:', error)
      toast.error('Failed to unsubscribe from market schedule')
    } finally {
      setIsLoading(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
  }

  const handleSave = async () => {
    // TODO: Implement save logic for editing schedule
    // This would require a form with the schedule data and state management
    // Example implementation:
    // try {
    //   const updateData = {
    //     name: formData.name,
    //     description: formData.description,
    //     location: formData.location,
    //     startTime: formData.startTime,
    //     endTime: formData.endTime,
    //     onlineStartTime: formData.onlineStartTime,
    //     onlineEndTime: formData.onlineEndTime,
    //     status: formData.status,
    //     reoccurring: formData.reoccurring,
    //   }
    //   await marketScheduleService.updateSchedule(schedule.id, updateData)
    //   toast.success('Schedule updated successfully')
    //   setIsEditing(false)
    // } catch (error) {
    //   console.error('Error updating schedule:', error)
    //   toast.error('Failed to update schedule')
    // }
    setIsEditing(false)
  }

  // const handleStatusChange = async (newStatus: MarketScheduleStatus) => {
  //   try {
  //     await marketScheduleService.updateScheduleStatus(schedule.id, newStatus)
  //     setCurrentStatus(newStatus)
  //     toast.success('Schedule status updated successfully')
  //   } catch (error) {
  //     console.error('Error updating schedule status:', error)
  //     toast.error('Failed to update schedule status')
  //   }
  // }

  const handleDelete = async () => {
    try {
      await marketScheduleService.deleteSchedule(schedule.id)
      toast.success('Market schedule deleted successfully')
      router.push('/vendor/dashboard')
    } catch (error) {
      console.error('Error deleting schedule:', error)
      toast.error('Failed to delete market schedule')
    }
  }

  return (
    <main className="container mx-auto grow px-4 py-8">
      <ScheduleHeader
        schedule={schedule}
        user={user}
        isSubscribed={isSubscribed}
        isLoading={isLoading}
        isEditing={isEditing}
        currentStatus={currentStatus}
        onSubscribe={handleSubscribe}
        onUnsubscribe={handleUnsubscribe}
        onEdit={handleEdit}
        onCancelEdit={handleCancelEdit}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <StatusWarning currentStatus={currentStatus} />

      <div className="grid gap-6">
        <ScheduleOverview schedule={schedule} isEditing={isEditing} />
      </div>
    </main>
  )
}
