<!-- NotFound.vue - 404 Error Page with HeadlessUI + TailwindCSS -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
    <div class="max-w-md w-full text-center">
      <!-- 404 Animation -->
      <div class="mb-8">
        <div class="relative">
          <div class="text-9xl font-bold text-emerald-200 select-none">404</div>
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="w-24 h-24 bg-white rounded-full shadow-lg flex items-center justify-center">
              <span class="text-3xl">🐾</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div class="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <h1 class="text-2xl font-bold text-gray-900 mb-4">Trang không tìm thấy</h1>
        <p class="text-gray-600 mb-6">
          Xin lỗi, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="goHome"
            class="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Về trang chủ
          </button>

          <button
            @click="goBack"
            class="w-full inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Quay lại
          </button>
        </div>
      </div>

      <!-- Help Section -->
      <div class="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div class="flex items-start">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-3 text-sm text-blue-700">
            <p><strong>Cần trợ giúp?</strong></p>
            <p>Liên hệ với chúng tôi qua email: <a href="mailto:contact@dophuclam.id.vn" class="underline">contact@dophuclam.id.vn</a></p>
          </div>
        </div>
      </div>

      <!-- Popular Links -->
      <div class="mt-6 text-sm text-gray-500">
        <p class="mb-2">Có thể bạn đang tìm:</p>
        <div class="flex flex-wrap justify-center gap-2">
          <router-link to="/dashboard" class="text-emerald-600 hover:text-emerald-700 underline">Trang chủ</router-link>
          <span>•</span>
          <router-link to="/auth/login" class="text-emerald-600 hover:text-emerald-700 underline">Đăng nhập</router-link>
          <span>•</span>
          <router-link to="/user" class="text-emerald-600 hover:text-emerald-700 underline">Quản lý người dùng</router-link>
        </div>
      </div>
    </div>

    <!-- Decorative elements -->
    <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-emerald-400/10 to-teal-600/10 rounded-full blur-3xl"></div>
    <div class="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}

const goBack = () => {
  router.back()
}
</script>
