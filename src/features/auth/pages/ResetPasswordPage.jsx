import { useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { ROUTES } from '@/constants/appConstants'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import ResetPasswordForm from '../components/ResetPasswordForm'

export default function ResetPasswordPage() {
  const { otpEmail, otpContext } = useSelector((state) => state.auth)

  // Guard: redirect if no reset flow in progress
  if (!otpEmail || otpContext !== 'resetPassword') {
    return <Navigate to={ROUTES.FORGOT_PASSWORD} replace />
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter the OTP and your new password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResetPasswordForm />
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          to={ROUTES.FORGOT_PASSWORD}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Forgot Password
        </Link>
      </CardFooter>
    </Card>
  )
}
