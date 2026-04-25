import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { fetchProfile } from '@/store/slices/authSlice'
import { ROUTES } from '@/constants/appConstants'
import ProfileInfo from '../components/ProfileInfo'
import EmailVerification from '../components/EmailVerification'
import ChangePasswordForm from '../components/ChangePasswordForm'
import DeactivateAccount from '../components/DeactivateAccount'
import DeleteAccount from '../components/DeleteAccount'

export default function ProfilePage() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  // Refresh profile data on mount
  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to={ROUTES.DASHBOARD}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <p className="text-sm text-gray-500">Manage your account settings</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <ProfileInfo />
        <EmailVerification />
        <ChangePasswordForm />
        <DeactivateAccount />
        <DeleteAccount />
      </div>
    </div>
  )
}
