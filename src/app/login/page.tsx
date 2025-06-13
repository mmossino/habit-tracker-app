'use client'

import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mode, setMode] = useState<'signin' | 'signup' | 'reset'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        })
        if (error) throw error
        setSuccess('Check your email for confirmation link')
      } else if (mode === 'reset') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`
        })
        if (error) throw error
        setSuccess('Reset instructions sent to your email')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          border: '2px solid #e5e5e5',
          borderTop: '2px solid #000',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }

  if (user) return null

  return (
    <div style={{
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#fafafa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '0 20px'
      }}>
        
        {/* App Branding */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            backgroundColor: '#000',
            borderRadius: '16px',
            margin: '0 auto 24px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#fff',
              borderRadius: '50%'
            }} />
          </div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#000',
            margin: '0 0 8px 0',
            letterSpacing: '-0.5px'
          }}>
            Streakly
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#666',
            margin: '0 0 32px 0',
            lineHeight: '1.4'
          }}>
            {mode === 'signin' 
              ? 'Build better habits, one day at a time' 
              : mode === 'signup'
              ? 'Start your journey to better habits'
              : 'Reset your password to continue'
            }
          </p>
        </div>

        {/* Form Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{
            fontSize: '24px',
            fontWeight: '600',
            color: '#000',
            margin: '0 0 8px 0'
          }}>
            {mode === 'signin' ? 'Welcome back' : 
             mode === 'signup' ? 'Create your account' : 
             'Reset password'}
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#666',
            margin: '0'
          }}>
                         {mode === 'signin' 
               ? 'Sign in to continue building streaks' 
               : mode === 'signup'
               ? 'Join thousands building habit streaks'
               : 'Enter your email to reset your password'
             }
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            padding: '16px',
            backgroundColor: '#fee',
            border: '1px solid #fcc',
            borderRadius: '12px',
            color: '#c33',
            fontSize: '14px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            padding: '16px',
            backgroundColor: '#efe',
            border: '1px solid #cfc',
            borderRadius: '12px',
            color: '#363',
            fontSize: '14px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit}>
          
          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '18px 16px',
                border: '1px solid #ddd',
                borderRadius: '12px',
                fontSize: '16px',
                backgroundColor: '#fff',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#000'}
              onBlur={(e) => e.target.style.borderColor = '#ddd'}
            />
          </div>

          {/* Password */}
          {mode !== 'reset' && (
            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
                disabled={isLoading}
                minLength={mode === 'signup' ? 6 : undefined}
                style={{
                  width: '100%',
                  padding: '18px 16px',
                  paddingRight: '50px',
                  border: '1px solid #ddd',
                  borderRadius: '12px',
                  fontSize: '16px',
                  backgroundColor: '#fff',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#000'}
                onBlur={(e) => e.target.style.borderColor = '#ddd'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#666',
                  padding: '4px'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !email || (mode !== 'reset' && !password)}
            style={{
              width: '100%',
              padding: '18px',
              backgroundColor: '#000',
              color: '#fff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: (isLoading || !email || (mode !== 'reset' && !password)) ? 0.6 : 1,
              transition: 'opacity 0.2s, transform 0.1s',
              transform: 'translateY(0px)'
            }}
            onMouseDown={(e) => (e.target as HTMLElement).style.transform = 'translateY(1px)'}
            onMouseUp={(e) => (e.target as HTMLElement).style.transform = 'translateY(0px)'}
            onMouseLeave={(e) => (e.target as HTMLElement).style.transform = 'translateY(0px)'}
          >
            {isLoading ? 'Loading...' : (
              mode === 'signin' ? 'Sign In' : 
              mode === 'signup' ? 'Create Account' : 
              'Send Reset Email'
            )}
          </button>
        </form>

        {/* Footer Links */}
        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          {mode === 'signin' && (
            <div>
              <button
                onClick={() => setMode('reset')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  fontSize: '15px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  marginBottom: '16px'
                }}
              >
                Forgot password?
              </button>
              <div style={{ fontSize: '15px', color: '#666' }}>
                                 Don&apos;t have an account?{' '}
                <button
                  onClick={() => setMode('signup')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#000',
                    fontSize: '15px',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    fontWeight: '600'
                  }}
                >
                  Sign up
                </button>
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div style={{ fontSize: '15px', color: '#666' }}>
              Already have an account?{' '}
              <button
                onClick={() => setMode('signin')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#000',
                  fontSize: '15px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  fontWeight: '600'
                }}
              >
                Sign in
              </button>
            </div>
          )}

          {mode === 'reset' && (
            <button
              onClick={() => setMode('signin')}
              style={{
                background: 'none',
                border: 'none',
                color: '#000',
                fontSize: '15px',
                cursor: 'pointer',
                textDecoration: 'underline',
                fontWeight: '600'
              }}
            >
              Back to Sign In
            </button>
          )}
        </div>

        {/* Marketing Footer */}
        {mode === 'signup' && (
          <div style={{
            textAlign: 'center',
            marginTop: '48px',
            padding: '24px',
            backgroundColor: '#f8f8f8',
            borderRadius: '16px',
            border: '1px solid #eee'
          }}>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: '0 0 8px 0'
            }}>
              Join over 10,000+ users building better habits
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '24px',
              fontSize: '13px',
              color: '#888'
            }}>
              <span>✓ Track daily progress</span>
              <span>✓ Build streaks</span>
              <span>✓ Stay motivated</span>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
} 