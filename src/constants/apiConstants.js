export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const AUTH_ENDPOINTS = {
  LOGIN: '/auth/user/login',
  REGISTER_INITIATE: '/auth/user/register/initiate',
  REGISTER_VERIFY_OTP: '/auth/user/register/otp/verify',
  REGISTER_RESEND_OTP: '/auth/user/register/otp/resend',
  REFRESH_TOKEN: '/auth/user/refresh',
  RESET_PASSWORD_INITIATE: '/auth/user/reset-password/initiate',
  RESET_PASSWORD_VERIFY: '/auth/user/reset-password/verify',
  RESET_PASSWORD_RESEND: '/auth/user/reset-password/resend',
}

export const USER_ENDPOINTS = {
  GET_PROFILE: '/users/me',
  LOGOUT: '/users/logout',
  CHANGE_PASSWORD: '/users/change-password',
  EMAIL_SEND_OTP: '/users/email/send-otp',
  EMAIL_VERIFY_OTP: '/users/email/verify-otp',
  EMAIL_RESEND_OTP: '/users/email/resend-otp',
  DEACTIVATE: '/users/deactivate',
}
