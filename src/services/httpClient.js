import axios from 'axios'
import { API_BASE_URL } from '@/constants/apiConstants'
import { storage } from '@/lib/storage'

// Public requests — no auth needed (login, register, etc.)
export const publicClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

// Authenticated requests — attaches access token
export const authClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

authClient.interceptors.request.use((config) => {
  const token = storage.getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Refresh requests — uses refresh token to get new access token
export const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})
