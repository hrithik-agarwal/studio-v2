import { useState, useEffect } from 'react'
import type { DashboardStat } from '@/features/dashboard/types/dashboard.types'

export function useDashboardData() {
  const [stats, setStats] = useState<DashboardStat[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setIsLoading(true)

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Mock data
      const mockStats: DashboardStat[] = [
        {
          id: '1',
          label: 'Total Users',
          value: '12,345',
          icon: '👥',
          trend: 'up',
          change: 12.5,
        },
        {
          id: '2',
          label: 'Revenue',
          value: '$45,678',
          icon: '💰',
          trend: 'up',
          change: 8.2,
        },
        {
          id: '3',
          label: 'Active Sessions',
          value: '1,234',
          icon: '⚡',
          trend: 'down',
          change: -3.1,
        },
        {
          id: '4',
          label: 'Conversion Rate',
          value: '3.45%',
          icon: '📈',
          trend: 'up',
          change: 5.7,
        },
        {
          id: '5',
          label: 'Avg. Response Time',
          value: '245ms',
          icon: '⏱️',
          trend: 'down',
          change: -12.3,
        },
        {
          id: '6',
          label: 'Support Tickets',
          value: '89',
          icon: '🎫',
          trend: 'neutral',
          change: 0.5,
        },
      ]

      setStats(mockStats)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  return { stats, isLoading }
}
