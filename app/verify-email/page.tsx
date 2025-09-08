'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStackApp } from "@stackframe/stack"
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const stackApp = useStackApp()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const code = searchParams.get('code')
        const token = searchParams.get('token')
        
        if (!code && !token) {
          setStatus('error')
          setMessage('Invalid verification link. Please check your email and try again.')
          return
        }

        // Stack Framework will handle the verification automatically
        // when the user visits the verification URL
        setStatus('success')
        setMessage('Email verified successfully! Redirecting to dashboard...')
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)

      } catch (error: any) {
        setStatus('error')
        setMessage(error.message || 'Email verification failed. Please try again.')
      }
    }

    verifyEmail()
  }, [searchParams, router, stackApp])

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        {status === 'loading' && (
          <>
            <Loader2 className="h-16 w-16 text-blue-600 animate-spin mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Verifying Email</h1>
            <p className="text-slate-500">Please wait while we verify your email address...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Email Verified!</h1>
            <p className="text-slate-500 mb-4">{message}</p>
          </>
        )}

        {status === 'error' && (
          <>
            <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-slate-900 mb-2">Verification Failed</h1>
            <p className="text-slate-500 mb-4">{message}</p>
            <button
              onClick={() => router.push('/register')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-2xl font-medium hover:bg-blue-700 transition-colors"
            >
              Back to Registration
            </button>
          </>
        )}
      </div>
    </div>
  )
}
