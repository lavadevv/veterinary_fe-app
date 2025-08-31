<!-- src/modules/auth/page/VerifyAccountPage.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Xác thực tài khoản
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Vui lòng nhập mã OTP đã được gửi về email của bạn
        </p>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleVerify">
        <div class="space-y-4">
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

          <div>
            <label for="otp" class="block text-sm font-medium text-gray-700">
              Mã OTP
            </label>
            <input
              id="otp"
              v-model="form.otp"
              name="otp"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nhập mã OTP"
            />
          </div>
        </div>

        <!-- Error message -->
        <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-700">
            {{ authStore.error }}
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="authStore.loading">Đang xác thực...</span>
            <span v-else>Xác thực</span>
          </button>
        </div>

        <div class="text-center">
          <button
            type="button"
            @click="handleRegenerateOtp"
            :disabled="authStore.loading"
            class="text-sm font-medium text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
          >
            Gửi lại mã OTP
          </button>
        </div>

        <div class="text-center">
          <router-link
            to="/auth/login"
            class="text-sm font-medium text-gray-600 hover:text-gray-500"
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
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  email: '',
  otp: ''
})

const handleVerify = async () => {
  try {
    await authStore.verifyAccount(form.value)
    
    // Redirect to login page after successful verification
    router.push('/auth/login')
  } catch (error) {
    console.error('Verification error:', error)
  }
}

const handleRegenerateOtp = async () => {
  if (!form.value.email) {
    authStore.error = 'Vui lòng nhập email'
    return
  }
  
  try {
    await authStore.regenerateOtp({ email: form.value.email })
    // Show success message (you can add a success state to store if needed)
    alert('Mã OTP mới đã được gửi về email của bạn')
  } catch (error) {
    console.error('Regenerate OTP error:', error)
  }
}

// Clear error when component mounts
onMounted(() => {
  authStore.clearError()
})
</script>