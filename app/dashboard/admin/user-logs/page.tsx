'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Search, 
  Filter, 
  Calendar,
  User,
  Mail,
  Globe,
  Clock,
  Shield,
  Download,
  Eye
} from 'lucide-react'

interface UserLog {
  id: string
  userId: string
  userName: string
  userEmail: string
  loginTime: string
  logoutTime?: string
  sessionDuration?: string
  ipAddress: string
  location: string
  device: string
  browser: string
  status: 'active' | 'inactive' | 'blocked'
  lastActivity: string
}

const mockUserLogs: UserLog[] = [
  {
    id: '1',
    userId: 'user_1',
    userName: 'John Doe',
    userEmail: 'john.doe@company.com',
    loginTime: '2025-09-08T09:00:00Z',
    logoutTime: '2025-09-08T17:30:00Z',
    sessionDuration: '8h 30m',
    ipAddress: '192.168.1.100',
    location: 'New York, US',
    device: 'Desktop',
    browser: 'Chrome 118',
    status: 'inactive',
    lastActivity: '2025-09-08T17:30:00Z'
  },
  {
    id: '2',
    userId: 'user_2',
    userName: 'Jane Smith',
    userEmail: 'jane.smith@company.com',
    loginTime: '2025-09-08T08:30:00Z',
    sessionDuration: '2h 45m (ongoing)',
    ipAddress: '192.168.1.101',
    location: 'London, UK',
    device: 'Laptop',
    browser: 'Firefox 119',
    status: 'active',
    lastActivity: '2025-09-08T11:15:00Z'
  },
  {
    id: '3',
    userId: 'user_3',
    userName: 'Bob Wilson',
    userEmail: 'bob.wilson@company.com',
    loginTime: '2025-09-08T10:00:00Z',
    logoutTime: '2025-09-08T12:00:00Z',
    sessionDuration: '2h 0m',
    ipAddress: '192.168.1.102',
    location: 'Toronto, CA',
    device: 'Mobile',
    browser: 'Safari 17',
    status: 'inactive',
    lastActivity: '2025-09-08T12:00:00Z'
  },
  {
    id: '4',
    userId: 'user_4',
    userName: 'Alice Brown',
    userEmail: 'alice.brown@company.com',
    loginTime: '2025-09-08T07:45:00Z',
    sessionDuration: '4h 12m (ongoing)',
    ipAddress: '192.168.1.103',
    location: 'Sydney, AU',
    device: 'Desktop',
    browser: 'Chrome 118',
    status: 'active',
    lastActivity: '2025-09-08T11:57:00Z'
  },
  {
    id: '5',
    userId: 'user_5',
    userName: 'Charlie Davis',
    userEmail: 'charlie.davis@company.com',
    loginTime: '2025-09-07T15:30:00Z',
    logoutTime: '2025-09-07T18:45:00Z',
    sessionDuration: '3h 15m',
    ipAddress: '10.0.0.50',
    location: 'Berlin, DE',
    device: 'Tablet',
    browser: 'Edge 118',
    status: 'blocked',
    lastActivity: '2025-09-07T18:45:00Z'
  }
]

export default function UserLogsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [logs, setLogs] = useState<UserLog[]>(mockUserLogs)
  const [filteredLogs, setFilteredLogs] = useState<UserLog[]>(mockUserLogs)

  useEffect(() => {
    const filtered = logs.filter(log => 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery)
    )
    setFilteredLogs(filtered)
  }, [searchQuery, logs])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'blocked':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <div className="h-2 w-2 bg-green-500 rounded-full"></div>
      case 'inactive':
        return <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
      case 'blocked':
        return <div className="h-2 w-2 bg-red-500 rounded-full"></div>
      default:
        return <div className="h-2 w-2 bg-gray-500 rounded-full"></div>
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Logs</h1>
          <p className="text-gray-600">Track user sessions and access patterns</p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export User Data
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search users, emails, or locations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Status Filter
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
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{logs.length}</p>
            </div>
            <User className="h-8 w-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-green-600">
                {logs.filter(log => log.status === 'active').length}
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
              <p className="text-sm text-gray-600">Blocked Users</p>
              <p className="text-2xl font-bold text-red-600">
                {logs.filter(log => log.status === 'blocked').length}
              </p>
            </div>
            <Shield className="h-8 w-8 text-red-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Locations</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(logs.map(log => log.location)).size}
              </p>
            </div>
            <Globe className="h-8 w-8 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* User Logs Table */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">User Sessions</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Login Time</TableHead>
              <TableHead>Session Duration</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Device & Browser</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Last Activity</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((log) => (
              <TableRow key={log.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs">
                        {log.userName.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-gray-900">{log.userName}</div>
                      <div className="text-sm text-gray-500">{log.userEmail}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(log.status)}
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {new Date(log.loginTime).toLocaleString()}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{log.sessionDuration}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-1">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <span>{log.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="text-sm">{log.device}</div>
                    <div className="text-xs text-gray-500">{log.browser}</div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm">{log.ipAddress}</TableCell>
                <TableCell className="font-mono text-sm">
                  {new Date(log.lastActivity).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
