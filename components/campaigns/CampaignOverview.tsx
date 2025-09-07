import { Card } from '@/components/ui/card'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar,
  TrendingUp,
  Users,
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface CampaignOverviewProps {
  campaign: any
}

export function CampaignOverview({ campaign }: CampaignOverviewProps) {
  const progressPercentage = campaign.totalLeads > 0 
    ? Math.round((campaign.sentCount / campaign.totalLeads) * 100) 
    : 0

  const acceptanceRate = campaign.sentCount > 0 
    ? Math.round((campaign.acceptedCount / campaign.sentCount) * 100) 
    : 0

  const replyRate = campaign.acceptedCount > 0 
    ? Math.round((campaign.responseCount / campaign.acceptedCount) * 100) 
    : 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Campaign Progress */}
      <div className="lg:col-span-2 space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Progress</h3>
          
          <div className="space-y-6">
            {/* Leads Contacted Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Leads Contacted</span>
                <span className="text-sm text-gray-500">
                  {campaign.sentCount || 0} / {campaign.totalLeads || 0}
                </span>
              </div>
              <ProgressBar 
                value={campaign.sentCount || 0}
                max={campaign.totalLeads || 1} 
                className="h-2"
                showPercentage={false}
              />
              <div className="text-right mt-1">
                <span className="text-sm font-medium text-gray-900">{progressPercentage}%</span>
              </div>
            </div>

            {/* Acceptance Rate Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Acceptance Rate</span>
                <span className="text-sm text-gray-500">
                  {campaign.acceptedCount || 0} / {campaign.sentCount || 0}
                </span>
              </div>
              <ProgressBar 
                value={campaign.acceptedCount || 0}
                max={campaign.sentCount || 1} 
                className="h-2"
                showPercentage={false}
              />
              <div className="text-right mt-1">
                <span className="text-sm font-medium text-gray-900">{acceptanceRate}%</span>
              </div>
            </div>

            {/* Reply Rate Progress */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Reply Rate</span>
                <span className="text-sm text-gray-500">
                  {campaign.responseCount || 0} / {campaign.acceptedCount || 0}
                </span>
              </div>
              <ProgressBar 
                value={campaign.responseCount || 0}
                max={campaign.acceptedCount || 1} 
                className="h-2"
                showPercentage={false}
              />
              <div className="text-right mt-1">
                <span className="text-sm font-medium text-gray-900">{replyRate}%</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Connection Degree Analysis */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Connection Analysis</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {campaign.connectionStatus?.first_degree || 0}
              </div>
              <div className="text-sm text-gray-600">1st Connections</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {campaign.connectionStatus?.second_degree || 0}
              </div>
              <div className="text-sm text-gray-600">2nd Connections</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {campaign.connectionStatus?.third_degree || 0}
              </div>
              <div className="text-sm text-gray-600">3rd+ Connections</div>
            </div>
          </div>
        </Card>

        {/* Request Status Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Request Status</h3>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
              <Clock className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {campaign.requestStatus?.pending || 0}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {campaign.requestStatus?.connected || 0}
                </div>
                <div className="text-sm text-gray-600">Connected</div>
              </div>
            </div>
            
            <div className="flex items-center p-4 bg-red-50 rounded-lg">
              <XCircle className="h-8 w-8 text-red-500 mr-3" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {campaign.requestStatus?.declined || 0}
                </div>
                <div className="text-sm text-gray-600">Declined</div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Right Column - Campaign Details */}
      <div className="space-y-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Campaign Details</h3>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">Start Date</div>
                <div className="text-sm text-gray-600">
                  {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : '02/09/2025'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">Status</div>
                <div className="text-sm text-gray-600 capitalize">{campaign.status}</div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-400 mr-3" />
              <div>
                <div className="text-sm font-medium text-gray-900">Conversion Rate</div>
                <div className="text-sm text-gray-600">
                  {campaign.totalLeads > 0 ? 
                    Math.round((campaign.responseCount / campaign.totalLeads) * 100) : 0}%
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Performance Metrics */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Leads</span>
              <span className="text-sm font-medium text-gray-900">{campaign.totalLeads || 20}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Messages Sent</span>
              <span className="text-sm font-medium text-gray-900">{campaign.sentCount || 0}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Connections Made</span>
              <span className="text-sm font-medium text-gray-900">{campaign.acceptedCount || 0}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Replies Received</span>
              <span className="text-sm font-medium text-gray-900">{campaign.responseCount || 0}</span>
            </div>
            
            <hr className="my-4" />
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-900">Success Rate</span>
              <span className="text-sm font-bold text-green-600">
                {campaign.totalLeads > 0 ? 
                  Math.round((campaign.responseCount / campaign.totalLeads) * 100) : 0}%
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
