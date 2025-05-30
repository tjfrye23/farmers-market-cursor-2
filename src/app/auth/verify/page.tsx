'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { verifyEmail } from './actions'

function VerifyContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [message, setMessage] = useState('Verifying your email...')

  useEffect(() => {
    async function verify() {
      if (!token) {
        setStatus('error')
        setMessage('Invalid verification link.')
        return
      }

      const result = await verifyEmail(token)
      setStatus(result.status as 'success' | 'error')
      setMessage(result.message)

      if (result.status === 'success') {
        setTimeout(() => {
          router.push('/auth/login')
        }, 2000)
      }
    }

    verify()
  }, [token, router])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-sm">
        <h1 className="mb-4 text-2xl font-bold">
          {status === 'success' ? 'Success!' : 'Error'}
        </h1>
        <p className={status === 'error' ? 'text-red-500' : 'text-green-500'}>
          {message}
        </p>
        {status === 'success' && (
          <p className="mt-4 text-sm text-gray-500">
            Redirecting to login page...
          </p>
        )}
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900" />
        </div>
      }
    >
      <VerifyContent />
    </Suspense>
  )
}
