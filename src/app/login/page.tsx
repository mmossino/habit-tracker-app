'use client'

import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in')

  useEffect(() => {
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-card max-w-md w-full mx-4 p-8">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-100 rounded mb-6"></div>
            <div className="space-y-3">
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
              <div className="h-12 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (user) {
    return null // Will redirect to home
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="glass-card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {view === 'sign_in' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-600 text-sm">
            {view === 'sign_in' 
              ? 'Sign in to your habit tracker' 
              : 'Start tracking your habits today'
            }
          </p>
        </div>

        {/* Toggle Buttons */}
        <div className="flex mb-6 p-1 glass-panel rounded-lg">
          <button
            onClick={() => setView('sign_in')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              view === 'sign_in'
                ? 'bg-blue-500/20 text-blue-700 border border-blue-500/30'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setView('sign_up')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
              view === 'sign_up'
                ? 'bg-blue-500/20 text-blue-700 border border-blue-500/30'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Sign Up
          </button>
        </div>

        <Auth
          supabaseClient={supabase}
          view={view}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(59 130 246)',
                  brandAccent: 'rgb(37 99 235)',
                  brandButtonText: 'white',
                  defaultButtonBackground: 'rgba(255, 255, 255, 0.4)',
                  defaultButtonBackgroundHover: 'rgba(255, 255, 255, 0.5)',
                  defaultButtonBorder: 'rgba(255, 255, 255, 0.5)',
                  defaultButtonText: 'rgb(55 65 81)',
                  dividerBackground: 'rgba(255, 255, 255, 0.3)',
                  inputBackground: 'rgba(255, 255, 255, 0.4)',
                  inputBorder: 'rgba(255, 255, 255, 0.5)',
                  inputBorderHover: 'rgba(59, 130, 246, 0.6)',
                  inputBorderFocus: 'rgba(59, 130, 246, 0.6)',
                  inputText: 'rgb(55 65 81)',
                  inputLabelText: 'rgb(55 65 81)',
                  inputPlaceholder: 'rgb(107 114 128)',
                },
                space: {
                  spaceSmall: '4px',
                  spaceMedium: '8px',
                  spaceLarge: '16px',
                  labelBottomMargin: '8px',
                  anchorBottomMargin: '4px',
                  emailInputSpacing: '4px',
                  socialAuthSpacing: '4px',
                  buttonPadding: '10px 15px',
                  inputPadding: '10px 15px',
                },
                fontSizes: {
                  baseBodySize: '14px',
                  baseInputSize: '14px',
                  baseLabelSize: '14px',
                  baseButtonSize: '14px',
                },
                fonts: {
                  bodyFontFamily: `'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                  buttonFontFamily: `'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                  inputFontFamily: `'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                  labelFontFamily: `'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif`,
                },
                borderWidths: {
                  buttonBorderWidth: '1px',
                  inputBorderWidth: '1px',
                },
                radii: {
                  borderRadiusButton: '8px',
                  buttonBorderRadius: '8px',
                  inputBorderRadius: '8px',
                },
              },
            },
            style: {
              button: {
                backdropFilter: 'blur(16px)',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
              },
              input: {
                backdropFilter: 'blur(16px)',
                transition: 'all 0.2s ease',
              },
              container: {
                backdropFilter: 'blur(20px)',
              },
            },
          }}
          providers={[]} // Remove all social providers
          redirectTo={`${window.location.origin}/`}
          onlyThirdPartyProviders={false}
          magicLink={false} // Disable magic link
          showLinks={false} // Hide default links since we have our own toggle
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email address',
                password_label: 'Password',
                button_label: 'Sign In',
                loading_button_label: 'Signing in...',
              },
              sign_up: {
                email_label: 'Email address',
                password_label: 'Create a password',
                button_label: 'Create Account',
                loading_button_label: 'Creating account...',
                confirmation_text: 'Check your email for the confirmation link',
              },
              forgotten_password: {
                email_label: 'Email address',
                button_label: 'Send reset instructions',
                loading_button_label: 'Sending reset instructions...',
                confirmation_text: 'Check your email for the password reset link',
              },
            },
          }}
        />

        {/* Forgot Password Link */}
        {view === 'sign_in' && (
          <div className="mt-4 text-center">
            <button
              onClick={() => setView('forgotten_password' as any)}
              className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
} 