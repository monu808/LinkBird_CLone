'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface TabItem {
  id: string
  label: string
  icon?: React.ReactNode
}

interface SegmentTabsProps {
  tabs: TabItem[]
  value: string
  onValueChange: (value: string) => void
  className?: string
}

export function SegmentTabs({ tabs, value, onValueChange, className }: SegmentTabsProps) {
  return (
    <div className={cn("bg-slate-50 rounded-md p-1 flex gap-2", className)} role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onValueChange(tab.id)}
          className={cn(
            "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2",
            value === tab.id
              ? "bg-white shadow-sm text-gray-900"
              : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
          )}
        >
          {tab.icon}
          <span>{tab.label}</span>
        </button>
      ))}
    </div>
  )
}
