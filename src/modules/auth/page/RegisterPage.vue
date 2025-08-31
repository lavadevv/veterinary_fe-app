<!-- src/modules/auth/page/RegisterPage.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Tạo tài khoản mới
        </h2>
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="fullName" class="block text-sm font-medium text-gray-700">
              Họ và tên
            </label>
            <input
              id="fullName"
              v-model="form.fullName"
              name="fullName"
              type="text"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Nhập họ và tên"
            />
          </div>

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
            <label for="password" class="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              id="password"
              v-model="form.password"
              name="password"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Mật khẩu"
            />
          </div>

          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              v-model="form.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Xác nhận mật khẩu"
            />
          </div>

          <div>
            <label for="phone" class="block text-sm font-medium text-gray-700">
              Số điện thoại (tùy chọn)
            </label>
            <input
              id="phone"
              v-model="form.phone"
              name="phone"
              type="tel"
              class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Số điện thoại"
            />
          </div>
        </div>

        <!-- Error message -->
        <div v-if="authStore.error" class="rounded-md bg-red-50 p-4">
          <div class="text-sm text-red-700">
            {{ authStore.error }}
          </div>
        </div>

        <!-- Validation errors -->
        <div v-if="validationErrors.length > 0" class="rounded-md bg-red-50 p-4">
          <ul class="text-sm text-red-700 list-disc list-inside">
            <li v-for="error in validationErrors" :key="error">{{ error }}</li>
          </ul>
        </div>

        <div>
          <button
            type="submit"
            :disabled="authStore.loading || validationErrors.length > 0"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            <span v-if="authStore.loading">Đang đăng ký...</span>
            <span v-else>Đăng ký</span>
          </button>
        </div>

        <div class="text-center">
          <span class="text-sm text-gray-600">
            Đã có tài khoản?
            <router-link
              to="/auth/login"
              class="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Đăng nhập
            </router-link>
          </span>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = ref({
  fullName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phone: ''
})

// Form validation
const validationErrors = computed(() => {
  const errors = []
  
  if (form.value.password && form.value.password.length < 6) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự')
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
    
    // Remove empty phone if not provided
    if (!registerData.phone) {
      delete registerData.phone
    }
    
    await authStore.register(registerData)
    
    // Redirect to verification page or login page
    router.push('/auth/verify-account')
  } catch (error) {
    console.error('Registration error:', error)
  }
}

// Clear error when component mounts
onMounted(() => {
  authStore.clearError()
})
</script>