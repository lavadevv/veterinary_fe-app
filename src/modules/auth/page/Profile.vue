<!-- Profile.vue - Display Profile Information -->
<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <el-loading text="Đang tải thông tin..." />
    </div>

    <!-- Profile Content -->
    <div v-else class="bg-white rounded-lg shadow-lg overflow-hidden">
      <!-- Header -->
      <div class="bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <!-- Avatar -->
            <div class="mr-6">
              <img 
                v-if="profile.b64 && profile.fileType"
                :src="avatarSrc" 
                :alt="profile.fullName"
                class="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
              />
              <div 
                v-else 
                :class="getAvatarColor(profile.fullName || '')"
                class="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white shadow-lg"
              >
                {{ getUserInitials(profile.fullName || 'U') }}
              </div>
            </div>
            
            <!-- Basic Info -->
            <div class="text-white">
              <h1 class="text-3xl font-bold mb-2">{{ profile.fullName || 'Chưa có tên' }}</h1>
              <p class="text-blue-100 text-lg mb-1">{{ profile.role?.name || 'Chưa có vai trò' }}</p>
              <p class="text-blue-200 text-sm">ID: {{ profile.id }}</p>
              <div class="mt-2 flex items-center">
                <el-tag 
                  :type="profile.block ? 'danger' : 'success'" 
                  size="small"
                >
                  {{ profile.block ? 'Đã khóa' : 'Hoạt động' }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div>
            <el-button 
              type="primary" 
              size="large"
              @click="goToEdit"
              class="bg-white text-blue-600 hover:bg-gray-50"
            >
              <i class="el-icon-edit mr-2"></i>
              Cập nhật thông tin
            </el-button>
          </div>
        </div>
      </div>

      <!-- Profile Details -->
      <div class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <!-- Personal Information -->
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <i class="el-icon-user mr-2 text-blue-500"></i>
              Thông tin cá nhân
            </h3>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="w-32 text-sm text-gray-500 font-medium">Họ và tên:</div>
                <div class="flex-1 text-gray-800">{{ profile.fullName || 'Chưa cập nhật' }}</div>
              </div>
              
              <div class="flex items-start">
                <div class="w-32 text-sm text-gray-500 font-medium">Email:</div>
                <div class="flex-1">
                  <a :href="`mailto:${profile.email}`" class="text-blue-600 hover:text-blue-800">
                    {{ profile.email || 'Chưa cập nhật' }}
                  </a>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="w-32 text-sm text-gray-500 font-medium">Số điện thoại:</div>
                <div class="flex-1">
                  <a :href="`tel:${profile.phone}`" class="text-blue-600 hover:text-blue-800">
                    {{ profile.phone || 'Chưa cập nhật' }}
                  </a>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="w-32 text-sm text-gray-500 font-medium">Địa chỉ:</div>
                <div class="flex-1 text-gray-800">{{ profile.address || 'Chưa cập nhật' }}</div>
              </div>
            </div>
          </div>

          <!-- Work Information -->
          <div>
            <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <i class="el-icon-office-building mr-2 text-green-500"></i>
              Thông tin công việc
            </h3>
            
            <div class="space-y-4">
              <div class="flex items-start">
                <div class="w-32 text-sm text-gray-500 font-medium">Vai trò:</div>
                <div class="flex-1">
                  <el-tag type="info" size="small">
                    {{ profile.role?.name || 'Chưa có vai trò' }}
                  </el-tag>
                </div>
              </div>
              
              <div class="flex items-start">
                <div class="w-32 text-sm text-gray-500 font-medium">Phòng ban:</div>
                <div class="flex-1 text-gray-800">{{ profile.department || 'Chưa cập nhật' }}</div>
              </div>
              
              <div class="flex items-start">
                <div class="w-32 text-sm text-gray-500 font-medium">Chức vụ:</div>
                <div class="flex-1 text-gray-800">{{ profile.position || 'Chưa cập nhật' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="mt-8 pt-6 border-t border-gray-200">
          <h4 class="text-lg font-medium text-gray-800 mb-4">Thao tác nhanh</h4>
          <div class="flex space-x-4">
            <el-button type="primary" @click="goToEdit">
              <i class="el-icon-edit mr-1"></i>
              Chỉnh sửa thông tin
            </el-button>
            <el-button @click="refreshProfile">
              <i class="el-icon-refresh mr-1"></i>
              Làm mới
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElLoading } from 'element-plus'
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

// Avatar helper functions (you can move these to a utility file)
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

// Methods
const fetchProfile = async () => {
  try {
    loading.value = true
    const response = await getProfile()
    console.log(response);
    profile.value = response.data.data
    
  } catch (error) {
    console.error('Error fetching profile:', error)
    ElMessage.error('Không thể tải thông tin profile')
  } finally {
    loading.value = false
  }
}

const goToEdit = () => {
  router.push({ name: 'UpdateProfile' }) // Adjust route name as needed
}

const refreshProfile = async () => {
  ElMessage.info('Đang làm mới thông tin...')
  await fetchProfile()
  ElMessage.success('Đã làm mới thông tin!')
}

// Lifecycle
onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
/* Custom styles */
:deep(.el-loading-text) {
  color: #409eff;
}

.gradient-bg {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
</style>