'use client'

import { useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useInfiniteCampaigns } from '@/src/hooks/useCampaigns'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Mail, 
  Eye, 
  TrendingUp, 
  Loader2, 
  Megaphone,
  MoreHorizontal,
  Play,
  Pause,
  Edit
} from 'lucide-react'
import { cn, getStatusColor, formatRelativeTime, formatNumber } from '@/src/utils/format'

interface CampaignTableProps {
  searchQuery?: string
  statusFilter?: string
}

interface CampaignCardProps {
  campaign: any
}

const CampaignCard = ({ campaign }: CampaignCardProps) => {
  const router = useRouter()
  
  const progressPercentage = campaign.totalLeads > 0 
    ? Math.round((campaign.sentCount / campaign.totalLeads) * 100) 
    : 0

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Campaign card clicked!', campaign.id, campaign.name)
    console.log('Navigating to:', `/dashboard/campaigns/${campaign.id}`)
    router.push(`/dashboard/campaigns/${campaign.id}`)
  }

  return (
    <Card 
      className="p-6 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200"
      onClick={handleCardClick}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate mb-1">
            {campaign.name}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {campaign.description || 'No description provided'}
          </p>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <Badge 
            variant="outline" 
            className={cn('border', getStatusColor(campaign.status))}
          >
            {campaign.status}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={(e) => {
              e.stopPropagation()
              // Add dropdown menu logic here
            }}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Users className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm font-medium text-gray-600">Total Leads</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatNumber(campaign.totalLeads)}</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <Mail className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm font-medium text-gray-600">Sent</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatNumber(campaign.sentCount)}</p>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-center mb-1">
            <TrendingUp className="h-4 w-4 text-gray-400 mr-1" />
            <span className="text-sm font-medium text-gray-600">Response</span>
          </div>
          <p className="text-xl font-bold text-gray-900">{formatNumber(campaign.responseCount)}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Progress</span>
          <span className="text-sm font-medium text-gray-900">{progressPercentage}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              campaign.status === 'active' ? 'bg-green-500' : 
              campaign.status === 'draft' ? 'bg-blue-500' : 'bg-gray-400'
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Request Status Indicators */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center">
            <div className="w-2 h-2 bg-yellow-400 rounded-full mr-1"></div>
            <span className="text-gray-600">{campaign.requestStatus?.pending || 0} Pending</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
            <span className="text-gray-600">{campaign.requestStatus?.connected || 0} Connected</span>
          </div>
          <div className="flex items-center">
            <div className="w-2 h-2 bg-red-400 rounded-full mr-1"></div>
            <span className="text-gray-600">{campaign.requestStatus?.declined || 0} Declined</span>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <div className="flex items-center space-x-3">
          <span>1st: {campaign.connectionStatus?.first_degree || 0}</span>
          <span>2nd: {campaign.connectionStatus?.second_degree || 0}</span>
          <span>3rd: {campaign.connectionStatus?.third_degree || 0}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="text-sm text-gray-500">
          Updated {formatRelativeTime(campaign.updatedAt)}
        </div>
        <div className="flex space-x-2">
          {campaign.status === 'active' ? (
            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
              <Pause className="h-3 w-3 mr-1" />
              Pause
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
              <Play className="h-3 w-3 mr-1" />
              Start
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
            <Edit className="h-3 w-3 mr-1" />
            Edit
          </Button>
        </div>
      </div>
    </Card>
  )
}

export function CampaignTable({ searchQuery = '', statusFilter = '' }: CampaignTableProps) {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useInfiniteCampaigns({
    search: searchQuery,
    status: statusFilter,
  })

  const campaigns = useMemo(() => {
    return data?.pages.flatMap(page => page.data) ?? []
  }, [data])

  const totalCount = data?.pages[0]?.pagination.total ?? 0

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="grid grid-cols-3 gap-4">
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
                <div className="h-16 bg-gray-200 rounded"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Card className="p-8">
        <div className="text-center text-red-600">
          <p>Error loading campaigns: {error.message}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (campaigns.length === 0) {
    const hasFilters = searchQuery || statusFilter
    
    return (
      <Card className="p-12">
        <div className="text-center">
          <Megaphone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
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
              <Megaphone className="h-4 w-4 mr-2" />
              Create Your First Campaign
            </Button>
          )}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results summary */}
      <div className="text-sm text-gray-600">
        Showing {campaigns.length} of {totalCount} campaigns
      </div>

      {/* Campaign grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {campaigns.map((campaign) => (
          <CampaignCard key={campaign.id} campaign={campaign} />
        ))}
      </div>

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
              'Load More Campaigns'
            )}
          </Button>
        </div>
      )}

      {/* End of results */}
      {!hasNextPage && campaigns.length > 0 && (
        <div className="text-center py-8 text-gray-500">
          <p className="text-sm">You've reached the end of your campaigns.</p>
        </div>
      )}
    </div>
  )
}
