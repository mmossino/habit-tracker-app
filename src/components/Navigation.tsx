'use client'

import { Home, Plus, Settings } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

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
    <nav 
      style={{
        position: 'fixed',
        bottom: '0',
        left: '0',
        right: '0',
        zIndex: 9999,
        padding: '0 16px 16px 16px'
      }}
    >
      <div 
        style={{
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '12px',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || (item.href === '/' && pathname.startsWith('/habit/'))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  padding: '8px 16px',
                  borderRadius: '12px',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none',
                  color: isActive ? '#1f2937' : '#6b7280',
                  background: isActive ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
                  minHeight: '48px',
                  flex: '1'
                }}
              >
                <Icon size={18} />
                <span style={{ fontSize: '12px', fontWeight: '500' }}>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
} 