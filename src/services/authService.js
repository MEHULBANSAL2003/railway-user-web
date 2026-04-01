import { publicClient, authClient } from './httpClient'
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '@/constants/apiConstants'

export const authService = {
  login: (credentials) =>
    publicClient.post(AUTH_ENDPOINTS.LOGIN, credentials),

  registerInitiate: (userData) =>
    publicClient.post(AUTH_ENDPOINTS.REGISTER_INITIATE, userData),

  registerVerifyOtp: (payload) =>
    publicClient.post(AUTH_ENDPOINTS.REGISTER_VERIFY_OTP, payload),

  registerResendOtp: (payload) =>
    publicClient.post(AUTH_ENDPOINTS.REGISTER_RESEND_OTP, payload),

  forgotPassword: (payload) =>
    publicClient.post(AUTH_ENDPOINTS.FORGOT_PASSWORD, payload),

  resetPassword: (payload) =>
    publicClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, payload),

  resendResetOtp: (payload) =>
    publicClient.post(AUTH_ENDPOINTS.RESEND_RESET_OTP, payload),

  logout: () =>
    authClient.post(USER_ENDPOINTS.LOGOUT),

  getProfile: () =>
    authClient.get(USER_ENDPOINTS.GET_PROFILE),
}
