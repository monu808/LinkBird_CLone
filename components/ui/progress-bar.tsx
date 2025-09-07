import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max: number
  label?: string
  className?: string
  showPercentage?: boolean
}

export function ProgressBar({ 
  value, 
  max, 
  label, 
  className,
  showPercentage = true 
}: ProgressBarProps) {
  const percentage = max > 0 ? Math.round((value / max) * 100) : 0
  
  return (
    <div className={cn("space-y-1", className)}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs">
          {label && <span className="text-gray-600">{label}</span>}
          {showPercentage && (
            <span className="text-gray-500 font-medium">{percentage}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-300 ease-out",
            percentage >= 80 ? "bg-green-500" :
            percentage >= 60 ? "bg-blue-500" :
            percentage >= 40 ? "bg-yellow-500" :
            percentage >= 20 ? "bg-orange-500" : "bg-red-500"
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>
      {(value !== undefined && max !== undefined) && (
        <div className="flex justify-between text-xs text-gray-500">
          <span>{value} of {max}</span>
        </div>
      )}
    </div>
  )
}
