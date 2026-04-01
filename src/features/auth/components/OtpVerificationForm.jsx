import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  registerVerifyOtp,
  registerResendOtp,
  clearError,
} from '@/store/slices/authSlice'
import { ROUTES, OTP_LENGTH, OTP_RESEND_COOLDOWN } from '@/constants/appConstants'
import { useCountdown } from '@/features/auth/hooks/useCountdown'
import { Button } from '@/components/ui/button'
import OtpInput from '@/components/OtpInput'

export default function OtpVerificationForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, otpEmail } = useSelector((state) => state.auth)
  const { seconds, isActive, restart } = useCountdown(OTP_RESEND_COOLDOWN)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')

    if (otp.length !== OTP_LENGTH) {
      setError('Please enter the complete 6-digit OTP')
      return
    }

    dispatch(clearError())
    const result = await dispatch(
      registerVerifyOtp({ email: otpEmail, otp })
    )

    if (registerVerifyOtp.fulfilled.match(result)) {
      toast.success('Account verified! Welcome aboard!')
      navigate(ROUTES.DASHBOARD, { replace: true })
    } else {
      setError(result.payload || 'Invalid OTP')
      toast.error(result.payload || 'Verification failed')
    }
  }

  const handleResend = async () => {
    dispatch(clearError())
    const result = await dispatch(registerResendOtp({ email: otpEmail }))
    if (registerResendOtp.fulfilled.match(result)) {
      toast.success('New OTP sent to your email')
      restart()
      setOtp('')
    } else {
      toast.error(result.payload || 'Failed to resend OTP')
    }
  }

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm text-gray-500">
          We sent a verification code to
        </p>
        <p className="font-medium text-gray-900">{otpEmail}</p>
      </div>

      <OtpInput value={otp} onChange={setOtp} disabled={loading} />

      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading || otp.length !== OTP_LENGTH}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Verify OTP
      </Button>

      <div className="text-center">
        {isActive ? (
          <p className="text-sm text-gray-500">
            Resend OTP in <span className="font-medium text-primary">{seconds}s</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
          >
            Resend OTP
          </button>
        )}
      </div>
    </form>
  )
}
