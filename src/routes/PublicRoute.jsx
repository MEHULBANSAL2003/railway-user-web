import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { ROUTES } from '@/constants/appConstants'

export default function PublicRoute({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (isAuthenticated) {
    return <Navigate to={ROUTES.DASHBOARD} replace />
  }

  return children
}
