import Link from 'next/link'
import { AuthForm } from '@/ui/auth/auth-form'

export default function SignUpPage() {
  return (
    <div className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold">Create an account</h2>
          <p className="mt-2 text-gray-600">
            Join our community of farmers and customers
          </p>
        </div>

        <AuthForm type="signup" />

        <p className="text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            href="/auth/login"
            className="font-medium text-green-600 hover:text-green-500"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
