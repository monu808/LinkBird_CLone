import React from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FilterChip {
  id: string
  label: string
  value: string
  removable?: boolean
}

interface FilterChipsProps {
  filters: FilterChip[]
  onRemoveFilter: (filterId: string) => void
  className?: string
}

export function FilterChips({ filters, onRemoveFilter, className }: FilterChipsProps) {
  if (filters.length === 0) return null

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {filters.map((filter) => (
        <Badge
          key={filter.id}
          variant="secondary"
          className="flex items-center gap-1 px-3 py-1 text-xs"
        >
          <span>{filter.label}: {filter.value}</span>
          {filter.removable !== false && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFilter(filter.id)}
              className="h-auto p-0 hover:bg-transparent ml-1"
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove {filter.label} filter</span>
            </Button>
          )}
        </Badge>
      ))}
    </div>
  )
}

interface StatusFilterChipsProps {
  selectedStatuses: string[]
  onStatusToggle: (status: string) => void
  className?: string
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'contacted', label: 'Contacted', color: 'bg-blue-100 text-blue-800' },
  { value: 'responded', label: 'Responded', color: 'bg-green-100 text-green-800' },
  { value: 'converted', label: 'Converted', color: 'bg-emerald-100 text-emerald-800' },
  { value: 'rejected', label: 'Rejected', color: 'bg-red-100 text-red-800' },
]

export function StatusFilterChips({ 
  selectedStatuses, 
  onStatusToggle, 
  className 
}: StatusFilterChipsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {statusOptions.map((status) => {
        const isSelected = selectedStatuses.includes(status.value)
        
        return (
          <Button
            key={status.value}
            variant={isSelected ? "default" : "outline"}
            size="sm"
            onClick={() => onStatusToggle(status.value)}
            className={cn(
              "h-8 text-xs",
              isSelected && "bg-blue-600 hover:bg-blue-700 text-white"
            )}
          >
            {status.label}
            {isSelected && selectedStatuses.length > 1 && (
              <X className="h-3 w-3 ml-1" />
            )}
          </Button>
        )
      })}
    </div>
  )
}
