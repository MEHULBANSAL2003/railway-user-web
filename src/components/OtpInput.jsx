import { useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

export default function OtpInput({ length = 6, value = '', onChange, disabled }) {
  const inputsRef = useRef([])

  const handleChange = useCallback(
    (index, e) => {
      const val = e.target.value
      if (val && !/^\d$/.test(val)) return

      const otpArray = value.split('')
      otpArray[index] = val
      const newOtp = otpArray.join('').slice(0, length)
      onChange(newOtp)

      // Auto-focus next input
      if (val && index < length - 1) {
        inputsRef.current[index + 1]?.focus()
      }
    },
    [value, onChange, length]
  )

  const handleKeyDown = useCallback(
    (index, e) => {
      if (e.key === 'Backspace' && !value[index] && index > 0) {
        inputsRef.current[index - 1]?.focus()
      }
    },
    [value]
  )

  const handlePaste = useCallback(
    (e) => {
      e.preventDefault()
      const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length)
      onChange(pasted)

      const focusIndex = Math.min(pasted.length, length - 1)
      inputsRef.current[focusIndex]?.focus()
    },
    [onChange, length]
  )

  return (
    <div className="flex justify-center gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            'h-12 w-12 rounded-md border border-gray-300 bg-white text-center text-lg font-semibold',
            'focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50'
          )}
        />
      ))}
    </div>
  )
}
