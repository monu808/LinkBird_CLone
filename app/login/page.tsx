'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import { signIn } from '@/lib/auth-client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showEmailForm, setShowEmailForm] = useState(false)
  const router = useRouter()

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!email.trim()) newErrors.email = 'Email is required'
    if (!password.trim()) newErrors.password = 'Password is required'
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsLoading(true)
    setErrors({})

    try {
      const result = await signIn.email({
        email,
        password,
        fetchOptions: {
          onSuccess: () => {
            router.push('/dashboard')
          },
          onError: (ctx) => {
            throw new Error(ctx.error.message || 'Failed to sign in')
          },
        },
      })
    } catch (err: any) {
      setErrors({ general: err.message || 'Invalid email or password' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/dashboard',
      })
    } catch (err: any) {
      setErrors({ general: 'Failed to sign in with Google' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative">
      {/* Dotted background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgb(148,163,184,0.15)_1px,transparent_0)] bg-[size:20px_20px]" />
      
      {/* Auth Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {!showEmailForm ? (
          // Initial auth selection screen
          <>
            <div className="text-center mb-8">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">Continue with an account</h1>
              <p className="text-slate-500 text-sm">You must log in or register to continue.</p>
            </div>

            <div className="space-y-4">
              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-slate-700 font-medium">Continue with Google</span>
              </button>

              {/* Email Login Button */}
              <button
                type="button"
                onClick={() => setShowEmailForm(true)}
                className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                </svg>
                Login with Email
              </button>
            </div>

            {/* Footer */}
            <div className="text-center mt-6">
              <p className="text-sm text-slate-500 mb-2">
                New User?{' '}
                <Link href="/register" className="text-slate-700 hover:text-slate-900 font-medium underline">
                  Create New Account
                </Link>
              </p>
              <p className="text-xs text-slate-400">
                By continuing, you agree to our{' '}
                <span className="text-slate-600 hover:underline cursor-pointer">Privacy Policy</span>
                {' '}and{' '}
                <span className="text-slate-600 hover:underline cursor-pointer">T&Cs</span>
              </p>
            </div>
          </>
        ) : (
          // Email login form
          <>
            {/* Back button */}
            <button
              onClick={() => setShowEmailForm(false)}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-slate-900 mb-2">Login with email</h1>
              <p className="text-slate-500 text-sm">Login using your email address.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* General error message */}
              {errors.general && (
                <div className="text-xs text-red-500 text-center bg-red-50 p-2 rounded-xl">{errors.general}</div>
              )}

              {/* Email field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email or Username
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bhavya@kandid.ai"
                  className="w-full border border-slate-200 rounded-xl py-3 px-3 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.email && (
                  <div className="text-xs text-red-500 mt-1">{errors.email}</div>
                )}
              </div>

              {/* Password field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••"
                    className="w-full border border-slate-200 rounded-xl py-3 px-3 pr-10 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <div className="text-xs text-red-500 mt-1">{errors.password}</div>
                )}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </button>

              {/* Footer links */}
              <div className="flex justify-between items-center mt-4 text-sm">
                <button type="button" className="text-slate-500 hover:text-slate-700">
                  Forgot password
                </button>
                <Link href="/register" className="text-slate-700 hover:text-slate-900 font-medium">
                  Create New Account
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
