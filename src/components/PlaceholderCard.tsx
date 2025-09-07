'use client'

import React from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface PlaceholderCardProps {
  title: string
  description?: string
  statusText?: string
  statusColor?: 'green' | 'blue' | 'yellow' | 'red'
  className?: string
}

export function PlaceholderCard({ 
  title, 
  description, 
  statusText, 
  statusColor = 'green',
  className 
}: PlaceholderCardProps) {
  const statusColors = {
    green: 'bg-emerald-100 text-emerald-800',
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800'
  }

  return (
    <Card className={cn("bg-white rounded-xl border border-slate-100 shadow-sm p-6 text-slate-600 relative", className)}>
      {statusText && (
        <Badge className={cn("absolute right-6 top-6 rounded-full px-3 py-1 text-xs", statusColors[statusColor])}>
          {statusText}
        </Badge>
      )}
      <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
      {description && (
        <p className="text-slate-600">{description}</p>
      )}
    </Card>
  )
}
