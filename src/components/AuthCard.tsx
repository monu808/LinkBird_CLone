import React from 'react'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

interface AuthCardProps {
  title: string
  subtitle: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-8 overflow-hidden">
        {/* Dotted pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `radial-gradient(circle, #64748b 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Back link */}
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Title and subtitle */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
          <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="mt-6 text-center">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
