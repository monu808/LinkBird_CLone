'use client'

import { useMemo } from 'react'
import { useInfiniteLeads } from '@/src/hooks/useLeads'
import { useUIStore } from '@/src/stores/uiStore'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { LeadRow } from './LeadRow'
import { Loader2, Users } from 'lucide-react'
import { cn } from '@/src/utils/format'

interface LeadTableProps {
  searchQuery?: string
  statusFilter?: string
}

export function LeadTable({ searchQuery = '', statusFilter = '' }: LeadTableProps) {
  const { selectedRows, clearSelection } = useUIStore()
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteLeads({
    search: searchQuery,
    status: statusFilter,
  })

  const leads = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.pagination.total ?? 0

  if (isLoading) {
    return (
      <Card className="p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          <span className="ml-3 text-gray-600">Loading leads...</span>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center text-red-600">
          <p>Error loading leads: {error.message}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (leads.length === 0) {
    const hasFilters = searchQuery || statusFilter
    
    return (
      <Card className="p-12">
        <div className="text-center">
          <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {hasFilters ? 'No leads match your filters' : 'No leads yet'}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {hasFilters
              ? 'Try adjusting your search criteria or filters to find leads.'
              : 'Start by importing leads or creating your first campaign to begin building your pipeline.'
            }
          </p>
          {!hasFilters && (
            <Button>
              <Users className="h-4 w-4 mr-2" />
              Import Leads
            </Button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Results summary and bulk actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {leads.length} of {totalCount} leads
        </div>
        
        {selectedRows.size > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {selectedRows.size} selected
            </span>
            <Button variant="outline" size="sm">
              Change Status
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearSelection}
            >
              Clear
            </Button>
          </div>
        )}
      </div>

      {/* Lead table */}
      <Card className="overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-4">Lead</div>
            <div className="col-span-3">Campaign</div>
            <div className="col-span-2">Activity</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1"></div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {leads.map((lead) => (
            <LeadRow key={lead.id} lead={lead} />
          ))}
        </div>
      </Card>

      {/* Load more */}
      {hasNextPage && (
        <div className="text-center py-8">
          <Button
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading more...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {/* End of results */}
      {!hasNextPage && leads.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">You've reached the end of your leads.</p>
        </div>
      )}
    </div>
  )
}
