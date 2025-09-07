import React, { useEffect, useRef } from 'react'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { SortableHeader } from '@/components/ui/sortable-header'
import { LeadRow } from './LeadRow'
import { LeadSideSheet } from './LeadSideSheet'
import { useInfiniteLeads } from '@/hooks/useInfiniteLeads'
import { useUIStore } from '@/stores/uiStore'
import { Loader2, AlertCircle } from 'lucide-react'

interface LeadsTableProps {
  searchQuery?: string
  selectedStatuses?: string[]
  campaignId?: number
}

const SKELETON_ROWS = 5

function SkeletonRow() {
  return (
    <TableRow>
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-1">
            <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-3 w-24 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </td>
      <td className="p-4">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-6 w-20 bg-gray-200 rounded-full animate-pulse" />
      </td>
      <td className="p-4">
        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
      </td>
    </TableRow>
  )
}

export function LeadsTable({ 
  searchQuery = '', 
  selectedStatuses = [], 
  campaignId 
}: LeadsTableProps) {
  const {
    leadsSortBy,
    leadsSortOrder,
    setLeadsSort,
  } = useUIStore()

  const sentinelRef = useRef<HTMLDivElement>(null)

  // Build query parameters
  const queryParams = {
    search: searchQuery || undefined,
    status: selectedStatuses.length === 1 ? selectedStatuses[0] : undefined,
    campaignId: campaignId || undefined,
    sortBy: leadsSortBy,
    sortOrder: leadsSortOrder,
    limit: 20,
  }

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteLeads(queryParams)

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      }
    )

    const currentSentinel = sentinelRef.current
    if (currentSentinel) {
      observer.observe(currentSentinel)
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel)
      }
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  // Flatten all leads from all pages
  const allLeads = React.useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? []
  }, [data])

  const handleSort = React.useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
    setLeadsSort(sortBy, sortOrder)
  }, [setLeadsSort])

  if (isError) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
          <p className="text-red-600 font-medium">Failed to load leads</p>
          <p className="text-gray-500 text-sm">
            {error instanceof Error ? error.message : 'Something went wrong'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <SortableHeader
                sortKey="firstName"
                currentSort={leadsSortBy}
                currentOrder={leadsSortOrder}
                onSort={handleSort}
              >
                Name / Contact
              </SortableHeader>
              
              <SortableHeader
                sortKey="email"
                currentSort={leadsSortBy}
                currentOrder={leadsSortOrder}
                onSort={handleSort}
              >
                Email
              </SortableHeader>
              
              <SortableHeader
                sortKey="company"
                currentSort={leadsSortBy}
                currentOrder={leadsSortOrder}
                onSort={handleSort}
              >
                Company
              </SortableHeader>
              
              <SortableHeader
                sortKey="status"
                currentSort={leadsSortBy}
                currentOrder={leadsSortOrder}
                onSort={handleSort}
              >
                Status
              </SortableHeader>
              
              <SortableHeader
                sortKey="lastContactDate"
                currentSort={leadsSortBy}
                currentOrder={leadsSortOrder}
                onSort={handleSort}
              >
                Last Contact
              </SortableHeader>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {isLoading && (
              <>
                {Array.from({ length: SKELETON_ROWS }, (_, i) => (
                  <SkeletonRow key={i} />
                ))}
              </>
            )}
            
            {!isLoading && allLeads.length === 0 ? (
              <TableRow>
                <td colSpan={5} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <div className="text-gray-400 mb-2">No leads found</div>
                    <div className="text-sm text-gray-500">
                      {searchQuery || selectedStatuses.length > 0
                        ? "Try adjusting your search or filters"
                        : "Start by adding your first lead"
                      }
                    </div>
                  </div>
                </td>
              </TableRow>
            ) : (
              <>
                {allLeads.map((lead) => (
                  <LeadRow key={lead.id} lead={lead} />
                ))}
                
                {/* Loading indicator for next page */}
                {isFetchingNextPage && (
                  <TableRow>
                    <td colSpan={5} className="h-16">
                      <div className="flex items-center justify-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span className="text-sm text-gray-500">Loading more leads...</span>
                      </div>
                    </td>
                  </TableRow>
                )}
                
                {/* Sentinel for infinite scroll */}
                {hasNextPage && (
                  <TableRow>
                    <td colSpan={5}>
                      <div ref={sentinelRef} className="h-4" />
                    </td>
                  </TableRow>
                )}
                
                {/* End indicator */}
                {!hasNextPage && allLeads.length > 0 && (
                  <TableRow>
                    <td colSpan={5} className="h-8">
                      <div className="text-center text-xs text-gray-400">
                        You've reached the end of your leads list
                      </div>
                    </td>
                  </TableRow>
                )}
              </>
            )}
          </TableBody>
        </Table>
      </div>
      
      <LeadSideSheet />
    </>
  )
}
