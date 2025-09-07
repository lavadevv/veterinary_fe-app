<!-- Profile.vue - Display Profile Information with HeadlessUI + TailwindCSS -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
    <div class="max-w-7xl mx-auto p-3 sm:p-4 md:p-6 lg:p-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center h-32 sm:h-48 md:h-64">
        <div class="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <svg class="animate-spin h-6 w-6 sm:h-8 sm:w-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-base sm:text-lg text-gray-600">Đang tải thông tin...</span>
        </div>
      </div>

      <!-- Profile Content -->
      <div v-else class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <!-- Header -->
        <div class="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 sm:px-6 py-6 sm:py-8">
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0">
              <!-- Avatar -->
              <div class="flex justify-center sm:justify-start sm:mr-6">
                <img 
                  v-if="profile.b64 && profile.fileType"
                  :src="avatarSrc" 
                  :alt="profile.fullName"
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div 
                  v-else 
                  :class="getAvatarColor(profile.fullName || '')"
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white text-xl sm:text-2xl font-bold border-4 border-white shadow-lg"
                >
                  {{ getUserInitials(profile.fullName || 'U') }}
                </div>
              </div>
              
              <!-- Basic Info -->
              <div class="text-white text-center sm:text-left">
                <h1 class="text-2xl sm:text-3xl font-bold mb-2">{{ profile.fullName || 'Chưa có tên' }}</h1>
                <p class="text-emerald-100 text-base sm:text-lg mb-1">{{ profile.role?.name || 'Chưa có vai trò' }}</p>
                <p class="text-emerald-200 text-sm">ID: {{ profile.id }}</p>
                <div class="mt-2 flex justify-center sm:justify-start">
                  <span 
                    :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      profile.block 
                        ? 'bg-red-100 text-red-800 border border-red-200' 
                        : 'bg-green-100 text-green-800 border border-green-200'
                    ]"
                  >
                    <span 
                      :class="[
                        'w-1.5 h-1.5 rounded-full mr-1.5',
                        profile.block ? 'bg-red-400' : 'bg-green-400'
                      ]"
                    ></span>
                    {{ profile.block ? 'Đã khóa' : 'Hoạt động' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <button 
                @click="refreshProfile"
                class="inline-flex items-center justify-center px-4 py-2 border border-white/20 text-sm font-medium rounded-lg text-white hover:bg-white/10 focus:ring-2 focus:ring-white/20 transition-all duration-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Làm mới
              </button>
              <button 
                @click="goToEdit"
                class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-emerald-600 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-white/20 shadow-lg transition-all duration-200"
              >
                <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Cập nhật thông tin
              </button>
            </div>
          </div>
        </div>

        <!-- Profile Details -->
        <div class="p-4 sm:p-6">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
            <!-- Personal Information -->
            <div class="bg-gray-50 rounded-xl p-4 sm:p-6">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Thông tin cá nhân
              </h3>
              
              <div class="space-y-3 sm:space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <div class="w-full sm:w-32 text-sm text-gray-500 font-medium mb-1 sm:mb-0">Họ và tên:</div>
                  <div class="flex-1 text-gray-800 font-medium break-words">{{ profile.fullName || 'Chưa cập nhật' }}</div>
                </div>
                
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <div class="w-full sm:w-32 text-sm text-gray-500 font-medium mb-1 sm:mb-0">Email:</div>
                  <div class="flex-1">
                    <a 
                      v-if="profile.email"
                      :href="`mailto:${profile.email}`" 
                      class="text-emerald-600 hover:text-emerald-700 transition-colors duration-200 break-all"
                    >
                      {{ profile.email }}
                    </a>
                    <span v-else class="text-gray-400">Chưa cập nhật</span>
                  </div>
                </div>
                
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <div class="w-full sm:w-32 text-sm text-gray-500 font-medium mb-1 sm:mb-0">Số điện thoại:</div>
                  <div class="flex-1">
                    <a 
                      v-if="profile.phone"
                      :href="`tel:${profile.phone}`" 
                      class="text-emerald-600 hover:text-emerald-700 transition-colors duration-200"
                    >
                      {{ profile.phone }}
                    </a>
                    <span v-else class="text-gray-400">Chưa cập nhật</span>
                  </div>
                </div>
                
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <div class="w-full sm:w-32 text-sm text-gray-500 font-medium mb-1 sm:mb-0">Địa chỉ:</div>
                  <div class="flex-1 text-gray-800 break-words">{{ profile.address || 'Chưa cập nhật' }}</div>
                </div>
              </div>
            </div>

            <!-- System Information -->
            <div class="bg-blue-50 rounded-xl p-4 sm:p-6">
              <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <div class="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-2 sm:mr-3">
                  <svg class="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                Thông tin hệ thống
              </h3>
              
              <div class="space-y-3 sm:space-y-4">
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <div class="w-full sm:w-32 text-sm text-gray-500 font-medium mb-1 sm:mb-0">Vai trò:</div>
                  <div class="flex-1">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {{ profile.role?.name || 'Chưa có vai trò' }}
                    </span>
                  </div>
                </div>
                
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <div class="w-full sm:w-32 text-sm text-gray-500 font-medium mb-1 sm:mb-0">Ngày tạo:</div>
                  <div class="flex-1 text-gray-800 text-sm">{{ formatDate(profile.createdAt) || 'Không rõ' }}</div>
                </div>
                
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <div class="w-full sm:w-32 text-sm text-gray-500 font-medium mb-1 sm:mb-0">Cập nhật cuối:</div>
                  <div class="flex-1 text-gray-800 text-sm">{{ formatDate(profile.updatedAt) || 'Không rõ' }}</div>
                </div>
                
                <div class="flex flex-col sm:flex-row sm:items-start">
                  <div class="w-full sm:w-32 text-sm text-gray-500 font-medium mb-1 sm:mb-0">Trạng thái:</div>
                  <div class="flex-1">
                    <span 
                      :class="[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                        profile.block 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      ]"
                    >
                      {{ profile.block ? 'Tài khoản bị khóa' : 'Tài khoản hoạt động' }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Statistics -->
          <div class="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            <div class="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 sm:p-6 border border-emerald-200">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-3 sm:ml-4 min-w-0 flex-1">
                  <div class="text-xs sm:text-sm font-medium text-emerald-600 truncate">Thời gian hoạt động</div>
                  <div class="text-xl sm:text-2xl font-bold text-emerald-900">{{ getDaysFromCreated() }} ngày</div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 sm:p-6 border border-blue-200">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-3 sm:ml-4 min-w-0 flex-1">
                  <div class="text-xs sm:text-sm font-medium text-blue-600 truncate">Trạng thái xác thực</div>
                  <div class="text-base sm:text-lg font-bold text-blue-900">Đã xác thực</div>
                </div>
              </div>
            </div>

            <div class="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 sm:p-6 border border-purple-200">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-8 h-8 sm:w-10 sm:h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                </div>
                <div class="ml-3 sm:ml-4 min-w-0 flex-1">
                  <div class="text-xs sm:text-sm font-medium text-purple-600 truncate">Cấp độ bảo mật</div>
                  <div class="text-base sm:text-lg font-bold text-purple-900">Cao</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getProfile } from '@/modules/auth/services/auth.service'

const router = useRouter()
const loading = ref(false)
const profile = ref({})

// Computed avatar source
const avatarSrc = computed(() => {
  if (profile.value.b64 && profile.value.fileType) {
    return `data:${profile.value.fileType};base64,${profile.value.b64}`
  }
  return null
})

// Avatar helper functions
const getAvatarColor = (name) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-orange-500'
  ]
  const hash = name.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0)
    return a & a
  }, 0)
  return colors[Math.abs(hash) % colors.length]
}

const getUserInitials = (name) => {
  if (!name) return 'U'
  
  const words = name.trim().split(' ')
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase()
  }
  
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase()
}

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return null
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getDaysFromCreated = () => {
  if (!profile.value.createdAt) return 0
  const created = new Date(profile.value.createdAt)
  const now = new Date()
  const diffTime = Math.abs(now - created)
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Methods
const fetchProfile = async () => {
  try {
    loading.value = true
    const response = await getProfile()
    console.log(response)
    profile.value = response.data.data
    
  } catch (error) {
    console.error('Error fetching profile:', error)
    // You can add a toast notification here
    alert('Không thể tải thông tin profile')
  } finally {
    loading.value = false
  }
}

const goToEdit = () => {
  router.push({ name: 'UpdateProfile' })
}

const refreshProfile = async () => {
  // You can add a toast notification here
  console.log('Đang làm mới thông tin...')
  await fetchProfile()
  console.log('Đã làm mới thông tin!')
}

// Lifecycle
onMounted(() => {
  fetchProfile()
})
</script>