export interface DashboardStat {
  id: string
  label: string
  value: string | number
  icon: string
  trend: 'up' | 'down' | 'neutral'
  change: number
}

export interface DashboardData {
  stats: DashboardStat[]
  isLoading: boolean
}
