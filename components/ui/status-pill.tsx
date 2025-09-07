import { cn } from '@/lib/utils'

interface StatusPillProps {
  status: string
  className?: string
}

const statusConfig = {
  pending: {
    label: 'Pending',
    className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  },
  contacted: {
    label: 'Contacted',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  responded: {
    label: 'Responded',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  converted: {
    label: 'Converted',
    className: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
  active: {
    label: 'Active',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
  draft: {
    label: 'Draft',
    className: 'bg-orange-100 text-orange-800 border-orange-200',
  },
  completed: {
    label: 'Completed',
    className: 'bg-purple-100 text-purple-800 border-purple-200',
  },
  paused: {
    label: 'Paused',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
}

export function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || {
    label: status,
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  )
}
