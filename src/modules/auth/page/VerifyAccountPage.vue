<!-- src/modules/auth/page/VerifyAccountPage.vue -->
<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Logo and Title -->
    <div class="text-center mb-8">
      <div class="flex justify-center mb-4">
        <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <span class="text-white font-bold text-2xl">🐾</span>
        </div>
      </div>
      <h2 class="text-3xl font-bold text-gray-900">Xác thực tài khoản</h2>
      <p class="mt-2 text-sm text-gray-600">Nhập mã OTP đã được gửi về email của bạn</p>
    </div>
    
    <!-- Verification Form Card -->
    <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <form @submit.prevent="handleVerify" class="space-y-6">
        <!-- Email Field -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Địa chỉ email
          </label>
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            readonly
            disabled
            class="block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 placeholder-gray-400 text-gray-900 bg-gray-100 border-gray-200 cursor-not-allowed"
            placeholder="your@email.com"
          />
          <p class="mt-1 text-xs text-gray-500">
            Mã OTP đã được gửi đến email này
          </p>
        </div>

        <!-- OTP Field -->
        <div>
          <label for="otp" class="block text-sm font-medium text-gray-700 mb-2">
            Mã OTP
          </label>
          <div class="relative">
            <input
              id="otp"
              v-model="form.otp"
              name="otp"
              type="text"
              required
              maxlength="6"
              class="block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white text-center text-lg font-mono tracking-widest"
              placeholder="123456"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p class="mt-1 text-xs text-gray-500">Mã OTP gồm 6 chữ số</p>
        </div>

        <!-- Error Alert -->
        <div v-if="authStore.error" class="rounded-lg bg-red-50 border border-red-200 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          :disabled="authStore.loading || form.otp.length !== 6"
          :class="[
            'w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200',
            authStore.loading || form.otp.length !== 6
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          ]"
        >
          <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="authStore.loading">Đang xác thực...</span>
          <span v-else>Xác thực tài khoản</span>
        </button>

        <!-- Resend OTP -->
        <div class="text-center">
          <button
            type="button"
            @click="handleRegenerateOtp"
            :disabled="authStore.loading || countdown > 0"
            :class="[
              'text-sm font-medium transition-colors duration-200',
              authStore.loading || countdown > 0
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-emerald-600 hover:text-emerald-500'
            ]"
          >
            <span v-if="countdown > 0">
              Gửi lại sau {{ countdown }}s
            </span>
            <span v-else>
              Gửi lại mã OTP
            </span>
          </button>
        </div>
      </form>
    </div>

    <!-- Back to Login -->
    <div class="mt-6 text-center">
      <router-link
        to="/auth/login"
        class="inline-flex items-center text-sm font-medium text-gray-600 hover:text-emerald-500 transition-colors duration-200"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Quay lại đăng nhập
      </router-link>
    </div>

    <!-- Help Text -->
    <div class="mt-8 p-4 bg-amber-50 rounded-lg border border-amber-200">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-amber-800">Lưu ý quan trọng</h3>
          <div class="mt-1 text-sm text-amber-700">
            <ul class="list-disc list-inside space-y-1">
              <li>Mã OTP có hiệu lực trong 10 phút</li>
              <li>Kiểm tra thư mục spam nếu không thấy email</li>
              <li>Chỉ nhập chính xác 6 chữ số</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const form = ref({
  email: '',
  otp: ''
})

const countdown = ref(0)
let countdownInterval = null

// Auto-fill email from query parameter
onMounted(() => {
  authStore.clearError()
  
  // Get email from query parameter (from registration)
  if (route.query.email) {
    form.value.email = route.query.email
  }
})

const handleVerify = async () => {
  try {
    await authStore.verifyAccount(form.value)
    // Redirect to login page after successful verification
    router.push('/auth/login')
  } catch (error) {
    console.error('Verify error:', error)
  }
}

const handleRegenerateOtp = async () => {
  try {
    await authStore.regenerateOtp({ email: form.value.email })
    // Start countdown
    countdown.value = 60
    countdownInterval = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(countdownInterval)
        countdownInterval = null
      }
    }, 1000)
  } catch (error) {
    console.error('Regenerate OTP error:', error)
  }
}

// Clear error when component mounts
// onMounted(() => {
//   authStore.clearError()
// })

// Cleanup interval on unmount
onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>