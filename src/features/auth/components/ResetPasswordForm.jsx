import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { resetPasswordSchema } from '@/constants/validationRules'
import {
  resetPassword,
  resendResetOtp,
  clearError,
} from '@/store/slices/authSlice'
import { ROUTES, OTP_RESEND_COOLDOWN } from '@/constants/appConstants'
import { useCountdown } from '@/features/auth/hooks/useCountdown'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import PasswordInput from '@/components/PasswordInput'
import OtpInput from '@/components/OtpInput'

export default function ResetPasswordForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, otpEmail } = useSelector((state) => state.auth)
  const { seconds, isActive, restart } = useCountdown(OTP_RESEND_COOLDOWN)
  const [otpValue, setOtpValue] = useState('')

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', newPassword: '', confirmPassword: '' },
  })

  const handleOtpChange = (val) => {
    setOtpValue(val)
    setValue('otp', val, { shouldValidate: true })
  }

  const onSubmit = async (data) => {
    dispatch(clearError())
    const result = await dispatch(
      resetPassword({
        email: otpEmail,
        otp: data.otp,
        newPassword: data.newPassword,
      })
    )
    if (resetPassword.fulfilled.match(result)) {
      toast.success('Password reset successful! Please login.')
      navigate(ROUTES.LOGIN, { replace: true })
    } else {
      toast.error(result.payload || 'Password reset failed')
    }
  }

  const handleResend = async () => {
    dispatch(clearError())
    const result = await dispatch(resendResetOtp({ email: otpEmail }))
    if (resendResetOtp.fulfilled.match(result)) {
      toast.success('New OTP sent to your email')
      restart()
      setOtpValue('')
      setValue('otp', '')
    } else {
      toast.error(result.payload || 'Failed to resend OTP')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2 text-center">
        <p className="text-sm text-gray-500">
          Enter the OTP sent to
        </p>
        <p className="font-medium text-gray-900">{otpEmail}</p>
      </div>

      <div className="space-y-2">
        <Label>Verification Code</Label>
        <OtpInput value={otpValue} onChange={handleOtpChange} disabled={loading} />
        <input type="hidden" {...register('otp')} />
        {errors.otp && (
          <p className="text-center text-sm text-red-500">{errors.otp.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <PasswordInput
          id="newPassword"
          placeholder="Enter new password"
          autoComplete="new-password"
          {...register('newPassword')}
        />
        {errors.newPassword && (
          <p className="text-sm text-red-500">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm new password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Reset Password
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
