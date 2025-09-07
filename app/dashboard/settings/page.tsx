'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, CreditCard, User, Bell, Shield } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings & Billing</h1>
        <p className="text-gray-600">Manage your account settings and billing information</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile Settings
            </CardTitle>
            <CardDescription>Manage your personal information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input defaultValue="Kandid Personal" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue="bhavya@kandid.ai" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Company</label>
              <Input defaultValue="Kandid.AI" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Billing Information
            </CardTitle>
            <CardDescription>Manage your subscription and payments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900">Pro Plan</h3>
              <p className="text-sm text-blue-700">$99/month - Unlimited campaigns</p>
              <p className="text-xs text-blue-600 mt-1">Next billing: September 6, 2025</p>
            </div>
            <div className="space-y-2">
              <Button variant="outline" className="w-full">Update Payment Method</Button>
              <Button variant="outline" className="w-full">Download Invoice</Button>
              <Button variant="outline" className="w-full text-red-600 hover:text-red-700">
                Cancel Subscription
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notification Settings
            </CardTitle>
            <CardDescription>Configure your notification preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Email Notifications</label>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Lead Response Alerts</label>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Campaign Updates</label>
              <input type="checkbox" defaultChecked className="h-4 w-4" />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Weekly Reports</label>
              <input type="checkbox" className="h-4 w-4" />
            </div>
            <Button>Save Preferences</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="h-5 w-5 mr-2" />
              Security Settings
            </CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <Input type="password" placeholder="Enter current password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input type="password" placeholder="Enter new password" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input type="password" placeholder="Confirm new password" />
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="text-sm font-medium">Two-Factor Authentication</label>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
            <Button>Update Password</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
