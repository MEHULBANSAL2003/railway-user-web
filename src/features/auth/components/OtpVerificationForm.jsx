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
import { ROUTES } from '@/constants/appConstants'
import { useCountdown } from '@/features/auth/hooks/useCountdown'
import { Button } from '@/components/ui/button'
import OtpInput from '@/components/OtpInput'

export default function OtpVerificationForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, otpFlow } = useSelector((state) => state.auth)
  const { seconds, isActive, restart } = useCountdown(otpFlow?.resendCooldownSeconds ?? 0)
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')

  const otpLength = otpFlow?.otpLength ?? 6

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')

    if (otp.length !== otpLength) {
      setError(`Please enter the complete ${otpLength}-digit OTP`)
      return
    }

    dispatch(clearError())
    const result = await dispatch(
      registerVerifyOtp({ phone: otpFlow.phone, otp })
    )

    if (registerVerifyOtp.fulfilled.match(result)) {
      const msg = result.payload.reactivated
        ? 'Welcome back! Your account has been reactivated.'
        : 'Account verified! Welcome aboard!'
      toast.success(msg)
      navigate(ROUTES.DASHBOARD, { replace: true })
    } else {
      setError(result.payload || 'Invalid OTP')
      toast.error(result.payload || 'Verification failed')
    }
  }

  const handleResend = async () => {
    dispatch(clearError())
    const result = await dispatch(registerResendOtp({ phone: otpFlow.phone }))
    if (registerResendOtp.fulfilled.match(result)) {
      toast.success(result.payload.message || 'OTP resent')
      restart(result.payload.resendCooldownSeconds)
      setOtp('')
      setError('')
    } else {
      toast.error(result.payload || 'Failed to resend OTP')
    }
  }

  const resendsRemaining = otpFlow?.resendsRemaining ?? 0

  return (
    <form onSubmit={handleVerify} className="space-y-6">
      <div className="space-y-2 text-center">
        <p className="text-sm text-gray-500">{otpFlow?.message}</p>
      </div>

      <OtpInput length={otpLength} value={otp} onChange={setOtp} disabled={loading} />

      {error && (
        <p className="text-center text-sm text-red-500">{error}</p>
      )}

      <Button type="submit" className="w-full" disabled={loading || otp.length !== otpLength}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Verify OTP
      </Button>

      <div className="text-center">
        {resendsRemaining <= 0 ? (
          <p className="text-sm text-gray-500">No resends remaining</p>
        ) : isActive ? (
          <p className="text-sm text-gray-500">
            Resend OTP in <span className="font-medium text-primary">{seconds}s</span>
            {' '}<span className="text-gray-400">({resendsRemaining} left)</span>
          </p>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
          >
            Resend OTP ({resendsRemaining} left)
          </button>
        )}
      </div>
    </form>
  )
}
