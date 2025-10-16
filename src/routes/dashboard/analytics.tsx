import { createFileRoute } from '@tanstack/react-router'
import { DashboardHeader } from '@/features/dashboard/components/DashboardHeader'

export const Route = createFileRoute('/dashboard/analytics')({
  component: DashboardAnalytics,
})

function DashboardAnalytics() {
  const analyticsData = [
    { metric: 'Page Views', value: '125,432', change: '+12%', period: 'Last 30 days' },
    { metric: 'Unique Visitors', value: '34,567', change: '+8%', period: 'Last 30 days' },
    { metric: 'Bounce Rate', value: '42.3%', change: '-5%', period: 'Last 30 days' },
    { metric: 'Avg. Session Duration', value: '4m 32s', change: '+15%', period: 'Last 30 days' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">Track your performance metrics and insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {analyticsData.map((item) => (
            <div key={item.metric} className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{item.metric}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{item.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{item.period}</p>
                </div>
                <span
                  className={`px-2 py-1 text-sm font-semibold rounded ${
                    item.change.startsWith('+')
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {item.change}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Traffic Sources</h2>
          <div className="space-y-4">
            {[
              { source: 'Direct', percentage: 45, color: 'bg-blue-500' },
              { source: 'Organic Search', percentage: 30, color: 'bg-green-500' },
              { source: 'Social Media', percentage: 15, color: 'bg-purple-500' },
              { source: 'Referral', percentage: 10, color: 'bg-orange-500' },
            ].map((item) => (
              <div key={item.source}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.source}</span>
                  <span className="text-sm font-semibold text-gray-900">{item.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all duration-300`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
