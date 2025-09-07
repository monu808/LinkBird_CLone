'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { 
  Search, 
  Filter, 
  Calendar,
  User,
  Mail,
  Target,
  Settings,
  Eye,
  Download
} from 'lucide-react'

interface ActivityLog {
  id: string
  timestamp: string
  user: string
  action: string
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  status: 'success' | 'failed' | 'warning'
}

const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    timestamp: '2025-09-08T10:30:00Z',
    user: 'john.doe@company.com',
    action: 'Login',
    resource: 'Authentication',
    details: 'User logged in successfully',
    ipAddress: '192.168.1.100',
    userAgent: 'Chrome/118.0.0.0',
    status: 'success'
  },
  {
    id: '2',
    timestamp: '2025-09-08T10:25:00Z',
    user: 'jane.smith@company.com',
    action: 'Campaign Created',
    resource: 'Campaigns',
    details: 'Created campaign "Q4 Outreach"',
    ipAddress: '192.168.1.101',
    userAgent: 'Firefox/119.0',
    status: 'success'
  },
  {
    id: '3',
    timestamp: '2025-09-08T10:20:00Z',
    user: 'bob.wilson@company.com',
    action: 'Lead Import',
    resource: 'Leads',
    details: 'Imported 50 leads from CSV',
    ipAddress: '192.168.1.102',
    userAgent: 'Chrome/118.0.0.0',
    status: 'success'
  },
  {
    id: '4',
    timestamp: '2025-09-08T10:15:00Z',
    user: 'alice.brown@company.com',
    action: 'Failed Login',
    resource: 'Authentication',
    details: 'Invalid password attempt',
    ipAddress: '192.168.1.103',
    userAgent: 'Safari/17.0',
    status: 'failed'
  },
  {
    id: '5',
    timestamp: '2025-09-08T10:10:00Z',
    user: 'charlie.davis@company.com',
    action: 'Settings Updated',
    resource: 'Settings',
    details: 'Updated notification preferences',
    ipAddress: '192.168.1.104',
    userAgent: 'Chrome/118.0.0.0',
    status: 'success'
  }
]

export default function ActivityLogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [logs, setLogs] = useState<ActivityLog[]>(mockActivityLogs)
  const [filteredLogs, setFilteredLogs] = useState<ActivityLog[]>(mockActivityLogs)

  useEffect(() => {
    const filtered = logs.filter(log => 
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredLogs(filtered)
  }, [searchQuery, logs])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionIcon = (action: string) => {
    if (action.includes('Login')) return <User className="h-4 w-4" />
    if (action.includes('Campaign')) return <Target className="h-4 w-4" />
    if (action.includes('Lead')) return <Mail className="h-4 w-4" />
    if (action.includes('Settings')) return <Settings className="h-4 w-4" />
    return <Eye className="h-4 w-4" />
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600">Monitor system activities and user actions</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
        <Button variant="outline">
          <Calendar className="h-4 w-4 mr-2" />
          Date Range
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-green-600">
                {logs.filter(log => log.status === 'success').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-green-500 rounded-full"></div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {logs.filter(log => log.status === 'failed').length}
              </p>
            </div>
            <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
              <div className="h-4 w-4 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(logs.map(log => log.user)).size}
              </p>
            </div>
            <User className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Activity Logs Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activities</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Resource</TableHead>
              <TableHead>Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-gray-50">
                <TableCell className="font-mono text-sm">
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell className="font-medium">{log.user}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getActionIcon(log.action)}
                    <span>{log.action}</span>
                  </div>
                </TableCell>
                <TableCell>{log.resource}</TableCell>
                <TableCell className="max-w-xs truncate">{log.details}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(log.status)}>
                    {log.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
