// src/modules/auth/store/auth.js
import { defineStore } from "pinia"
import {
  login,
  register,
  verifyAccount,
  regenerateOtp,
  forgotPassword,
  getProfile,
} from "../services/auth.service"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: JSON.parse(localStorage.getItem("user")) || null, // Lấy user từ localStorage nếu có
    token: localStorage.getItem("token") || null,
    isAuthenticated: !!localStorage.getItem("token"),
    loading: false,
    error: null,
  }),

  getters: {
    userFullName: (state) => state.user?.fullName || "User",
    userRoles: (state) => state.user?.roles || [],
    isAdmin: (state) => state.user?.roles?.includes("ADMIN") || false,
    hasRole: (state) => (roleName) => state.user?.roles?.includes(roleName),
    hasAnyRole: (state) => (roleNames = []) => {
      if (!state.user?.roles?.length) return false
      return state.user.roles.some(role => roleNames.includes(role))
    },
    hasPermission: (state) => (allowedRoles = []) => {
      if (!state.user?.roles?.length) return false
      return state.user.roles.some(role => allowedRoles.includes(role))
    }
  },

  actions: {
    // Login
    async login(credentials) {
      this.loading = true
      this.error = null
      try {
        const response = await login(credentials)
        if (response.data.success) {
          const { token, ...userData } = response.data.data

          this.token = token
          localStorage.setItem("token", token)
          this.isAuthenticated = true

          this.user = {
            id: userData.id,
            name: userData.name || userData.fullName,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            roles: userData.roles || [],
            avatar: userData.avatar || "",
          }

          localStorage.setItem("user", JSON.stringify(this.user))
          return response.data
        } else {
          throw new Error(response.data.error.message || "Login failed")
        }
      } catch (error) {
        this.error = error.response?.data?.error || error.message || "Login failed"
        throw error
      } finally {
        this.loading = false
      }
    },

    // Register
    async register(userData) {
      this.loading = true
      this.error = null
      try {
        const response = await register(userData)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || error.message || "Registration failed"
        throw error
      } finally {
        this.loading = false
      }
    },

    // Verify account
    async verifyAccount(data) {
      this.loading = true
      this.error = null
      try {
        const response = await verifyAccount(data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || error.message || "Verification failed"
        throw error
      } finally {
        this.loading = false
      }
    },

    // Regenerate OTP
    async regenerateOtp(data) {
      this.loading = true
      this.error = null
      try {
        const response = await regenerateOtp(data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || error.message || "OTP regeneration failed"
        throw error
      } finally {
        this.loading = false
      }
    },

    // Forgot password
    async forgotPassword(data) {
      this.loading = true
      this.error = null
      try {
        const response = await forgotPassword(data)
        return response.data
      } catch (error) {
        this.error = error.response?.data?.error || error.message || "Password reset failed"
        throw error
      } finally {
        this.loading = false
      }
    },

    // Get profile
    async getProfile() {
      this.loading = true
      this.error = null
      try {
        const response = await getProfile()
        if (response.data.success) {
          const userData = response.data.data
          this.user = {
            id: userData.id,
            name: userData.name || userData.fullName,
            fullName: userData.fullName,
            email: userData.email,
            phone: userData.phone,
            roles: userData.roles || [],
            avatar: userData.avatar || "",
          }
          this.isAuthenticated = true
          localStorage.setItem("user", JSON.stringify(this.user))
          return response.data
        } else {
          throw new Error(response.data.error || "Failed to get profile")
        }
      } catch (error) {
        this.error = error.response?.data?.error || error.message || "Failed to get profile"
        if (error.response?.status === 401) this.logout()
        throw error
      } finally {
        this.loading = false
      }
    },

    // Logout
    logout() {
      this.user = null
      this.token = null
      this.isAuthenticated = false
      this.error = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
    },

    // Initialize auth từ localStorage hoặc fetch profile
    async initializeAuth() {
      const token = localStorage.getItem("token")
      const user = localStorage.getItem("user")

      if (token) {
        this.token = token
        this.isAuthenticated = true
        if (user) {
          this.user = JSON.parse(user)
        } else {
          try {
            await this.getProfile()
          } catch (error) {
            console.error("Failed to initialize auth:", error)
            this.logout()
          }
        }
      }
    },

    // Xóa lỗi
    clearError() {
      this.error = null
    },
  },
})
