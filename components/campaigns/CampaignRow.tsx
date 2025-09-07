import { Campaign } from '@/lib/types/api'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { StatusPill } from '@/components/ui/status-pill'
import { ProgressBar } from '@/components/ui/progress-bar'
import { TableCell, TableRow } from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'
import { Eye, Users, Mail, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface CampaignRowProps {
  campaign: Campaign
}

export function CampaignRow({ campaign }: CampaignRowProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/dashboard/campaigns/${campaign.id}`)
  }

  // Calculate progress percentage (using mock data since fields don't exist)
  const totalLeads = campaign.totalLeads || 0
  const sentCount = 0 // This would come from campaign metrics
  const responseCount = 0 // This would come from campaign metrics
  
  const progressPercentage = totalLeads > 0 
    ? Math.round((sentCount / totalLeads) * 100)
    : 0

  // Get campaign initials for avatar
  const initials = campaign.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50/50 transition-colors"
      onClick={handleClick}
    >
      <TableCell className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-blue-100 text-blue-700 font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 truncate">
              {campaign.name}
            </div>
            <div className="text-sm text-gray-500 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Created {formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="p-4">
        <StatusPill 
          status={campaign.status}
          className="inline-flex"
        />
      </TableCell>

      <TableCell className="p-4">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-gray-400" />
          <span className="font-medium">{totalLeads}</span>
          <span className="text-gray-500">leads</span>
        </div>
      </TableCell>

      <TableCell className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <ProgressBar 
            value={progressPercentage}
            max={100}
            className="h-2"
          />
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Mail className="h-3 w-3" />
              {sentCount} sent
            </div>
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {responseCount} responses
            </div>
          </div>
        </div>
      </TableCell>

      <TableCell className="p-4">
        <div className="text-sm text-gray-500">
          {campaign.updatedAt ? (
            <>
              Last updated {formatDistanceToNow(new Date(campaign.updatedAt), { addSuffix: true })}
            </>
          ) : (
            'No recent activity'
          )}
        </div>
      </TableCell>
    </TableRow>
  )
}
