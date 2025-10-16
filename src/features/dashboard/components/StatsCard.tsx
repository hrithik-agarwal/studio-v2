import type { DashboardStat } from '@/features/dashboard/types/dashboard.types'

interface StatsCardProps {
  stat: DashboardStat
}

export function StatsCard({ stat }: StatsCardProps) {
  const getTrendColor = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getTrendIcon = (trend: 'up' | 'down' | 'neutral') => {
    switch (trend) {
      case 'up':
        return '↑'
      case 'down':
        return '↓'
      default:
        return '→'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{stat.label}</h3>
        <span className="text-2xl">{stat.icon}</span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor(stat.trend)}`}>
          <span>{getTrendIcon(stat.trend)}</span>
          <span>{stat.change}%</span>
        </div>
      </div>
    </div>
  )
}
