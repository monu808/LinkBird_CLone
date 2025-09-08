'use client'

import { useUser, useStackApp } from "@stackframe/stack"
import { useState } from 'react'

export default function DebugUserPage() {
  const user = useUser()
  const stackApp = useStackApp()
  const [result, setResult] = useState<any>(null)

  const resetPassword = async () => {
    try {
      if (!user?.primaryEmail) return
      
      const result = await stackApp.sendForgotPasswordEmail({
        email: user.primaryEmail,
        redirectUrl: `${window.location.origin}/reset-password`
      })
      setResult(result)
    } catch (error) {
      setResult({ error: error })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-xl font-bold mb-4">User Debug - Not Logged In</h1>
          <p>Please log in to see user debug info.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">User Debug Information</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Current User Object</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(user, null, 2)}
          </pre>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Password Status</h2>
          <div className="space-y-2">
            <p><strong>Has Password:</strong> {user.hasPassword ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Email Verified:</strong> {user.primaryEmailVerified ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Auth with Email:</strong> {user.authWithEmail ? '✅ Enabled' : '❌ Disabled'}</p>
          </div>
        </div>

        {!user.hasPassword && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4 text-red-800">🚨 Password Issue Detected</h2>
            <p className="text-red-700 mb-4">
              This user doesn't have a password set. This can happen when:
            </p>
            <ul className="list-disc list-inside text-red-700 mb-4 space-y-1">
              <li>Email verification was required but not completed</li>
              <li>User was created via OAuth only</li>
              <li>Registration process was interrupted</li>
            </ul>
            <button
              onClick={resetPassword}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Send Password Reset Email
            </button>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Action Result</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
