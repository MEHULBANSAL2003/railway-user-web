import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { authService } from '@/services/authService'
import { storage } from '@/lib/storage'

// --- Thunks ---

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await authService.login(credentials)
      const { accessToken, refreshToken, ...user } = data.data
      storage.setAccessToken(accessToken)
      storage.setRefreshToken(refreshToken)
      storage.setUser(user)
      return { user, accessToken, refreshToken }
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
      return data.data
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
      const { accessToken, refreshToken, ...user } = data.data
      storage.setAccessToken(accessToken)
      storage.setRefreshToken(refreshToken)
      storage.setUser(user)
      return { user, accessToken, refreshToken }
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
      return data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to resend OTP.'
      )
    }
  }
)

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.forgotPassword(payload)
      return data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to send reset email.'
      )
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.resetPassword(payload)
      return data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Password reset failed.'
      )
    }
  }
)

export const resendResetOtp = createAsyncThunk(
  'auth/resendResetOtp',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authService.resendResetOtp(payload)
      return data.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.reason || 'Failed to resend OTP.'
      )
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout()
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
  // OTP flow state
  otpEmail: null,
  otpContext: null, // 'register' | 'resetPassword'
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setOtpFlow: (state, action) => {
      state.otpEmail = action.payload.email
      state.otpContext = action.payload.context
    },
    clearOtpFlow: (state) => {
      state.otpEmail = null
      state.otpContext = null
    },
    forceLogout: (state) => {
      state.user = null
      state.accessToken = null
      state.isAuthenticated = false
      state.otpEmail = null
      state.otpContext = null
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
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Register Initiate
    builder
      .addCase(registerInitiate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerInitiate.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registerInitiate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Register Verify OTP
    builder
      .addCase(registerVerifyOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerVerifyOtp.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.accessToken = action.payload.accessToken
        state.isAuthenticated = true
        state.otpEmail = null
        state.otpContext = null
      })
      .addCase(registerVerifyOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Register Resend OTP
    builder
      .addCase(registerResendOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(registerResendOtp.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(registerResendOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Forgot Password
    builder
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Reset Password
    builder
      .addCase(resetPassword.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Resend Reset OTP
    builder
      .addCase(resendResetOtp.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(resendResetOtp.fulfilled, (state) => {
        state.loading = false
      })
      .addCase(resendResetOtp.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

    // Logout
    builder
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.accessToken = null
        state.isAuthenticated = false
        state.otpEmail = null
        state.otpContext = null
      })
  },
})

export const { clearError, setOtpFlow, clearOtpFlow, forceLogout } = authSlice.actions
export default authSlice.reducer
