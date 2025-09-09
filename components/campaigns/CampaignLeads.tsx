'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Search, Filter, Download } from 'lucide-react'

interface CampaignLeadsProps {
  campaignId: string
}

export default function CampaignLeads({ campaignId }: CampaignLeadsProps) {
  const [searchTerm, setSearchTerm] = useState('')

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Campaign Leads</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-medium text-gray-900 mb-2">No leads found</h4>
          <p className="text-gray-600 mb-4">
            This campaign doesn't have any leads yet. Add leads to start your outreach.
          </p>
          <Button>
            Add Leads
          </Button>
        </div>
      </div>
    </Card>
  )
}
