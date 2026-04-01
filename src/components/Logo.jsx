import { Train } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Logo({ className, size = 'default' }) {
  const sizes = {
    sm: { icon: 'h-6 w-6', text: 'text-lg' },
    default: { icon: 'h-8 w-8', text: 'text-xl' },
    lg: { icon: 'h-10 w-10', text: 'text-2xl' },
  }

  const s = sizes[size]

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center justify-center rounded-lg bg-primary p-2">
        <Train className={cn(s.icon, 'text-white')} />
      </div>
      <span className={cn(s.text, 'font-bold text-gray-900')}>
        RailBooking
      </span>
    </div>
  )
}
