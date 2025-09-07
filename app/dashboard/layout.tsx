import Sidebar from '@/components/layout/sidebar'
import { ProtectedRoute } from '@/components/auth/protected-route'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <Sidebar>
        {children}
      </Sidebar>
    </ProtectedRoute>
  )
}
