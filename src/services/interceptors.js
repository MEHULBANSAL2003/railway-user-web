import { authClient, refreshClient } from './httpClient'
import { AUTH_ENDPOINTS } from '@/constants/apiConstants'
import { storage } from '@/lib/storage'

let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error)
    } else {
      resolve(token)
    }
  })
  failedQueue = []
}

export function setupInterceptors(store) {
  authClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error)
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`
          return authClient(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const refreshToken = storage.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const { data } = await refreshClient.post(AUTH_ENDPOINTS.REFRESH_TOKEN, {
          refreshToken,
        })

        const responseData = data.data
        storage.setAccessToken(responseData.accessToken)
        storage.setRefreshToken(responseData.refreshToken)
        if (responseData.profile) {
          storage.setUser(responseData.profile)
        }

        processQueue(null, responseData.accessToken)

        originalRequest.headers.Authorization = `Bearer ${responseData.accessToken}`
        return authClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        storage.clearAuth()
        store.dispatch({ type: 'auth/forceLogout' })
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }
  )
}
