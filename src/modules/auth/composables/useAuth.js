import { computed } from 'vue'
import { useAuthStore } from '../store/auth'

export function useAuth() {
  const authStore = useAuthStore()
  
  return {
    // State
    user: computed(() => authStore.user),
    token: computed(() => authStore.token),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    loading: computed(() => authStore.loading),
    error: computed(() => authStore.error),
    
    // Getters
    isAdmin: computed(() => authStore.isAdmin),
    userFullName: computed(() => authStore.userFullName),
    userRoles: computed(() => authStore.userRoles),
    
    // Actions
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register,
    verifyAccount: authStore.verifyAccount,
    regenerateOtp: authStore.regenerateOtp,
    forgotPassword: authStore.forgotPassword,
    getProfile: authStore.getProfile,
    updateProfile: authStore.updateProfile,
    initializeAuth: authStore.initializeAuth,
    hasRole: authStore.hasRole,
    clearError: authStore.clearError
  }
}