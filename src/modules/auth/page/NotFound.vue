<!-- NotFound.vue - 404 Error Page -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div class="max-w-lg w-full text-center">
      <!-- 404 Animation -->
      <div class="mb-8 relative">
        <div class="text-8xl md:text-9xl font-bold text-blue-200 select-none animate-pulse">
          404
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
        <!-- Illustration -->
        <div class="mb-6">
          <svg class="w-32 h-32 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                  d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.462-.726-6.228-1.963L12 9l6.228 4.037z"/>
          </svg>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          Không tìm thấy trang
        </h1>
        
        <!-- Description -->
        <p class="text-gray-600 text-lg mb-8 leading-relaxed">
          Rất tiếc! Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>

        <!-- Action Buttons -->
        <div class="space-y-4">
          <el-button 
            type="primary" 
            size="large"
            @click="goHome"
            class="w-full md:w-auto min-w-[200px] rounded-full"
          >
            <i class="el-icon-house mr-2"></i>
            Về trang chủ
          </el-button>
          
          <div class="flex flex-col md:flex-row gap-3 justify-center">
            <el-button 
              @click="goBack"
              size="large"
              class="min-w-[150px] rounded-full"
            >
              <i class="el-icon-arrow-left mr-2"></i>
              Quay lại
            </el-button>
            
            <el-button 
              @click="reloadPage"
              size="large"
              class="min-w-[150px] rounded-full"
            >
              <i class="el-icon-refresh mr-2"></i>
              Tải lại
            </el-button>
          </div>
        </div>

        <!-- Help Links -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-500 mb-3">Có thể bạn đang tìm:</p>
          <div class="flex flex-wrap justify-center gap-2">
            <el-button 
              type="text" 
              size="small"
              @click="goToPath('/dashboard')"
              class="text-blue-600 hover:text-blue-800"
            >
              Dashboard
            </el-button>
            <span class="text-gray-300">•</span>
            <el-button 
              type="text" 
              size="small"
              @click="goToPath('/profile')"
              class="text-blue-600 hover:text-blue-800"
            >
              Profile
            </el-button>
            <span class="text-gray-300">•</span>
            <el-button 
              type="text" 
              size="small"
              @click="goToPath('/login')"
              class="text-blue-600 hover:text-blue-800"
            >
              Đăng nhập
            </el-button>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-gray-500 text-sm">
          Mã lỗi: 404 • Trang không tồn tại
        </p>
      </div>
    </div>

    <!-- Background Decorations -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-4 -right-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

// Methods
const goHome = () => {
  router.push('/')
  ElMessage.success('Đã chuyển về trang chủ')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const reloadPage = () => {
  window.location.reload()
}

const goToPath = (path) => {
  router.push(path).catch(() => {
    ElMessage.warning(`Trang ${path} không khả dụng`)
  })
}
</script>

<style scoped>
/* Custom animations */
@keyframes blob {
  0% {
    transform: translate(0px, 0px) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
  100% {
    transform: translate(0px, 0px) scale(1);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Hover effects */
.hover\:scale-105:hover {
  transform: scale(1.05);
}

/* Responsive text */
@media (max-width: 768px) {
  .text-8xl {
    font-size: 4rem;
  }
  
  .text-9xl {
    font-size: 5rem;
  }
}

/* Element Plus customizations */
:deep(.el-button) {
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #409eff 0%, #1890ff 100%);
  border: none;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #66b1ff 0%, #40a9ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(64, 158, 255, 0.3);
}
</style>