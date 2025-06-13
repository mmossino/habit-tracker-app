'use client'

import { useAuth } from '@/contexts/AuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // If user is not authenticated and not on login page, redirect to login
      if (!user && pathname !== '/login') {
        router.push('/login')
      }
      // If user is authenticated and on login page, redirect to home
      else if (user && pathname === '/login') {
        router.push('/')
      }
    }
  }, [user, loading, pathname, router])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card max-w-sm w-full mx-4 p-8">
          <div className="animate-pulse text-center">
            <div className="w-16 h-16 bg-gray-200/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            </div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  // If not authenticated and not on login page, don't render children
  if (!user && pathname !== '/login') {
    return null
  }

  // If authenticated and on login page, don't render children (will redirect)
  if (user && pathname === '/login') {
    return null
  }

  return <>{children}</>
} 