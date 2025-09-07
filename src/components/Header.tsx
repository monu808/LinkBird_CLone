'use client'

import { usePathname } from 'next/navigation'
import { Search, Bell, Plus, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUIStore } from '@/src/stores/uiStore'
import { cn } from '@/src/utils/format'

const getBreadcrumb = (pathname: string): { title: string, subtitle: string } => {
  switch (pathname) {
    case '/dashboard':
      return { title: 'Dashboard', subtitle: 'Welcome back! Here\'s what\'s happening with your outreach.' }
    case '/dashboard/leads':
      return { title: 'Leads', subtitle: 'Manage and track your LinkedIn connections and prospects.' }
    case '/dashboard/campaigns':
      return { title: 'Campaigns', subtitle: 'Create and monitor your LinkedIn outreach campaigns.' }
    case '/dashboard/analytics':
      return { title: 'Analytics', subtitle: 'Track your performance and optimize your outreach strategy.' }
    case '/dashboard/messages':
      return { title: 'Messages', subtitle: 'View and respond to messages from your LinkedIn connections.' }
    case '/dashboard/audience':
      return { title: 'Audience', subtitle: 'Build and manage your target audience lists.' }
    default:
      return { title: 'Dashboard', subtitle: 'Welcome back to LinkBird.' }
  }
}

export function Header() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { title, subtitle } = getBreadcrumb(pathname)

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left side - Title and breadcrumb */}
        <div className="flex items-center">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className="lg:hidden mr-3"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          </div>
        </div>

        {/* Right side - Search and actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search leads, campaigns..."
              className="pl-10 w-64 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>

          {/* Action buttons */}
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Create</span>
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* User menu */}
          <Button variant="ghost" size="sm" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-sm font-medium">JD</span>
            </div>
            <span className="hidden sm:inline text-sm font-medium text-gray-700">John Doe</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
