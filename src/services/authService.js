import { publicClient, authClient } from './httpClient'
import { AUTH_ENDPOINTS, USER_ENDPOINTS } from '@/constants/apiConstants'

export const authService = {
  // --- Public (no auth) ---
  login: (credentials) =>
    publicClient.post(AUTH_ENDPOINTS.LOGIN, credentials),

  registerInitiate: (userData) =>
    publicClient.post(AUTH_ENDPOINTS.REGISTER_INITIATE, userData),

  registerVerifyOtp: (payload) =>
    publicClient.post(AUTH_ENDPOINTS.REGISTER_VERIFY_OTP, payload),

  registerResendOtp: (payload) =>
    publicClient.post(AUTH_ENDPOINTS.REGISTER_RESEND_OTP, payload),

  resetPasswordInitiate: (payload) =>
    publicClient.post(AUTH_ENDPOINTS.RESET_PASSWORD_INITIATE, payload),

  resetPasswordVerify: (payload) =>
    publicClient.post(AUTH_ENDPOINTS.RESET_PASSWORD_VERIFY, payload),

  resetPasswordResend: (payload) =>
    publicClient.post(AUTH_ENDPOINTS.RESET_PASSWORD_RESEND, payload),

  // --- Authenticated ---
  getProfile: () =>
    authClient.get(USER_ENDPOINTS.GET_PROFILE),

  logout: (refreshToken) =>
    authClient.post(USER_ENDPOINTS.LOGOUT, { refreshToken }),

  changePassword: (payload) =>
    authClient.post(USER_ENDPOINTS.CHANGE_PASSWORD, payload),

  emailSendOtp: () =>
    authClient.post(USER_ENDPOINTS.EMAIL_SEND_OTP),

  emailVerifyOtp: (payload) =>
    authClient.post(USER_ENDPOINTS.EMAIL_VERIFY_OTP, payload),

  emailResendOtp: () =>
    authClient.post(USER_ENDPOINTS.EMAIL_RESEND_OTP),

  deactivate: (payload) =>
    authClient.post(USER_ENDPOINTS.DEACTIVATE, payload),

  deleteAccount: (payload) =>
    authClient.post(USER_ENDPOINTS.DELETE_ACCOUNT, payload),
}
