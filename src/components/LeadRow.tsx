'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { type Lead } from '@/src/hooks/useLeads'
import { useUIStore } from '@/src/stores/uiStore'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  MoreHorizontal, 
  Mail, 
  ExternalLink,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react'
import { cn, getStatusColor, getStatusText, formatRelativeTime, getInitials, getAvatarColor } from '@/src/utils/format'

interface LeadRowProps {
  lead: Lead
}

// Activity visualization component
const ActivityBars = ({ activities }: { activities: Lead['activities'] }) => {
  // Generate activity data for the last 30 days
  const activityData = Array.from({ length: 12 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - i * 2)
    const dayActivities = activities.filter(activity => {
      const activityDate = new Date(activity.date)
      return activityDate.toDateString() === date.toDateString()
    })
    return dayActivities.length
  }).reverse()

  const maxActivity = Math.max(...activityData, 1)

  return (
    <div className="flex items-end space-x-1 h-8">
      {activityData.map((count, index) => (
        <div
          key={index}
          className={cn(
            'w-2 rounded-sm transition-all duration-200',
            count === 0 ? 'bg-gray-100' : 'bg-blue-400',
            count > 0 && 'hover:bg-blue-500'
          )}
          style={{
            height: `${Math.max((count / maxActivity) * 100, 4)}%`,
            minHeight: '2px'
          }}
          title={`${count} activities`}
        />
      ))}
    </div>
  )
}

// Status icon component
const StatusIcon = ({ status }: { status: Lead['status'] }) => {
  switch (status) {
    case 'connected':
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case 'replied':
      return <Mail className="h-4 w-4 text-emerald-600" />
    case 'sent':
      return <Clock className="h-4 w-4 text-amber-600" />
    case 'pending_approval':
      return <AlertCircle className="h-4 w-4 text-purple-600" />
    case 'not_interested':
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-400" />
  }
}

export function LeadRow({ lead }: LeadRowProps) {
  const { selectedRows, selectRow, deselectRow, openLeadSheet } = useUIStore()
  const [isHovered, setIsHovered] = useState(false)
  
  const isSelected = selectedRows.has(lead.id)
  const initials = getInitials(lead.firstName, lead.lastName)
  const avatarColor = getAvatarColor(lead.firstName + lead.lastName)

  const handleRowClick = (e: React.MouseEvent) => {
    // Don't trigger row click if clicking on checkbox or action buttons
    if ((e.target as HTMLElement).closest('input, button')) {
      return
    }
    openLeadSheet(lead.id)
  }

  const handleCheckboxChange = (checked: boolean) => {
    if (checked) {
      selectRow(lead.id)
    } else {
      deselectRow(lead.id)
    }
  }

  return (
    <motion.div
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        'grid grid-cols-12 gap-4 p-6 cursor-pointer transition-colors duration-150',
        'hover:bg-gray-50',
        isSelected && 'bg-blue-50 hover:bg-blue-100'
      )}
      onClick={handleRowClick}
    >
      {/* Lead info - 4 columns */}
      <div className="col-span-4 flex items-center space-x-3">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => handleCheckboxChange(e.target.checked)}
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        
        <div className={cn(
          'h-10 w-10 rounded-full flex items-center justify-center text-white font-medium text-sm',
          avatarColor
        )}>
          {initials}
        </div>
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium text-gray-900 truncate">
              {lead.firstName} {lead.lastName}
            </p>
            {lead.linkedin && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(lead.linkedin, '_blank')
                }}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{lead.title}</p>
          <p className="text-xs text-gray-400 truncate">{lead.company}</p>
        </div>
      </div>

      {/* Campaign - 3 columns */}
      <div className="col-span-3 flex items-center">
        <div>
          <p className="text-sm font-medium text-gray-900 truncate">
            {lead.campaignName}
          </p>
          <p className="text-xs text-gray-500">
            Last contact: {formatRelativeTime(lead.lastContacted)}
          </p>
        </div>
      </div>

      {/* Activity - 2 columns */}
      <div className="col-span-2 flex items-center justify-center">
        <ActivityBars activities={lead.activities} />
      </div>

      {/* Status - 2 columns */}
      <div className="col-span-2 flex items-center">
        <Badge 
          variant="outline" 
          className={cn(
            'inline-flex items-center space-x-1 border',
            getStatusColor(lead.status)
          )}
        >
          <StatusIcon status={lead.status} />
          <span className="text-xs font-medium">
            {getStatusText(lead.status)}
          </span>
        </Badge>
      </div>

      {/* Actions - 1 column */}
      <div className="col-span-1 flex items-center justify-end">
        <motion.div
          initial={false}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        >
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  )
}
