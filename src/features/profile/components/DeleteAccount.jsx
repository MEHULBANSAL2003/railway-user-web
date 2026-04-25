import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Loader2, Trash2, AlertTriangle } from 'lucide-react'
import { deleteAccount } from '@/store/slices/authSlice'
import { ROUTES } from '@/constants/appConstants'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog'
import PasswordInput from '@/components/PasswordInput'

export default function DeleteAccount() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [showDialog, setShowDialog] = useState(false)
  const [password, setPassword] = useState('')
  const [deleteReason, setDeleteReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const handleDeleteAccount = async (e) => {
    e.preventDefault()

    // Validation
    const newErrors = {}
    if (!password.trim()) {
      newErrors.password = 'Password is required'
    }
    if (!deleteReason.trim()) {
      newErrors.deleteReason = 'Reason is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    setLoading(true)
    const result = await dispatch(deleteAccount({ password, deleteReason }))
    setLoading(false)

    if (deleteAccount.fulfilled.match(result)) {
      const { message, recoveryPeriodDays } = result.payload
      toast.success(
        message || `Account deletion requested. You have ${recoveryPeriodDays} days to cancel this request.`,
        { duration: 5000 }
      )
      navigate(ROUTES.LOGIN)
    } else {
      const errorMessage = result.payload || 'Failed to delete account'
      setErrors({ submit: errorMessage })
      toast.error(errorMessage)
    }
  }

  const resetForm = () => {
    setPassword('')
    setDeleteReason('')
    setErrors({})
  }

  return (
    <>
      <Card className="border-red-300 bg-red-50/30">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trash2 className="h-5 w-5 text-red-600" />
            <div>
              <CardTitle className="text-base text-red-800">Delete Account</CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data. This action cannot be undone after the recovery period.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowDialog(true)}
            className="bg-red-700 hover:bg-red-800"
          >
            Delete Account Permanently
          </Button>
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={(open) => {
        setShowDialog(open)
        if (!open) resetForm()
      }}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogClose onClick={() => setShowDialog(false)} />

          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <DialogTitle className="text-xl text-red-900">Delete Your Account?</DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <h4 className="font-semibold text-red-900 mb-2">⚠️ Warning: This is a serious action</h4>
              <ul className="space-y-2 text-sm text-red-800">
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>All your personal data will be permanently deleted</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Your booking history and travel records will be removed</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>All saved preferences and settings will be lost</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>Active bookings or tickets may be affected</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">•</span>
                  <span>You will have a limited recovery period to cancel this request</span>
                </li>
              </ul>
            </div>

            <form onSubmit={handleDeleteAccount} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="deletePassword" className="text-gray-900">
                  Confirm Your Password <span className="text-red-500">*</span>
                </Label>
                <PasswordInput
                  id="deletePassword"
                  placeholder="Enter your password to confirm"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    setErrors({ ...errors, password: '' })
                  }}
                  disabled={loading}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="deleteReason" className="text-gray-900">
                  Why are you leaving? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="deleteReason"
                  placeholder="Please tell us why you want to delete your account. Your feedback helps us improve."
                  value={deleteReason}
                  onChange={(e) => {
                    setDeleteReason(e.target.value)
                    setErrors({ ...errors, deleteReason: '' })
                  }}
                  disabled={loading}
                  rows={4}
                  maxLength={500}
                />
                <div className="flex justify-between">
                  {errors.deleteReason ? (
                    <p className="text-sm text-red-500">{errors.deleteReason}</p>
                  ) : (
                    <span className="text-xs text-gray-500">Help us understand your decision</span>
                  )}
                  <span className="text-xs text-gray-400">{deleteReason.length}/500</span>
                </div>
              </div>

              {errors.submit && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-600">{errors.submit}</p>
                </div>
              )}

              <DialogFooter className="gap-3 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowDialog(false)
                    resetForm()
                  }}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={loading}
                  className="bg-red-700 hover:bg-red-800"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  Yes, Delete My Account
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
