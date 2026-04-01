import { Outlet } from 'react-router-dom'
import Logo from '@/components/Logo'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12">
      <div className="mb-8">
        <Logo size="lg" />
      </div>
      <div className="w-full max-w-md">
        <Outlet />
      </div>
      <p className="mt-8 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} RailBooking. All rights reserved.
      </p>
    </div>
  )
}
