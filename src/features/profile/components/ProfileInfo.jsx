import { useSelector } from 'react-redux'
import { User, Mail, Phone, Calendar, Shield, CheckCircle, XCircle } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function InfoRow({ icon: Icon, label, value, badge }) {
  return (
    <div className="flex items-start gap-3 py-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-gray-900">{value || '—'}</p>
          {badge}
        </div>
      </div>
    </div>
  )
}

function VerifiedBadge({ verified }) {
  return verified ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
      <CheckCircle className="h-3 w-3" /> Verified
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
      <XCircle className="h-3 w-3" /> Not Verified
    </span>
  )
}

export default function ProfileInfo() {
  const { user } = useSelector((state) => state.auth)

  if (!user) return null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary">
            <User className="h-7 w-7" />
          </div>
          <div>
            <CardTitle className="text-xl">{user.fullName}</CardTitle>
            <p className="text-sm text-gray-500">@{user.username}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-gray-100">
          <InfoRow
            icon={Mail}
            label="Email"
            value={user.email}
            badge={<VerifiedBadge verified={user.emailVerified} />}
          />
          <InfoRow
            icon={Phone}
            label="Phone"
            value={user.countryCode ? `${user.countryCode} ${user.phone}` : user.phone}
            badge={<VerifiedBadge verified={user.phoneVerified} />}
          />
          <InfoRow
            icon={Shield}
            label="Gender"
            value={
              user.gender === 'M' ? 'Male' :
              user.gender === 'F' ? 'Female' :
              user.gender === 'OTHER' ? 'Other' : null
            }
          />
          <InfoRow
            icon={Calendar}
            label="Member Since"
            value={user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric', month: 'long', day: 'numeric',
            }) : null}
          />
        </div>
      </CardContent>
    </Card>
  )
}
