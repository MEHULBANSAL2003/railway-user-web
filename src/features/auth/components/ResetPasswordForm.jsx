import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { resetPasswordSchema } from '@/constants/validationRules'
import {
  resetPasswordVerify,
  resetPasswordResend,
  clearError,
} from '@/store/slices/authSlice'
import { ROUTES } from '@/constants/appConstants'
import { useCountdown } from '@/features/auth/hooks/useCountdown'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import PasswordInput from '@/components/PasswordInput'
import OtpInput from '@/components/OtpInput'

export default function ResetPasswordForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, otpFlow } = useSelector((state) => state.auth)
  const { seconds, isActive, restart } = useCountdown(otpFlow?.resendCooldownSeconds ?? 0)
  const [otpValue, setOtpValue] = useState('')

  const otpLength = otpFlow?.otpLength ?? 6

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
      resetPasswordVerify({
        identifier: otpFlow.identifier,
        otp: data.otp,
        newPassword: data.newPassword,
      })
    )
    if (resetPasswordVerify.fulfilled.match(result)) {
      toast.success('Password reset successful! Please login.')
      navigate(ROUTES.LOGIN, { replace: true })
    } else {
      toast.error(result.payload || 'Password reset failed')
    }
  }

  const handleResend = async () => {
    dispatch(clearError())
    const result = await dispatch(resetPasswordResend({ identifier: otpFlow.identifier }))
    if (resetPasswordResend.fulfilled.match(result)) {
      toast.success(result.payload.message || 'OTP resent')
      restart(result.payload.resendCooldownSeconds)
      setOtpValue('')
      setValue('otp', '')
    } else {
      toast.error(result.payload || 'Failed to resend OTP')
    }
  }

  const resendsRemaining = otpFlow?.resendsRemaining ?? 0

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2 text-center">
        <p className="text-sm text-gray-500">{otpFlow?.message}</p>
      </div>

      <div className="space-y-2">
        <Label>Verification Code</Label>
        <OtpInput length={otpLength} value={otpValue} onChange={handleOtpChange} disabled={loading} />
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
