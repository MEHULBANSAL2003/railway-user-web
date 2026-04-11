import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { Loader2, MailWarning, CheckCircle2 } from 'lucide-react'
import { emailSendOtp, emailVerifyOtp, emailResendOtp, updateEmailVerified } from '@/store/slices/authSlice'
import { useCountdown } from '@/features/auth/hooks/useCountdown'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import OtpInput from '@/components/OtpInput'

export default function EmailVerification() {
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

  const [step, setStep] = useState('idle') // 'idle' | 'otp' | 'verified'
  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState('')
  const [otpConfig, setOtpConfig] = useState(null) // from backend
  const [message, setMessage] = useState('')
  const [resendsRemaining, setResendsRemaining] = useState(0)

  const { seconds: cooldownSeconds, isActive: cooldownActive, restart: restartCooldown } = useCountdown(0)
  const { seconds: expirySeconds, isActive: expiryActive, restart: restartExpiry } = useCountdown(0)

  // If email is already verified, show success state
  if (user?.emailVerified) {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle className="text-base text-green-800">Email Verified</CardTitle>
              <CardDescription className="text-green-600">
                Your email {user.email} has been verified.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  const handleSendOtp = async () => {
    setLoading(true)
    const result = await dispatch(emailSendOtp())
    setLoading(false)

    if (emailSendOtp.fulfilled.match(result)) {
      const data = result.payload
      setOtpConfig(data)
      setMessage(data.message)
      setResendsRemaining(data.resendsRemaining)
      restartCooldown(data.resendCooldownSeconds)
      restartExpiry(data.expiresInSeconds)
      setStep('otp')
      toast.success(data.message)
    } else {
      toast.error(result.payload || 'Failed to send OTP')
      // If already verified, update the UI
      if (result.payload === 'Email is already verified') {
        dispatch(updateEmailVerified())
      }
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== (otpConfig?.otpLength || 6)) return

    setLoading(true)
    const result = await dispatch(emailVerifyOtp({ otp }))
    setLoading(false)

    if (emailVerifyOtp.fulfilled.match(result)) {
      dispatch(updateEmailVerified())
      setStep('verified')
      toast.success('Email verified successfully!')
    } else {
      toast.error(result.payload || 'Invalid OTP')
      setOtp('')
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    const result = await dispatch(emailResendOtp())
    setLoading(false)

    if (emailResendOtp.fulfilled.match(result)) {
      const data = result.payload
      setMessage(data.message)
      setResendsRemaining(data.resendsRemaining)
      setOtpConfig(data)
      restartCooldown(data.resendCooldownSeconds)
      restartExpiry(data.expiresInSeconds)
      setOtp('')
      toast.success('OTP resent successfully')
    } else {
      toast.error(result.payload || 'Failed to resend OTP')
      // If max resends reached, go back to idle
      if (result.payload?.includes('Maximum resend limit') || result.payload?.includes('No pending')) {
        setStep('idle')
        setOtp('')
      }
    }
  }

  if (step === 'verified') {
    return (
      <Card className="border-green-200 bg-green-50/50">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <div>
              <CardTitle className="text-base text-green-800">Email Verified</CardTitle>
              <CardDescription className="text-green-600">
                Your email has been verified successfully.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <MailWarning className="h-5 w-5 text-amber-600" />
          <div>
            <CardTitle className="text-base text-amber-800">Verify Your Email</CardTitle>
            <CardDescription className="text-amber-600">
              Your email {user?.email} is not verified. Verify it to enable email-based features.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {step === 'idle' && (
          <Button onClick={handleSendOtp} disabled={loading} size="sm">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Send Verification OTP
          </Button>
        )}

        {step === 'otp' && (
          <div className="space-y-4">
            {message && (
              <p className="text-sm text-amber-700">{message}</p>
            )}

            <OtpInput
              length={otpConfig?.otpLength || 6}
              value={otp}
              onChange={setOtp}
              disabled={loading}
            />

            {expiryActive && (
              <p className="text-center text-xs text-gray-500">
                OTP expires in {Math.floor(expirySeconds / 60)}:{String(expirySeconds % 60).padStart(2, '0')}
              </p>
            )}

            <div className="flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResendOtp}
                disabled={loading || cooldownActive || resendsRemaining <= 0}
              >
                {cooldownActive
                  ? `Resend in ${cooldownSeconds}s`
                  : `Resend OTP (${resendsRemaining} left)`}
              </Button>

              <Button
                size="sm"
                onClick={handleVerifyOtp}
                disabled={loading || otp.length !== (otpConfig?.otpLength || 6)}
              >
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Verify
              </Button>
            </div>

            <button
              type="button"
              onClick={() => { setStep('idle'); setOtp('') }}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
