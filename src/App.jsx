import { Suspense } from 'react'
import { useAuthInit } from '@/hooks/useAuthInit'
import AppRoutes from '@/routes/AppRoutes'
import LoadingSpinner from '@/components/LoadingSpinner'

export default function App() {
  useAuthInit()

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AppRoutes />
    </Suspense>
  )
}
