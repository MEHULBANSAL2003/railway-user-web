export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/user/login',
  REGISTER_INITIATE: '/auth/user/register/initiate',
  REGISTER_VERIFY_OTP: '/auth/user/register/otp/verify',
  REGISTER_RESEND_OTP: '/auth/user/register/otp/resend',
  REFRESH_TOKEN: '/auth/user/refresh',
  FORGOT_PASSWORD: '/auth/user/reset-password/initiate',
  RESET_PASSWORD: '/auth/user/reset-password/verify',
  RESEND_RESET_OTP: '/auth/user/reset-password/resend',
}

export const USER_ENDPOINTS = {
  LOGOUT: '/users/logout',
  GET_PROFILE: '/users/me',
}
