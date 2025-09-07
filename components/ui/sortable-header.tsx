import React from 'react'
import { TableHead } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SortableHeaderProps {
  children: React.ReactNode
  sortKey: string
  currentSort: string
  currentOrder: 'asc' | 'desc'
  onSort: (sortKey: string, order: 'asc' | 'desc') => void
  className?: string
}

export function SortableHeader({
  children,
  sortKey,
  currentSort,
  currentOrder,
  onSort,
  className
}: SortableHeaderProps) {
  const isActive = currentSort === sortKey
  
  const handleSort = React.useCallback(() => {
    if (isActive) {
      // If currently active, toggle the order
      const newOrder = currentOrder === 'asc' ? 'desc' : 'asc'
      onSort(sortKey, newOrder)
    } else {
      // If not active, set as active with desc order (newest first)
      onSort(sortKey, 'desc')
    }
  }, [isActive, currentOrder, onSort, sortKey])

  const getSortIcon = () => {
    if (!isActive) {
      return <ChevronsUpDown className="h-3 w-3 text-gray-400" />
    }
    
    return currentOrder === 'asc' ? (
      <ChevronUp className="h-3 w-3 text-blue-600" />
    ) : (
      <ChevronDown className="h-3 w-3 text-blue-600" />
    )
  }

  return (
    <TableHead className={cn("p-0", className)}>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSort}
        className={cn(
          "h-12 w-full justify-start gap-2 px-4 font-medium",
          isActive && "text-blue-600"
        )}
      >
        {children}
        {getSortIcon()}
      </Button>
    </TableHead>
  )
}
