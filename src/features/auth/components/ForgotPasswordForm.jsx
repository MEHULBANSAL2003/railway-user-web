import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { forgotPasswordSchema } from '@/constants/validationRules'
import { resetPasswordInitiate, setOtpFlow, clearError } from '@/store/slices/authSlice'
import { ROUTES } from '@/constants/appConstants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function ForgotPasswordForm() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((state) => state.auth)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { identifier: '' },
  })

  const onSubmit = async (data) => {
    dispatch(clearError())
    const result = await dispatch(resetPasswordInitiate(data))
    if (resetPasswordInitiate.fulfilled.match(result)) {
      const otpData = result.payload
      dispatch(setOtpFlow({
        identifier: data.identifier,
        context: 'resetPassword',
        message: otpData.message,
        otpLength: otpData.otpLength,
        expiresInSeconds: otpData.expiresInSeconds,
        resendCooldownSeconds: otpData.resendCooldownSeconds,
        resendsRemaining: otpData.resendsRemaining,
      }))
      toast.success(otpData.message)
      navigate(ROUTES.RESET_PASSWORD)
    } else {
      toast.error(result.payload || 'Failed to send reset OTP')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="identifier">Email, Phone, or Username</Label>
        <Input
          id="identifier"
          placeholder="you@example.com / 9876543210 / username"
          autoComplete="username"
          {...register('identifier')}
        />
        {errors.identifier && (
          <p className="text-sm text-red-500">{errors.identifier.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Send Reset OTP
      </Button>
    </form>
  )
}
