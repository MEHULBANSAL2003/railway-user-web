import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Train, Search, Ticket, User } from 'lucide-react'
import { ROUTES } from '@/constants/appConstants'

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.fullName}!
        </h1>
        <p className="text-gray-500">What would you like to do today?</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Search, title: 'Search Trains', desc: 'Find trains between stations' },
          { icon: Ticket, title: 'My Bookings', desc: 'View your ticket history' },
          { icon: Train, title: 'Live Status', desc: 'Check train running status' },
          { icon: User, title: 'My Profile', desc: 'Manage your account', route: ROUTES.PROFILE },
        ].map(({ icon: Icon, title, desc, route }) => (
          <Card
            key={title}
            className="cursor-pointer transition-shadow hover:shadow-md"
            onClick={() => route && navigate(route)}
          >
            <CardHeader>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <CardTitle className="text-base">{title}</CardTitle>
              <CardDescription>{desc}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <Train className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">More features coming soon</h3>
          <p className="mt-1 text-sm text-gray-500">
            Train search, booking, and payment features are under development.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
