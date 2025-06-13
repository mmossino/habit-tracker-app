'use client'

import { Home, Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

export default function Navigation() {
  const pathname = usePathname()
  const { user } = useAuth()

  // Don't show navigation on login page or if user is not authenticated
  if (pathname === '/login' || !user) {
    return null
  }

  const navItems = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/create', icon: Plus, label: 'Create' },
    { href: '/settings', icon: Settings, label: 'Settings' },
  ]

  return (
    <nav className="fixed bottom-4 left-4 right-4 z-50">
      <div className="glass-panel rounded-2xl p-3">
        <div className="flex justify-around items-center">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all duration-200 min-w-[3.5rem] min-h-[3rem]",
                  isActive 
                    ? "nav-active" 
                    : "glass-button hover:bg-white/30"
                )}
              >
                <Icon size={18} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 