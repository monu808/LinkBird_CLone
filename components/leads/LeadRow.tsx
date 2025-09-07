import React from 'react'
import { TableRow, TableCell } from '@/components/ui/table'
import { StatusPill } from '@/components/ui/status-pill'
import { useUIStore } from '@/stores/uiStore'
import { Lead } from '@/lib/types/api'
import { format } from 'date-fns'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Mail, Building, Calendar } from 'lucide-react'

interface LeadRowProps {
  lead: Lead
}

export const LeadRow = React.memo(({ lead }: LeadRowProps) => {
  const openLeadSheet = useUIStore(state => state.openLeadSheet)

  const handleRowClick = React.useCallback(() => {
    openLeadSheet(lead.id)
  }, [lead.id, openLeadSheet])

  const initials = `${lead.firstName[0]}${lead.lastName[0]}`.toUpperCase()

  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={handleRowClick}
    >
      <TableCell>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs font-medium bg-blue-100 text-blue-600">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="font-medium text-gray-900">
              {lead.firstName} {lead.lastName}
            </div>
            {lead.company && (
              <div className="text-sm text-gray-500 truncate flex items-center gap-1">
                <Building className="h-3 w-3" />
                {lead.position ? `${lead.position} at ${lead.company}` : lead.company}
              </div>
            )}
          </div>
        </div>
      </TableCell>
      
      <TableCell>
        <div className="flex items-center gap-1 text-gray-600">
          <Mail className="h-3 w-3" />
          {lead.email}
        </div>
      </TableCell>
      
      <TableCell>
        <span className="text-gray-900">{lead.company || '-'}</span>
      </TableCell>
      
      <TableCell>
        <StatusPill status={lead.status} />
      </TableCell>
      
      <TableCell>
        <div className="text-gray-600">
          {lead.lastContactDate ? (
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(lead.lastContactDate), 'MMM d, yyyy')}
            </div>
          ) : (
            <span className="text-gray-400">Never</span>
          )}
        </div>
      </TableCell>
    </TableRow>
  )
})

LeadRow.displayName = 'LeadRow'
