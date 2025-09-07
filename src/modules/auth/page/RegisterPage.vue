<!-- src/modules/auth/page/RegisterPage.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full max-w-sm sm:max-w-md mx-auto">
      <!-- Logo and Title -->
      <div class="text-center mb-6 sm:mb-8">
        <div class="flex justify-center mb-3 sm:mb-4">
          <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <span class="text-white font-bold text-xl sm:text-2xl">🐾</span>
          </div>
        </div>
        <h2 class="text-2xl sm:text-3xl font-bold text-gray-900">
          Tạo tài khoản mới
        </h2>
        <p class="mt-2 text-sm text-gray-600">Gia nhập cộng đồng chăm sóc thú y chuyên nghiệp</p>
      </div>
      
      <!-- Registration Form Card -->
      <div class="bg-white rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100">
        <form class="space-y-5 sm:space-y-6" @submit.prevent="handleRegister">
          <div class="space-y-4 sm:space-y-5">
            <!-- Full Name Field -->
            <div>
              <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên
              </label>
              <div class="relative">
                <input
                  id="fullName"
                  v-model="form.fullName"
                  name="fullName"
                  type="text"
                  required
                  :class="[
                    'block w-full px-4 py-2.5 sm:py-3 border rounded-lg shadow-sm transition-all duration-200',
                    'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                    'placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200',
                    'hover:border-gray-300 focus:bg-white text-sm sm:text-base'
                  ]"
                  placeholder="Nguyễn Văn A"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
            </div>

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
                  type="password"
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

            <!-- Confirm Password Field -->
            <div>
              <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu
              </label>
              <div class="relative">
                <input
                  id="confirmPassword"
                  v-model="form.confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  :class="[
                    'block w-full px-4 py-2.5 sm:py-3 border rounded-lg shadow-sm transition-all duration-200',
                    'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                    'placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200',
                    'hover:border-gray-300 focus:bg-white text-sm sm:text-base'
                  ]"
                  placeholder="••••••••"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Phone Field -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Số điện thoại
              </label>
              <div class="relative">
                <input
                  id="phone"
                  v-model="form.phone"
                  name="phone"
                  type="tel"
                  required
                  :class="[
                    'block w-full px-4 py-2.5 sm:py-3 border rounded-lg shadow-sm transition-all duration-200',
                    'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                    'placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200',
                    'hover:border-gray-300 focus:bg-white text-sm sm:text-base'
                  ]"
                  placeholder="0123 456 789"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Address Field -->
            <div>
              <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                Địa chỉ
              </label>
              <div class="relative">
                <input
                  id="address"
                  v-model="form.address"
                  name="address"
                  type="text"
                  required
                  :class="[
                    'block w-full px-4 py-2.5 sm:py-3 border rounded-lg shadow-sm transition-all duration-200',
                    'focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500',
                    'placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200',
                    'hover:border-gray-300 focus:bg-white text-sm sm:text-base'
                  ]"
                  placeholder="123 Đường ABC, Phường XYZ"
                />
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <!-- Terms and Conditions -->
          <div class="flex items-start">
            <div class="flex items-center h-5">
              <input
                id="terms"
                v-model="form.agreeToTerms"
                name="terms"
                type="checkbox"
                required
                class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded transition-colors duration-200"
              />
            </div>
            <div class="ml-3 text-sm">
              <label for="terms" class="text-gray-600 select-none">
                Tôi đồng ý với 
                <a href="#" class="font-medium text-emerald-600 hover:text-emerald-500">Điều khoản dịch vụ</a>
                và 
                <a href="#" class="font-medium text-emerald-600 hover:text-emerald-500">Chính sách bảo mật</a>
              </label>
            </div>
          </div>

          <!-- Error message -->
          <div v-if="authStore.error" class="rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4">
            <div class="text-sm font-medium text-red-800">
              {{ authStore.error }}
            </div>
          </div>

          <!-- Validation errors -->
          <div v-if="validationErrors.length > 0" class="rounded-lg bg-red-50 border border-red-200 p-3 sm:p-4">
            <ul class="text-sm text-red-700 list-disc list-inside space-y-1">
              <li v-for="error in validationErrors" :key="error">{{ error }}</li>
            </ul>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="authStore.loading || validationErrors.length > 0 || !form.agreeToTerms"
            :class="[
              'w-full flex justify-center items-center px-4 py-2.5 sm:py-3 border border-transparent rounded-lg shadow-sm',
              'text-sm sm:text-base font-medium text-white transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500',
              'transform hover:scale-[1.02] active:scale-[0.98]',
              authStore.loading || validationErrors.length > 0 || !form.agreeToTerms
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl'
            ]"
          >
            <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span v-if="authStore.loading">Đang đăng ký...</span>
            <span v-else>Đăng ký</span>
          </button>
        </form>
      </div>

      <!-- Login Link -->
      <div class="mt-6 sm:mt-8 text-center">
        <p class="text-sm text-gray-600">
          Đã có tài khoản?
          <router-link
            to="/auth/login"
            class="font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
          >
            Đăng nhập ngay
          </router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const showPassword = ref(false)
const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  address: '',
  phone: '',
  agreeToTerms: false
})

// Form validation
const validationErrors = computed(() => {
  const errors = []
  
  if (form.value.password && form.value.password.length < 6) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự')
  }
  
  if (form.value.password && form.value.password.length > 15) {
    errors.push('Mật khẩu không được quá 15 ký tự')
  }
  
  if (form.value.password && form.value.confirmPassword && 
      form.value.password !== form.value.confirmPassword) {
    errors.push('Mật khẩu xác nhận không khớp')
  }
  
  return errors
})

const handleRegister = async () => {
  if (validationErrors.value.length > 0) {
    return
  }
  
  try {
    const { confirmPassword, ...registerData } = form.value
    
    await authStore.register(registerData)
    
    // Redirect to verification page with email parameter
    router.push({
      name: 'VerifyAccount',
      query: { email: registerData.email }
    })
  } catch (error) {
    console.error('Registration error:', error)
  }
}

// Clear error when component mounts
onMounted(() => {
  authStore.clearError()
})
</script>