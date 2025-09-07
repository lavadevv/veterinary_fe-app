<!-- src/modules/auth/page/ForgotPasswordPage.vue -->
<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Logo and Title -->
    <div class="text-center mb-8">
      <div class="flex justify-center mb-4">
        <div class="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
          <span class="text-white font-bold text-2xl">🐾</span>
        </div>
      </div>
      <h2 class="text-3xl font-bold text-gray-900">Quên mật khẩu?</h2>
      <p class="mt-2 text-sm text-gray-600">Nhập email để nhận liên kết đặt lại mật khẩu</p>
    </div>
    
    <!-- Forgot Password Form Card -->
    <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
      <form @submit.prevent="handleForgotPassword" class="space-y-6">
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
              class="block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white"
              placeholder="your@email.com"
            />
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </div>
          </div>
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

        <!-- Success Alert -->
        <div v-if="showSuccess" class="rounded-lg bg-emerald-50 border border-emerald-200 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="ml-3">
              <div>
                <p class="text-sm font-medium text-emerald-800">
                  Email đã được gửi thành công!
                </p>
                <p class="mt-1 text-sm text-emerald-600">
                  Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để đặt lại mật khẩu.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="authStore.loading"
          :class="[
            'w-full flex justify-center items-center px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200',
            authStore.loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          ]"
        >
          <svg v-if="authStore.loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span v-if="authStore.loading">Đang gửi email...</span>
          <span v-else>Gửi liên kết đặt lại</span>
        </button>
      </form>
    </div>

    <!-- Back to Login -->
    <div class="mt-6 text-center">
      <router-link
        to="/auth/login"
        class="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500 transition-colors duration-200"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Quay lại đăng nhập
      </router-link>
    </div>

    <!-- Help Text -->
    <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-blue-800">Cần trợ giúp?</h3>
          <div class="mt-1 text-sm text-blue-600">
            <p>Nếu bạn không nhận được email, vui lòng:</p>
            <ul class="mt-1 list-disc list-inside space-y-1">
              <li>Kiểm tra thư mục spam/junk</li>
              <li>Đảm bảo địa chỉ email chính xác</li>
              <li>Liên hệ hỗ trợ: contact@dophuclam.id.vn</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store/auth'

const authStore = useAuthStore()

const form = ref({
  email: ''
})

const showSuccess = ref(false)

const handleForgotPassword = async () => {
  try {
    await authStore.forgotPassword(form.value)
    showSuccess.value = true
    form.value.email = ''
  } catch (error) {
    console.error('Forgot password error:', error)
  }
}

// Clear error when component mounts
onMounted(() => {
  authStore.clearError()
  showSuccess.value = false
})
</script>