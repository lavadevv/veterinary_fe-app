<!-- Unauthorized.vue - 401/403 Error Page -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center p-4">
    <div class="max-w-lg w-full text-center">
      <!-- 401/403 Animation -->
      <div class="mb-8 relative">
        <div class="text-8xl md:text-9xl font-bold text-red-200 select-none animate-pulse">
          {{ errorCode }}
        </div>
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="w-32 h-32 bg-red-500 rounded-full opacity-20 animate-ping"></div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="bg-white rounded-2xl shadow-xl p-8 transform hover:scale-105 transition-transform duration-300">
        <!-- Illustration -->
        <div class="mb-6">
          <svg class="w-32 h-32 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                  d="M12 15v2m0 0v2m0-2h2m-2 0h-2m-7-2a9 9 0 1118 0 9 9 0 01-18 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>

        <!-- Title -->
        <h1 class="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          {{ title }}
        </h1>
        
        <!-- Description -->
        <p class="text-gray-600 text-lg mb-8 leading-relaxed">
          {{ description }}
        </p>

        <!-- Status Alert -->
        <el-alert
          :title="alertTitle"
          :description="alertDescription"
          type="warning"
          :show-icon="true"
          :closable="false"
          class="mb-8 text-left"
        />

        <!-- Action Buttons -->
        <div class="space-y-4">
          <el-button 
            type="primary" 
            size="large"
            @click="goToLogin"
            class="w-full md:w-auto min-w-[200px] rounded-full"
          >
            <i class="el-icon-user mr-2"></i>
            Đăng nhập lại
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
              @click="goHome"
              size="large"
              class="min-w-[150px] rounded-full"
            >
              <i class="el-icon-house mr-2"></i>
              Trang chủ
            </el-button>
          </div>
        </div>

        <!-- Help Section -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <div class="text-sm text-gray-600 space-y-2">
            <p class="font-medium">Cần hỗ trợ?</p>
            <div class="flex flex-col md:flex-row gap-2 justify-center items-center">
              <el-button 
                type="text" 
                size="small"
                @click="contactSupport"
                class="text-blue-600 hover:text-blue-800"
              >
                <i class="el-icon-phone mr-1"></i>
                Liên hệ hỗ trợ
              </el-button>
              <span class="hidden md:inline text-gray-300">•</span>
              <el-button 
                type="text" 
                size="small"
                @click="viewHelp"
                class="text-blue-600 hover:text-blue-800"
              >
                <i class="el-icon-question mr-1"></i>
                Trung tâm trợ giúp
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-8 text-center">
        <p class="text-gray-500 text-sm">
          Mã lỗi: {{ errorCode }} • {{ footerMessage }}
        </p>
        <p class="text-gray-400 text-xs mt-2">
          Thời gian: {{ currentTime }}
        </p>
      </div>
    </div>

    <!-- Background Decorations -->
    <div class="fixed inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-4 -right-4 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div class="absolute -bottom-8 -left-4 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const route = useRoute()

// Props - có thể truyền từ router hoặc component cha
const props = defineProps({
  code: {
    type: [String, Number],
    default: 401
  },
  message: {
    type: String,
    default: ''
  }
})

// Reactive data
const currentTime = ref('')

// Computed properties
const errorCode = computed(() => {
  return route.query.code || props.code || 401
})

const title = computed(() => {
  switch (Number(errorCode.value)) {
    case 401:
      return 'Chưa đăng nhập'
    case 403:
      return 'Không có quyền truy cập'
    default:
      return 'Không có quyền truy cập'
  }
})

const description = computed(() => {
  if (props.message || route.query.message) {
    return props.message || route.query.message
  }
  
  switch (Number(errorCode.value)) {
    case 401:
      return 'Bạn cần đăng nhập để truy cập trang này. Vui lòng đăng nhập để tiếp tục.'
    case 403:
      return 'Bạn không có quyền truy cập vào trang này. Liên hệ quản trị viên nếu bạn cho rằng đây là lỗi.'
    default:
      return 'Bạn không có quyền truy cập vào trang này.'
  }
})

const alertTitle = computed(() => {
  switch (Number(errorCode.value)) {
    case 401:
      return 'Phiên đăng nhập hết hạn'
    case 403:
      return 'Quyền truy cập bị hạn chế'
    default:
      return 'Truy cập bị từ chối'
  }
})

const alertDescription = computed(() => {
  switch (Number(errorCode.value)) {
    case 401:
      return 'Phiên làm việc của bạn đã hết hạn hoặc chưa được xác thực. Vui lòng đăng nhập lại.'
    case 403:
      return 'Tài khoản của bạn không có quyền truy cập vào tính năng này. Liên hệ quản trị viên để được hỗ trợ.'
    default:
      return 'Có lỗi xảy ra với quyền truy cập của bạn.'
  }
})

const footerMessage = computed(() => {
  switch (Number(errorCode.value)) {
    case 401:
      return 'Unauthorized Access'
    case 403:
      return 'Forbidden Access'
    default:
      return 'Access Denied'
  }
})

// Methods
const updateCurrentTime = () => {
  currentTime.value = new Date().toLocaleString('vi-VN')
}

const goToLogin = () => {
  // Lưu URL hiện tại để redirect sau khi login
  const returnUrl = route.fullPath !== '/unauthorized' ? route.fullPath : '/'
  router.push({ 
    name: 'Login', 
    query: { redirect: returnUrl }
  })
  ElMessage.info('Đang chuyển đến trang đăng nhập...')
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

const goHome = () => {
  router.push('/')
  ElMessage.success('Đã chuyển về trang chủ')
}

const contactSupport = async () => {
  try {
    await ElMessageBox.alert(
      'Liên hệ với bộ phận hỗ trợ:\n\n' +
      '📧 Email: support@example.com\n' +
      '📞 Hotline: 1900-xxx-xxx\n' +
      '🕒 Giờ làm việc: 8:00 - 17:30 (T2-T6)',
      'Thông tin hỗ trợ',
      {
        confirmButtonText: 'Đóng',
        type: 'info'
      }
    )
  } catch (error) {
    // User closed dialog
  }
}

const viewHelp = () => {
  ElMessage.info('Tính năng trung tâm trợ giúp đang được phát triển')
  // router.push('/help')
}

// Lifecycle
onMounted(() => {
  updateCurrentTime()
  // Update time every minute
  setInterval(updateCurrentTime, 60000)
})
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

:deep(.el-alert) {
  border-radius: 12px;
}

:deep(.el-alert--warning) {
  background-color: #fef3cd;
  border-color: #facc15;
}
</style>