import { useAuthStore } from '../store/auth'

export const authMiddleware = async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialize auth if needed
  if (authStore.token && !authStore.isAuthenticated) {
    try {
      await authStore.initializeAuth()
    } catch (error) {
      console.error('Auth initialization failed:', error)
      authStore.logout()
    }
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/auth/login')
  }
  
  // Check if route requires guest (not authenticated)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    return next('/dashboard')
  }
  
  // Check role-based access
  if (to.meta.requiresRole) {
    const requiredRole = to.meta.requiresRole
    if (!authStore.hasRole(requiredRole)) {
      return next('/unauthorized')
    }
  }
  
  // Check multiple roles
  if (to.meta.requiresRoles) {
    const requiredRoles = to.meta.requiresRoles
    const hasAnyRole = requiredRoles.some(role => authStore.hasRole(role))
    if (!hasAnyRole) {
      return next('/unauthorized')
    }
  }
  
  next()
}
