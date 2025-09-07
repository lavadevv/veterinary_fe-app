<!-- src/modules/auth/page/LoginPage.vue -->
<template>
  <div class="w-full max-w-sm sm:max-w-md mx-auto px-4 sm:px-0">
    <!-- Logo and Title -->
    <div class="text-center mb-6 sm:mb-8">
      <div class="flex justify-center mb-3 sm:mb-4">
        <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <span class="text-white font-bold text-xl sm:text-2xl">🐾</span>
        </div>
      </div>
      <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">Chào mừng trở lại</h2>
      <p class="mt-2 text-sm text-gray-600">Đăng nhập để tiếp tục sử dụng The Pro</p>
    </div>
    
    <!-- Login Form Card -->
    <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
      <form @submit.prevent="handleLogin" class="space-y-5 sm:space-y-6">
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ email
          </label>
          <div class="relative">
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              :class="[
                'block w-full px-4 py-2.5 sm:py-3 border rounded-lg shadow-sm transition-all duration-200',
                'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                'placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200',
                'hover:border-gray-300 focus:bg-white text-sm sm:text-base'
              ]"
              placeholder="your@email.com"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>
        </div>
        
        <!-- Password Field -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Mật khẩu
          </label>
          <div class="relative">
            <input
              id="password"
              v-model="form.password"
              name="password"
              :type="showPassword ? 'text' : 'password'"
              required
              :class="[
                'block w-full px-4 py-2.5 sm:py-3 border rounded-lg shadow-sm transition-all duration-200',
                'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                'placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200',
                'hover:border-gray-300 focus:bg-white pr-12 text-sm sm:text-base'
              ]"
              placeholder="••••••••"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <svg v-if="showPassword" class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
              <svg v-else class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Remember Me and Forgot Password -->
        <div class="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-colors duration-200"
            />
            <label for="remember-me" class="ml-3 block text-sm text-gray-700 select-none">
              Ghi nhớ đăng nhập
            </label>
          </div>

          <router-link
            to="/auth/forgot-password"
            class="text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200 text-center sm:text-left"
          >
            Quên mật khẩu?
          </router-link>
        </div>

        <!-- Error Alert -->
        <div v-if="authStore.error" class="rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-4 w-4 sm:h-5 sm:w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-red-800">
                {{ authStore.error }}
              </p>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.loading"
          :class="[
            'w-full flex justify-center items-center px-4 py-2.5 sm:py-3 border border-transparent rounded-lg shadow-sm',
            'text-sm sm:text-base font-medium text-white transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
            'transform hover:scale-[1.02] active:scale-[0.98]',
            authStore.loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
          ]"
        >
          <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="authStore.loading">Đang đăng nhập...</span>
          <span v-else>Đăng nhập</span>
        </button>
      </form>

      <!-- Divider -->
      <div class="mt-6 sm:mt-8">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-200" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-white text-gray-500">Hoặc tiếp tục với</span>
          </div>
        </div>
      </div>

      <!-- Social Login Buttons -->
      <div class="mt-6 grid grid-cols-2 gap-3 sm:gap-4">
        <button
          type="button"
          class="group relative w-full inline-flex justify-center items-center py-2 sm:py-2.5 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
        >
          <svg class="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="ml-2 hidden sm:inline">Google</span>
        </button>

        <button
          type="button"
          class="group relative w-full inline-flex justify-center items-center py-2 sm:py-2.5 px-4 border border-gray-300 rounded-lg bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
        >
          <svg class="h-4 w-4 sm:h-5 sm:w-5" fill="#1877f2" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
          <span class="ml-2 hidden sm:inline">Facebook</span>
        </button>
      </div>
    </div>

    <!-- Register Link -->
    <div class="mt-6 sm:mt-8 text-center">
      <p class="text-sm text-gray-600">
        Chưa có tài khoản?
        <router-link
          to="/auth/register"
          class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
        >
          Đăng ký ngay
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const form = ref({
  email: '',
  password: '',
  rememberMe: false
})

const handleLogin = async () => {
  try {
    await authStore.login({
      email: form.value.email,
      password: form.value.password
    })
    
    // Redirect to dashboard or home page after successful login
    router.push('/audit')
  } catch (error) {
    console.error('Login error:', error)
  }
}

// Clear error when component mounts
onMounted(() => {
  authStore.clearError()
})
</script>
