import { createFileRoute } from '@tanstack/react-router'
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'
import { StatsCard } from '@/features/dashboard/components/StatsCard'
import { useDashboardData } from '@/features/dashboard/hooks/useDashboardData'

export const Route = createFileRoute('/dashboard')({
  component: Dashboard,
})

function Dashboard() {
  const { stats, isLoading } = useDashboardData()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => (
            <StatsCard key={stat.id} stat={stat} />
          ))}
        </div>
      </main>
    </div>
  )
}
