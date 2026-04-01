import { useState, useEffect, useCallback, useRef } from 'react'

export function useCountdown(initialSeconds) {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isActive, setIsActive] = useState(initialSeconds > 0)
  const durationRef = useRef(initialSeconds)

  useEffect(() => {
    if (!isActive || seconds <= 0) return

    const interval = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          setIsActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isActive, seconds])

  const restart = useCallback((newDuration) => {
    const dur = newDuration ?? durationRef.current
    durationRef.current = dur
    setSeconds(dur)
    setIsActive(dur > 0)
  }, [])

  return { seconds, isActive, restart }
}
