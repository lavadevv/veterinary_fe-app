<!-- src/modules/auth/page/ForgotPasswordPage.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Quên mật khẩu
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Nhập email để nhận liên kết đặt lại mật khẩu
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleForgotPassword">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            v-model="form.email"
            name="email"
            type="email"
            required
            class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            placeholder="Địa chỉ email"
          />
        </div>

        <!-- Error message -->
        <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-700">
            {{ authStore.error }}
          </div>
        </div>

        <!-- Success message -->
        <div v-if="showSuccess" class="rounded-md bg-green-50 p-4">
          <div class="text-sm text-green-700">
            Liên kết đặt lại mật khẩu đã được gửi về email của bạn
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="authStore.loading">Đang gửi...</span>
            <span v-else>Gửi liên kết đặt lại</span>
          </button>
        </div>

        <div class="text-center">
          <router-link
            to="/auth/login"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-500"
          >
            Quay lại đăng nhập
          </router-link>
        </div>
      </form>
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