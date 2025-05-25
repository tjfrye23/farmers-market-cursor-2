'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type AuthContextType = { user: null; loading: boolean }

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser(null)
    setLoading(false)
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
