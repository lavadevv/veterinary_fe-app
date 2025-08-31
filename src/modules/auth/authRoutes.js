// src/modules/auth/router/index.js
import LoginPage from './page/LoginPage.vue'
import RegisterPage from './page/RegisterPage.vue'
import VerifyAccountPage from './page/VerifyAccountPage.vue'
import ForgotPasswordPage from './page/ForgotPasswordPage.vue'
import BlankLayout from '@/layouts/BlankLayout.vue'

export const authRoutes = [
  {
    path: '/auth',
    name: 'Auth',
    component: BlankLayout,
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginPage,
        meta: {
          requiresGuest: true, // Only allow access if not authenticated
          title: 'Đăng nhập'
        }
      },
      {
        path: 'register',
        name: 'Register',
        component: RegisterPage,
        meta: {
          requiresGuest: true,
          title: 'Đăng ký'
        }
      },
      {
        path: 'verify-account',
        name: 'VerifyAccount',
        component: VerifyAccountPage,
        meta: {
          requiresGuest: true,
          title: 'Xác thực tài khoản'
        }
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPasswordPage,
        meta: {
          requiresGuest: true,
          title: 'Quên mật khẩu'
        }
      }
    ]
  }
]

// Navigation guards
export const setupAuthGuards = (router) => {
  router.beforeEach(async (to, from, next) => {
    const { useAuthStore } = await import('./store/auth')
    const authStore = useAuthStore()
    
    // Initialize auth state if not already done
    if (authStore.token && !authStore.isAuthenticated) {
      try {
        await authStore.initializeAuth()
      } catch (error) {
        console.error('Auth initialization failed:', error)
      }
    }
    
    // Check if route requires authentication
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/auth/login')
      return
    }
    
    // Check if route requires guest (not authenticated)
    if (to.meta.requiresGuest && authStore.isAuthenticated) {
      next('/audit') // Redirect to dashboard or home page
      return
    }
    
    // Check role-based access
    if (to.meta.requiresRole && !authStore.hasRole(to.meta.requiresRole)) {
      next('/unauthorized') // Redirect to unauthorized page
      return
    }
    
    next()
  })
}

// Auth composable for components
import { useAuthStore } from "./store/auth"

export const useAuth = () => {
  const authStore = useAuthStore()
  
  return {
    user: authStore.user,
    isAuthenticated: authStore.isAuthenticated,
    isAdmin: authStore.isAdmin,
    loading: authStore.loading,
    error: authStore.error,
    login: authStore.login,
    logout: authStore.logout,
    register: authStore.register,
    hasRole: authStore.hasRole,
    clearError: authStore.clearError,
  }
}