import { useSelector } from 'react-redux'
import { Navigate, Link } from 'react-router-dom'
import { ROUTES } from '@/constants/appConstants'
import { ArrowLeft } from 'lucide-react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card'
import OtpVerificationForm from '../components/OtpVerificationForm'

export default function OtpVerificationPage() {
  const { otpEmail, otpContext } = useSelector((state) => state.auth)

  // Guard: redirect if no OTP flow in progress
  if (!otpEmail || otpContext !== 'register') {
    return <Navigate to={ROUTES.REGISTER} replace />
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Verify Your Email</CardTitle>
        <CardDescription>
          Enter the 6-digit code we sent to your email
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OtpVerificationForm />
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          to={ROUTES.REGISTER}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Registration
        </Link>
      </CardFooter>
    </Card>
  )
}
