'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  Settings, 
  ChevronLeft,
  BarChart3,
  Mail,
  Target,
  User
} from 'lucide-react'
import { cn } from '@/src/utils/format'
import { useUIStore } from '@/src/stores/uiStore'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    current: false,
  },
  {
    name: 'Leads',
    href: '/dashboard/leads',
    icon: Users,
    current: false,
  },
  {
    name: 'Campaigns',
    href: '/dashboard/campaigns',
    icon: Megaphone,
    current: false,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
    current: false,
  },
  {
    name: 'Messages',
    href: '/dashboard/messages',
    icon: Mail,
    current: false,
  },
  {
    name: 'Audience',
    href: '/dashboard/audience',
    icon: Target,
    current: false,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={false}
        animate={{
          width: sidebarCollapsed ? '4rem' : '16rem',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col bg-white border-r border-gray-200',
          'lg:relative lg:translate-x-0',
          sidebarCollapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed ? (
              <motion.div
                key="logo-full"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <span className="text-white font-bold text-sm">LB</span>
                </div>
                <span className="ml-3 text-lg font-semibold text-gray-900">
                  LinkBird
                </span>
              </motion.div>
            ) : (
              <motion.div
                key="logo-collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600"
              >
                <span className="text-white font-bold text-sm">LB</span>
              </motion.div>
            )}
          </AnimatePresence>
          
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft 
              className={cn(
                'h-4 w-4 text-gray-500 transition-transform duration-300',
                sidebarCollapsed && 'rotate-180'
              )} 
            />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  sidebarCollapsed ? 'justify-center' : ''
                )}
              >
                <item.icon
                  className={cn(
                    'flex-shrink-0 h-5 w-5',
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500',
                    !sidebarCollapsed && 'mr-3'
                  )}
                />
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            )
          })}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-4">
          <div className={cn(
            'flex items-center',
            sidebarCollapsed ? 'justify-center' : ''
          )}>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <AnimatePresence>
              {!sidebarCollapsed && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  className="ml-3"
                >
                  <p className="text-sm font-medium text-gray-700">John Doe</p>
                  <p className="text-xs text-gray-500">john@example.com</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </>
  )
}
