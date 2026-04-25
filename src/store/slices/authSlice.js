import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/services/authService'
import { storage } from '@/lib/storage'

// --- Helper: store tokens + profile from login/register/refresh response ---
function persistAuthData(responseData) {
  storage.setAccessToken(responseData.accessToken)
  storage.setRefreshToken(responseData.refreshToken)
  storage.setUser(responseData.profile)
}

// --- Thunks ---

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(credentials)
      persistAuthData(data.data)
      return data.data // { accessToken, refreshToken, tokenType, expiresIn, profile, reactivated }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Login failed. Please try again.'
      )
    }
  }
)

export const registerInitiate = createAsyncThunk(
  'auth/registerInitiate',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await authService.registerInitiate(userData)
      return data.data // { message, expiresInSeconds, otpLength, resendCooldownSeconds, resendsRemaining }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Registration failed. Please try again.'
      )
    }
  }
)

export const registerVerifyOtp = createAsyncThunk(
  'auth/registerVerifyOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.registerVerifyOtp(payload)
      persistAuthData(data.data)
      return data.data // { accessToken, refreshToken, tokenType, expiresIn, profile, reactivated }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'OTP verification failed.'
      )
    }
  }
)

export const registerResendOtp = createAsyncThunk(
  'auth/registerResendOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.registerResendOtp(payload)
      return data.data // { message, expiresInSeconds, otpLength, resendCooldownSeconds, resendsRemaining }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to resend OTP.'
      )
    }
  }
)

export const resetPasswordInitiate = createAsyncThunk(
  'auth/resetPasswordInitiate',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.resetPasswordInitiate(payload)
      return data.data // { message, expiresInSeconds, otpLength, resendCooldownSeconds, resendsRemaining }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to send reset OTP.'
      )
    }
  }
)

export const resetPasswordVerify = createAsyncThunk(
  'auth/resetPasswordVerify',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.resetPasswordVerify(payload)
      return data.data // null on success
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Password reset failed.'
      )
    }
  }
)

export const resetPasswordResend = createAsyncThunk(
  'auth/resetPasswordResend',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.resetPasswordResend(payload)
      return data.data // { message, expiresInSeconds, otpLength, resendCooldownSeconds, resendsRemaining }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to resend OTP.'
      )
    }
  }
)

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authService.getProfile()
      storage.setUser(data.data)
      return data.data // UserProfileResponse
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to fetch profile.'
      )
    }
  }
)

export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.changePassword(payload)
      return data.data // null on success
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to change password.'
      )
    }
  }
)

export const emailSendOtp = createAsyncThunk(
  'auth/emailSendOtp',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authService.emailSendOtp()
      return data.data // { message, expiresInSeconds, otpLength, resendCooldownSeconds, resendsRemaining }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to send verification OTP.'
      )
    }
  }
)

export const emailVerifyOtp = createAsyncThunk(
  'auth/emailVerifyOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.emailVerifyOtp(payload)
      return data.data // null on success
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'OTP verification failed.'
      )
    }
  }
)

export const emailResendOtp = createAsyncThunk(
  'auth/emailResendOtp',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await authService.emailResendOtp()
      return data.data // { message, expiresInSeconds, otpLength, resendCooldownSeconds, resendsRemaining }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to resend OTP.'
      )
    }
  }
)

export const deactivateAccount = createAsyncThunk(
  'auth/deactivateAccount',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.deactivate(payload)
      storage.clearAuth()
      return data.data // null on success
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to deactivate account.'
      )
    }
  }
)

export const deleteAccount = createAsyncThunk(
  'auth/deleteAccount',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.deleteAccount(payload)
      storage.clearAuth()
      return data.data // { message, recoveryPeriodDays }
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to delete account.'
      )
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      const refreshToken = storage.getRefreshToken()
      if (refreshToken) {
        await authService.logout(refreshToken)
      }
    } catch {
      // Logout from client even if API fails
    } finally {
      storage.clearAuth()
    }
  }
)

// --- Slice ---

const initialState = {
  user: storage.getUser(),
  accessToken: storage.getAccessToken(),
  isAuthenticated: !!storage.getAccessToken(),
  loading: false,
  error: null,
  // OTP flow state — driven entirely by backend response
  otpFlow: null, // { phone, identifier, context, message, otpLength, expiresInSeconds, resendCooldownSeconds, resendsRemaining }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setOtpFlow: (state, action) => {
      state.otpFlow = action.payload
    },
    clearOtpFlow: (state) => {
      state.otpFlow = null
    },
    forceLogout: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.otpFlow = null
    },
    updateEmailVerified: (state) => {
      if (state.user) {
        state.user.emailVerified = true
        storage.setUser(state.user)
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(login.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.profile
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Register Initiate — store OTP flow data from backend
    builder
      .addCase(registerInitiate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerInitiate.fulfilled, (state, action) => {
        state.loading = false
        // otpFlow gets phone set by the component via the thunk arg; backend gives us the rest
      })
      .addCase(registerInitiate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Register Verify OTP — auto-login on success
    builder
      .addCase(registerVerifyOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerVerifyOtp.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.profile
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
        state.otpFlow = null
      })
      .addCase(registerVerifyOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Register Resend OTP — update OTP config from backend
    builder
      .addCase(registerResendOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerResendOtp.fulfilled, (state, action) => {
        state.loading = false
        if (state.otpFlow) {
          state.otpFlow.resendsRemaining = action.payload.resendsRemaining
          state.otpFlow.resendCooldownSeconds = action.payload.resendCooldownSeconds
          state.otpFlow.expiresInSeconds = action.payload.expiresInSeconds
          state.otpFlow.otpLength = action.payload.otpLength
          state.otpFlow.message = action.payload.message
        }
      })
      .addCase(registerResendOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Reset Password Initiate
    builder
      .addCase(resetPasswordInitiate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPasswordInitiate.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPasswordInitiate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Reset Password Verify
    builder
      .addCase(resetPasswordVerify.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPasswordVerify.fulfilled, (state) => {
        state.loading = false
        state.otpFlow = null
      })
      .addCase(resetPasswordVerify.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Reset Password Resend — update OTP config from backend
    builder
      .addCase(resetPasswordResend.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPasswordResend.fulfilled, (state, action) => {
        state.loading = false
        if (state.otpFlow) {
          state.otpFlow.resendsRemaining = action.payload.resendsRemaining
          state.otpFlow.resendCooldownSeconds = action.payload.resendCooldownSeconds
          state.otpFlow.expiresInSeconds = action.payload.expiresInSeconds
          state.otpFlow.otpLength = action.payload.otpLength
          state.otpFlow.message = action.payload.message
        }
      })
      .addCase(resetPasswordResend.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Fetch Profile
    builder
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.user = action.payload
      })

    // Deactivate Account
    builder
      .addCase(deactivateAccount.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.otpFlow = null
      })

    // Delete Account
    builder
      .addCase(deleteAccount.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.otpFlow = null
      })

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.otpFlow = null
      })
  },
})

export const { clearError, setOtpFlow, clearOtpFlow, forceLogout, updateEmailVerified } = authSlice.actions
export default authSlice.reducer
