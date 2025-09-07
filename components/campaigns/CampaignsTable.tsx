import { useInfiniteCampaignsData } from '@/hooks/useInfiniteCampaigns'
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { CampaignRow } from './CampaignRow'
import { SortableHeader } from '@/components/ui/sortable-header'
import { useUIStore } from '@/stores/uiStore'
import { useEffect, useRef, useState } from 'react'
import { Loader2, Megaphone } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CampaignsTableProps {
  searchQuery: string
  selectedStatuses: string[]
}

export function CampaignsTable({ searchQuery, selectedStatuses }: CampaignsTableProps) {
  const { campaignsSortBy, campaignsSortOrder, setCampaignsSort } = useUIStore()
  const [hasScrolled, setHasScrolled] = useState(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  const {
    campaigns,
    totalCount,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    error,
  } = useInfiniteCampaignsData({
    searchQuery: searchQuery || undefined,
    selectedStatuses: selectedStatuses.length > 0 ? selectedStatuses : undefined,
    sortBy: campaignsSortBy,
    sortOrder: campaignsSortOrder,
  })

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && hasScrolled) {
          fetchNextPage()
        }
      },
      {
        rootMargin: '100px',
        threshold: 0.1,
      }
    )

    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, hasScrolled])

  // Track user scroll to prevent auto-loading on initial render
  useEffect(() => {
    const handleScroll = () => {
      if (!hasScrolled) {
        setHasScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { once: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [hasScrolled])

  const handleSort = (sortKey: string, order: 'asc' | 'desc') => {
    setCampaignsSort(sortKey, order)
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-red-600">
          <p>Error loading campaigns: {error.message}</p>
          <Button variant="outline" className="mt-2" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card>
        <div className="p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading campaigns...</p>
        </div>
      </Card>
    )
  }

  if (campaigns.length === 0) {
    const hasFilters = searchQuery || selectedStatuses.length > 0
    
    return (
      <Card className="p-12 text-center">
        <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {hasFilters ? 'No campaigns match your filters' : 'No campaigns yet'}
        </h3>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          {hasFilters
            ? 'Try adjusting your search criteria or filters to find campaigns.'
            : 'Create your first campaign to start reaching out to leads and growing your business.'
          }
        </p>
        {!hasFilters && (
          <Button>
            <Megaphone className="w-4 h-4 mr-2" />
            Create Your First Campaign
          </Button>
        )}
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {campaigns.length} of {totalCount} campaigns
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">
                <SortableHeader
                  sortKey="name"
                  currentSort={campaignsSortBy}
                  currentOrder={campaignsSortOrder}
                  onSort={handleSort}
                >
                  Campaign
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[120px]">
                <SortableHeader
                  sortKey="status"
                  currentSort={campaignsSortBy}
                  currentOrder={campaignsSortOrder}
                  onSort={handleSort}
                >
                  Status
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[120px]">
                <SortableHeader
                  sortKey="totalLeads"
                  currentSort={campaignsSortBy}
                  currentOrder={campaignsSortOrder}
                  onSort={handleSort}
                >
                  Leads
                </SortableHeader>
              </TableHead>
              <TableHead className="w-[200px]">Progress</TableHead>
              <TableHead className="w-[150px]">
                <SortableHeader
                  sortKey="updatedAt"
                  currentSort={campaignsSortBy}
                  currentOrder={campaignsSortOrder}
                  onSort={handleSort}
                >
                  Last Activity
                </SortableHeader>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.map((campaign) => (
              <CampaignRow key={campaign.id} campaign={campaign} />
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <div className="text-center py-8">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          <p className="text-sm text-gray-600">Loading more campaigns...</p>
        </div>
      )}

      {/* End of Results */}
      {!hasNextPage && campaigns.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">You've reached the end of your campaigns.</p>
        </div>
      )}

      {/* Intersection Observer Sentinel */}
      <div ref={sentinelRef} className="h-4" />
    </div>
  )
}
