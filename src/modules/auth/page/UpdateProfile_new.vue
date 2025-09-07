<!-- UpdateProfile.vue - Responsive Update Profile Form -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
    <div class="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <!-- Header with Back Button -->
        <div class="mb-6 lg:mb-8">
          <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0">
            <button 
              @click="goBack"
              class="inline-flex items-center w-fit px-3 py-2 text-sm font-medium text-emerald-600 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-colors duration-200 shadow-sm"
            >
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Quay lại
            </button>
            <div class="sm:ml-4">
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Cập nhật thông tin cá nhân</h1>
              <p class="text-gray-600 mt-1 text-sm sm:text-base">Chỉnh sửa thông tin profile của bạn</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
          <!-- Current Avatar Display -->
          <div class="p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-emerald-100">
            <div class="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <div class="relative mx-auto sm:mx-0">
                <img 
                  v-if="profile.b64 && profile.fileType"
                  :src="avatarSrc" 
                  :alt="profile.fullName"
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div 
                  v-else 
                  :class="getAvatarColor(profile.fullName || '')"
                  class="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-white text-lg sm:text-xl font-bold border-4 border-white shadow-lg"
                >
                  {{ getUserInitials(profile.fullName || 'U') }}
                </div>
              </div>
              <div class="text-center sm:text-left">
                <h3 class="font-semibold text-lg sm:text-xl text-gray-800">{{ profile.fullName || 'Chưa có tên' }}</h3>
                <p class="text-sm sm:text-base text-emerald-600 mt-1">{{ profile.role?.name || 'Chưa có vai trò' }}</p>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">ID: {{ profile.id }}</p>
              </div>
            </div>
          </div>

          <!-- Update Form -->
          <div class="p-4 sm:p-6 lg:p-8">
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <!-- Left Column -->
                <div class="space-y-6">
                  <!-- Full Name -->
                  <div>
                    <label for="fullName" class="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên <span class="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      v-model="formData.fullName"
                      type="text"
                      required
                      :disabled="loading"
                      class="block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Nhập họ và tên"
                    />
                    <p v-if="errors.fullName" class="mt-1 text-sm text-red-600">{{ errors.fullName }}</p>
                  </div>

                  <!-- Email -->
                  <div>
                    <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                      Email <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        id="email"
                        v-model="formData.email"
                        type="email"
                        required
                        :disabled="loading"
                        class="block w-full px-4 py-3 pl-11 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="your@email.com"
                      />
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                      </div>
                    </div>
                    <p v-if="errors.email" class="mt-1 text-sm text-red-600">{{ errors.email }}</p>
                  </div>

                  <!-- Phone -->
                  <div>
                    <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại <span class="text-red-500">*</span>
                    </label>
                    <div class="relative">
                      <input
                        id="phone"
                        v-model="formData.phone"
                        type="tel"
                        required
                        :disabled="loading"
                        class="block w-full px-4 py-3 pl-11 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                        placeholder="0123 456 789"
                      />
                      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                    </div>
                    <p v-if="errors.phone" class="mt-1 text-sm text-red-600">{{ errors.phone }}</p>
                  </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-6">
                  <!-- Department -->
                  <div>
                    <label for="department" class="block text-sm font-medium text-gray-700 mb-2">
                      Phòng ban
                    </label>
                    <input
                      id="department"
                      v-model="formData.department"
                      type="text"
                      :disabled="loading"
                      class="block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Nhập phòng ban"
                    />
                  </div>

                  <!-- Position -->
                  <div>
                    <label for="position" class="block text-sm font-medium text-gray-700 mb-2">
                      Chức vụ
                    </label>
                    <input
                      id="position"
                      v-model="formData.position"
                      type="text"
                      :disabled="loading"
                      class="block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                      placeholder="Nhập chức vụ"
                    />
                  </div>

                  <!-- Date of Birth -->
                  <div>
                    <label for="dateOfBirth" class="block text-sm font-medium text-gray-700 mb-2">
                      Ngày sinh
                    </label>
                    <input
                      id="dateOfBirth"
                      v-model="formData.dateOfBirth"
                      type="date"
                      :disabled="loading"
                      class="block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <!-- Address (Full Width) -->
              <div>
                <label for="address" class="block text-sm font-medium text-gray-700 mb-2">
                  Địa chỉ
                </label>
                <textarea
                  id="address"
                  v-model="formData.address"
                  rows="3"
                  :disabled="loading"
                  class="block w-full px-4 py-3 border rounded-lg shadow-sm transition-all duration-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 placeholder-gray-400 text-gray-900 bg-gray-50 border-gray-200 hover:border-gray-300 focus:bg-white disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                  placeholder="Nhập địa chỉ đầy đủ"
                ></textarea>
              </div>

              <!-- Form Actions -->
              <div class="border-t border-gray-200 pt-6">
                <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                  <div class="flex items-center text-sm text-gray-500 order-2 sm:order-1">
                    <svg class="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Các trường có dấu <span class="text-red-500 mx-1">*</span> là bắt buộc
                  </div>
                  
                  <div class="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3 order-1 sm:order-2">
                    <button 
                      type="button"
                      @click="handleReset"
                      :disabled="loading"
                      class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Đặt lại
                    </button>
                    
                    <button 
                      type="button"
                      @click="goBack"
                      :disabled="loading"
                      class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Hủy
                    </button>
                    
                    <button 
                      type="submit"
                      :disabled="loading"
                      :class="[
                        'inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-lg text-white transition-all duration-200',
                        loading 
                          ? 'bg-gray-400 cursor-not-allowed' 
                          : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                      ]"
                    >
                      <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <svg v-else class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {{ loading ? 'Đang cập nhật...' : 'Cập nhật thông tin' }}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { getProfile, updateProfile } from '@/modules/auth/services/auth.service'

const router = useRouter()
const loading = ref(false)
const profile = ref({})
const errors = ref({})

// Form data
const formData = reactive({
  fullName: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  address: '',
  dateOfBirth: ''
})

// Original data for reset functionality
const originalData = ref({})

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

// Validation rules
const validateForm = () => {
  errors.value = {}
  
  if (!formData.fullName.trim()) {
    errors.value.fullName = 'Họ và tên là bắt buộc'
  }
  
  if (!formData.email.trim()) {
    errors.value.email = 'Email là bắt buộc'
  } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(formData.email)) {
    errors.value.email = 'Email không hợp lệ'
  }
  
  if (!formData.phone.trim()) {
    errors.value.phone = 'Số điện thoại là bắt buộc'
  } else if (!/^[0-9+\-\s\(\)]{10,15}$/.test(formData.phone)) {
    errors.value.phone = 'Số điện thoại không hợp lệ'
  }
  
  return Object.keys(errors.value).length === 0
}

// Methods
const fetchProfile = async () => {
  try {
    loading.value = true
    const response = await getProfile()
    profile.value = response.data.data
    
    // Populate form with current data
    formData.fullName = profile.value.fullName || ''
    formData.email = profile.value.email || ''
    formData.phone = profile.value.phone || ''
    formData.department = profile.value.department || ''
    formData.position = profile.value.position || ''
    formData.address = profile.value.address || ''
    formData.dateOfBirth = profile.value.dateOfBirth ? profile.value.dateOfBirth.split('T')[0] : ''
    
    // Store original data for reset
    originalData.value = { ...formData }
    
  } catch (error) {
    console.error('Error fetching profile:', error)
    alert('Không thể tải thông tin profile')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }
  
  try {
    loading.value = true
    
    const updateData = {
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      position: formData.position,
      address: formData.address,
      dateOfBirth: formData.dateOfBirth
    }
    
    await updateProfile(updateData)
    
    alert('Cập nhật thông tin thành công!')
    router.push({ name: 'Profile' })
    
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Có lỗi xảy ra khi cập nhật thông tin')
  } finally {
    loading.value = false
  }
}

const handleReset = async () => {
  if (confirm('Bạn có chắc chắn muốn đặt lại tất cả thay đổi?')) {
    Object.assign(formData, originalData.value)
    errors.value = {}
  }
}

const goBack = () => {
  router.push({ name: 'Profile' })
}

// Lifecycle
onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
/* Custom scrollbar for textarea */
textarea::-webkit-scrollbar {
  width: 6px;
}

textarea::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

textarea::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Enhanced focus effects */
input:focus,
textarea:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

/* Smooth transitions */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Loading state */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>
