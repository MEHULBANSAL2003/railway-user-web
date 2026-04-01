import { z } from 'zod/v4'

export const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email, phone, or username is required')
    .max(255),
  password: z
    .string()
    .min(1, 'Password is required'),
})

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, 'Username is required')
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters')
    .regex(/^[a-zA-Z][a-zA-Z0-9_]{2,29}$/, 'Must start with a letter. Only letters, numbers, and underscores allowed.'),
  fullName: z
    .string()
    .min(1, 'Full name is required')
    .max(200, 'Full name must be at most 200 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .regex(/^\d{10}$/, 'Please enter a valid 10-digit phone number'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be at most 64 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one digit')
    .regex(/[@#$%^&+=!?_-]/, 'Must contain at least one special character (@#$%^&+=!?_-)'),
  confirmPassword: z
    .string()
    .min(1, 'Confirm password is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const forgotPasswordSchema = z.object({
  identifier: z
    .string()
    .min(1, 'Email, phone, or username is required')
    .max(255),
})

export const resetPasswordSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, 'OTP must be 6 digits'),
  newPassword: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(64, 'Password must be at most 64 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one digit')
    .regex(/[@#$%^&+=!?_-]/, 'Must contain at least one special character (@#$%^&+=!?_-)'),
  confirmPassword: z
    .string()
    .min(1, 'Confirm password is required'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})
