import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setupInterceptors } from '@/services/interceptors'
import { store } from '@/store'
import { storage } from '@/lib/storage'
import { isTokenExpired } from '@/lib/tokenUtils'
import { forceLogout } from '@/store/slices/authSlice'

let interceptorsSetup = false

export function useAuthInit() {
  const dispatch = useDispatch()
  const { isAuthenticated } = useSelector((state) => state.auth)

  useEffect(() => {
    // Set up interceptors once
    if (!interceptorsSetup) {
      setupInterceptors(store)
      interceptorsSetup = true
    }

    // Check if stored token is expired on mount
    const token = storage.getAccessToken()
    if (token && isTokenExpired(token)) {
      // Token expired and no silent refresh on init — force logout
      storage.clearAuth()
      dispatch(forceLogout())
    }
  }, [dispatch, isAuthenticated])
}
