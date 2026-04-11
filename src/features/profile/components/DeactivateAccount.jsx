import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2, AlertTriangle } from 'lucide-react'
import { deactivateAccount } from '@/store/slices/authSlice'
import { ROUTES } from '@/constants/appConstants'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import PasswordInput from '@/components/PasswordInput'

export default function DeactivateAccount() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleDeactivate = async (e) => {
    e.preventDefault()
    if (!password.trim()) {
      setError('Password is required')
      return
    }

    setError('')
    setLoading(true)
    const result = await dispatch(deactivateAccount({ password }))
    setLoading(false)

    if (deactivateAccount.fulfilled.match(result)) {
      toast.success('Your account has been deactivated. You can reactivate it by logging in again.')
      navigate(ROUTES.LOGIN)
    } else {
      setError(result.payload || 'Failed to deactivate account')
      toast.error(result.payload || 'Failed to deactivate account')
    }
  }

  return (
    <Card className="border-red-200">
      <CardHeader>
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div>
            <CardTitle className="text-base text-red-700">Deactivate Account</CardTitle>
            <CardDescription>
              Deactivating your account will disable your profile. Your data will be retained and you can reactivate by logging in again.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {!showConfirm ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowConfirm(true)}
          >
            Deactivate Account
          </Button>
        ) : (
          <form onSubmit={handleDeactivate} className="max-w-md space-y-4">
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-700">
                Are you sure? Enter your password to confirm deactivation.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deactivatePassword">Password</Label>
              <PasswordInput
                id="deactivatePassword"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
              />
              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}
            </div>

            <div className="flex gap-3">
              <Button type="submit" variant="destructive" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                Confirm Deactivation
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => { setShowConfirm(false); setPassword(''); setError('') }}
                disabled={loading}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
