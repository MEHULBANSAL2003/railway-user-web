import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ROUTES } from '@/constants/appConstants'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 bg-gray-50">
      <h1 className="text-6xl font-bold text-primary">404</h1>
      <h2 className="text-xl font-semibold text-gray-900">Page Not Found</h2>
      <p className="text-gray-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Button asChild>
        <Link to={ROUTES.DASHBOARD} className="flex items-center gap-2">
          <Home className="h-4 w-4" />
          Go Home
        </Link>
      </Button>
    </div>
  )
}
