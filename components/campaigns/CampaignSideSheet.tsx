import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ProgressBar } from '@/components/ui/progress-bar'
import { useUIStore } from '@/stores/uiStore'
import { apiClient } from '@/lib/api-client'
import { formatDistanceToNow } from 'date-fns'
import { 
  Calendar, 
  Users, 
  Mail, 
  Eye, 
  Play, 
  Pause, 
  Edit, 
  MoreVertical,
  Target,
  TrendingUp,
  Clock
} from 'lucide-react'
import { useState } from 'react'

export function CampaignSideSheet() {
  const { 
    selectedCampaignId, 
    isCampaignSheetOpen, 
    closeCampaignSheet 
  } = useUIStore()
  
  const [isUpdating, setIsUpdating] = useState(false)
  const queryClient = useQueryClient()

  // Fetch campaign details
  const { data: campaign, isLoading } = useQuery({
    queryKey: ['campaign', selectedCampaignId],
    queryFn: () => selectedCampaignId ? apiClient.campaigns.getById(selectedCampaignId) : null,
    enabled: !!selectedCampaignId,
  })

  // Status update mutation with optimistic updates
  const statusMutation = useMutation({
    mutationFn: async (newStatus: string) => {
      if (!selectedCampaignId) throw new Error('No campaign selected')
      return apiClient.campaigns.update(selectedCampaignId, { status: newStatus })
    },
    onMutate: async (newStatus) => {
      setIsUpdating(true)
      await queryClient.cancelQueries({ queryKey: ['campaign', selectedCampaignId] })
      
      const previousCampaign = queryClient.getQueryData(['campaign', selectedCampaignId])
      
      queryClient.setQueryData(['campaign', selectedCampaignId], (old: any) => {
        if (!old) return old
        return { ...old, status: newStatus }
      })
      
      return { previousCampaign }
    },
    onError: (err, newStatus, context) => {
      if (context?.previousCampaign) {
        queryClient.setQueryData(['campaign', selectedCampaignId], context.previousCampaign)
      }
    },
    onSettled: () => {
      setIsUpdating(false)
      queryClient.invalidateQueries({ queryKey: ['campaigns-infinite'] })
      queryClient.invalidateQueries({ queryKey: ['campaign', selectedCampaignId] })
    },
  })

  const handleStatusUpdate = (newStatus: string) => {
    statusMutation.mutate(newStatus)
  }

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      closeCampaignSheet()
    }
  }

  if (!campaign && !isLoading) {
    return null
  }

  // Mock metrics since they don't exist in the Campaign type
  const totalLeads = campaign?.totalLeads || 0
  const sentCount = 0
  const responseCount = 0
  const openRate = 0
  const clickRate = 0

  const progressPercentage = totalLeads > 0 ? Math.round((sentCount / totalLeads) * 100) : 0

  // Get campaign initials for avatar
  const initials = campaign?.name
    ?.split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || '??'

  return (
    <Sheet open={isCampaignSheetOpen} onOpenChange={closeCampaignSheet}>
      <SheetContent className="w-[500px] sm:w-[600px] overflow-y-auto" onKeyDown={handleKeyDown}>
        <SheetHeader className="pb-6">
          <SheetTitle>Campaign Details</SheetTitle>
          <SheetDescription>
            Manage and monitor your campaign performance
          </SheetDescription>
        </SheetHeader>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-16 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-32 bg-gray-100 rounded-lg animate-pulse" />
            <div className="h-24 bg-gray-100 rounded-lg animate-pulse" />
          </div>
        ) : campaign ? (
          <div className="space-y-6">
            {/* Campaign Header */}
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-blue-100 text-blue-700 font-medium text-lg">
                  {initials}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  {campaign.name}
                </h3>
                <div className="flex items-center gap-2 mb-2">
                  <Badge 
                    variant={
                      campaign.status === 'active' ? 'default' :
                      campaign.status === 'inactive' ? 'secondary' : 'outline'
                    }
                    className={isUpdating ? 'opacity-50' : ''}
                  >
                    {campaign.status}
                  </Badge>
                  {campaign.status === 'active' && (
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      <Play className="w-3 h-3 mr-1" />
                      Running
                    </Badge>
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  Created {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              {campaign.status === 'active' ? (
                <Button 
                  variant="outline" 
                  onClick={() => handleStatusUpdate('inactive')}
                  disabled={isUpdating}
                >
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Campaign
                </Button>
              ) : (
                <Button 
                  onClick={() => handleStatusUpdate('active')}
                  disabled={isUpdating}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Start Campaign
                </Button>
              )}
              <Button variant="outline">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </div>

            {/* Campaign Metrics */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Users className="w-4 h-4" />
                  Total Leads
                </div>
                <div className="text-2xl font-bold text-gray-900">{totalLeads}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Mail className="w-4 h-4" />
                  Emails Sent
                </div>
                <div className="text-2xl font-bold text-gray-900">{sentCount}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Eye className="w-4 h-4" />
                  Responses
                </div>
                <div className="text-2xl font-bold text-gray-900">{responseCount}</div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  Response Rate
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {totalLeads > 0 ? Math.round((responseCount / totalLeads) * 100) : 0}%
                </div>
              </div>
            </div>

            {/* Progress */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium text-gray-900">Campaign Progress</h4>
                <span className="text-sm font-medium text-gray-600">
                  {progressPercentage}% complete
                </span>
              </div>
              <ProgressBar value={progressPercentage} max={100} className="mb-3" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{sentCount} of {totalLeads} emails sent</span>
                <span>{totalLeads - sentCount} remaining</span>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Performance</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Open Rate</span>
                  <span className="font-medium">{openRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Click Rate</span>
                  <span className="font-medium">{clickRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Rate</span>
                  <span className="font-medium">
                    {totalLeads > 0 ? Math.round((responseCount / totalLeads) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign Details */}
            <div className="p-4 border rounded-lg">
              <h4 className="font-medium text-gray-900 mb-3">Details</h4>
              <div className="space-y-3">
                {campaign.description && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">Description</label>
                    <p className="mt-1 text-sm text-gray-900">{campaign.description}</p>
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Created</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(campaign.createdAt).toLocaleDateString()} at{' '}
                    {new Date(campaign.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700">Last Updated</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {formatDistanceToNow(new Date(campaign.updatedAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button className="flex-1">
                <Target className="w-4 h-4 mr-2" />
                View Leads
              </Button>
              <Button variant="outline" className="flex-1">
                <Clock className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Campaign not found
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
