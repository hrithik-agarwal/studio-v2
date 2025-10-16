import { Link } from '@tanstack/react-router'

export function DashboardHeader() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-xl font-bold text-gray-900">
              Dashboard
            </Link>
            <nav className="flex gap-4">
              <Link
                to="/dashboard"
                className="text-gray-600 hover:text-gray-900 [&.active]:text-blue-600 [&.active]:font-semibold"
              >
                Overview
              </Link>
              <Link
                to="/dashboard/settings"
                className="text-gray-600 hover:text-gray-900 [&.active]:text-blue-600 [&.active]:font-semibold"
              >
                Settings
              </Link>
              <Link
                to="/dashboard/analytics"
                className="text-gray-600 hover:text-gray-900 [&.active]:text-blue-600 [&.active]:font-semibold"
              >
                Analytics
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
              New Report
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
