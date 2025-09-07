'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Users, Plus, Settings } from 'lucide-react'

const mockAccounts = [
  {
    id: 1,
    name: 'Pulkit Garg',
    email: '1999pulkitgarg@gmail.com',
    connected: true,
    requestsUsed: 17,
    requestsLimit: 30,
  },
  {
    id: 2,
    name: 'Jivesh Lakhani',
    email: 'jives@gmail.com',
    connected: true,
    requestsUsed: 19,
    requestsLimit: 30,
  },
  {
    id: 3,
    name: 'Indrajit Sahani',
    email: 'indrajit38msg@gmail.com',
    connected: true,
    requestsUsed: 18,
    requestsLimit: 30,
  },
  {
    id: 4,
    name: 'Bhavya Arora',
    email: 'bhavyaarora09.bsa@gmail.com',
    connected: true,
    requestsUsed: 18,
    requestsLimit: 100,
  },
]

export default function AccountsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LinkedIn Accounts</h1>
          <p className="text-gray-600">Manage your connected LinkedIn accounts</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Account
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockAccounts.length}</div>
            <p className="text-xs text-muted-foreground">All connected</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Requests Used</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAccounts.reduce((sum, acc) => sum + acc.requestsUsed, 0)}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Requests</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockAccounts.reduce((sum, acc) => sum + (acc.requestsLimit - acc.requestsUsed), 0)}
            </div>
            <p className="text-xs text-muted-foreground">Remaining</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usage Rate</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((mockAccounts.reduce((sum, acc) => sum + acc.requestsUsed, 0) / 
                mockAccounts.reduce((sum, acc) => sum + acc.requestsLimit, 0)) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">Average usage</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Manage your LinkedIn account connections and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{account.name}</p>
                    <p className="text-xs text-gray-500">{account.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {account.requestsUsed}/{account.requestsLimit}
                    </p>
                    <p className="text-xs text-gray-500">requests used</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      Connected
                    </span>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
