<!-- UpdateProfile.vue - Update Profile Form -->
<template>
  <div class="max-w-4xl mx-auto p-6">
    <!-- Header with Back Button -->
    <div class="mb-6 flex items-center">
      <el-button 
        type="text" 
        @click="goBack"
        class="mr-4 text-blue-600 hover:text-blue-800"
      >
        <i class="el-icon-arrow-left mr-1"></i>
        Quay lại
      </el-button>
      <div>
        <h1 class="text-2xl font-bold text-gray-800">Cập nhật thông tin cá nhân</h1>
        <p class="text-gray-600 mt-1">Chỉnh sửa thông tin profile của bạn</p>
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-lg p-6">
      <!-- Current Avatar Display -->
      <div class="flex items-center mb-8 p-4 bg-gray-50 rounded-lg">
        <div class="relative">
          <img 
            v-if="profile.b64 && profile.fileType"
            :src="avatarSrc" 
            :alt="profile.fullName"
            class="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
          />
          <div 
            v-else 
            :class="getAvatarColor(profile.fullName || '')"
            class="w-16 h-16 rounded-full flex items-center justify-center text-white text-lg font-bold border-3 border-white shadow-md"
          >
            {{ getUserInitials(profile.fullName || 'U') }}
          </div>
        </div>
        <div class="ml-4">
          <h3 class="font-semibold text-lg text-gray-800">{{ profile.fullName || 'Chưa có tên' }}</h3>
          <p class="text-sm text-gray-600">{{ profile.role?.name || 'Chưa có vai trò' }}</p>
          <p class="text-sm text-gray-500">ID: {{ profile.id }}</p>
        </div>
      </div>

      <!-- Update Form -->
      <el-form 
        :model="formData" 
        :rules="rules" 
        ref="profileFormRef"
        label-width="140px"
        label-position="left"
        class="space-y-6"
        @submit.prevent="handleSubmit"
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Left Column -->
          <div class="space-y-6">
            <el-form-item label="Họ và tên" prop="fullName">
              <el-input 
                v-model="formData.fullName"
                placeholder="Nhập họ và tên"
                class="w-full"
                :disabled="loading"
                clearable
              />
            </el-form-item>

            <el-form-item label="Email" prop="email">
              <el-input 
                v-model="formData.email"
                type="email"
                placeholder="Nhập email"
                class="w-full"
                :disabled="loading"
                clearable
              >
                <template #prefix>
                  <i class="el-icon-message"></i>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="Số điện thoại" prop="phone">
              <el-input 
                v-model="formData.phone"
                placeholder="Nhập số điện thoại"
                class="w-full"
                :disabled="loading"
                clearable
              >
                <template #prefix>
                  <i class="el-icon-phone"></i>
                </template>
              </el-input>
            </el-form-item>
          </div>

          <!-- Right Column -->
          <div class="space-y-6">
            <el-form-item label="Phòng ban" prop="department">
              <el-input 
                v-model="formData.department"
                placeholder="Nhập phòng ban"
                class="w-full"
                :disabled="loading"
                clearable
              >
                <template #prefix>
                  <i class="el-icon-office-building"></i>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="Chức vụ" prop="position">
              <el-input 
                v-model="formData.position"
                placeholder="Nhập chức vụ"
                class="w-full"
                :disabled="loading"
                clearable
              >
                <template #prefix>
                  <i class="el-icon-user"></i>
                </template>
              </el-input>
            </el-form-item>

            <el-form-item label="Địa chỉ" prop="address">
              <el-input 
                v-model="formData.address"
                type="textarea"
                :rows="3"
                placeholder="Nhập địa chỉ"
                class="w-full"
                :disabled="loading"
                clearable
              />
            </el-form-item>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="flex justify-between items-center pt-6 border-t border-gray-200">
          <div class="text-sm text-gray-500">
            <i class="el-icon-info mr-1"></i>
            Tất cả các trường đều bắt buộc
          </div>
          
          <div class="flex space-x-3">
            <el-button 
              @click="handleReset"
              :disabled="loading"
              class="min-w-[120px]"
            >
              <i class="el-icon-refresh-left mr-1"></i>
              Đặt lại
            </el-button>
            <el-button 
              @click="goBack"
              :disabled="loading"
              class="min-w-[120px]"
            >
              <i class="el-icon-close mr-1"></i>
              Hủy
            </el-button>
            <el-button 
              type="primary" 
              @click="handleSubmit"
              :loading="loading"
              class="min-w-[120px]"
            >
              <i v-if="!loading" class="el-icon-check mr-1"></i>
              {{ loading ? 'Đang cập nhật...' : 'Cập nhật' }}
            </el-button>
          </div>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getProfile, updateProfile } from '@/modules/auth/services/auth.service'

const router = useRouter()
const profileFormRef = ref()
const loading = ref(false)
const profile = ref({})

// Form data
const formData = reactive({
  fullName: '',
  email: '',
  phone: '',
  department: '',
  position: '',
  address: ''
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
    'bg-red-500',
    'bg-blue-500', 
    'bg-green-500',
    'bg-purple-500',
    'bg-yellow-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500'
  ]
  
  const hash = name.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc)
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
const rules = {
  fullName: [
    { required: true, message: 'Họ tên không được để trống', trigger: 'blur' }
  ],
  email: [
    { required: true, message: 'Email không được để trống', trigger: 'blur' },
    { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' },
    { pattern: /.+[@].+[\\.].+/, message: 'Email không hợp lệ', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: 'Số điện thoại không được để trống', trigger: 'blur' }
  ],
  department: [
    { required: true, message: 'Phòng ban không được để trống', trigger: 'blur' }
  ],
  position: [
    { required: true, message: 'Chức vụ không được để trống', trigger: 'blur' }
  ],
  address: [
    { required: true, message: 'Địa chỉ không được để trống', trigger: 'blur' }
  ]
}

// Methods
const fetchProfile = async () => {
  try {
    loading.value = true
    const response = await getProfile()
    profile.value = response.data.data
    
    // Populate form data
    formData.fullName = profile.value.fullName || ''
    formData.email = profile.value.email || ''
    formData.phone = profile.value.phone || ''
    formData.department = profile.value.department || ''
    formData.position = profile.value.position || ''
    formData.address = profile.value.address || ''
    
    // Store original data for reset
    originalData.value = { ...formData }
  } catch (error) {
    console.error('Error fetching profile:', error)
    ElMessage.error('Không thể tải thông tin profile')
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  try {
    await profileFormRef.value.validate()
    
    const confirmResult = await ElMessageBox.confirm(
      'Bạn có chắc chắn muốn cập nhật thông tin profile không?',
      'Xác nhận cập nhật',
      {
        confirmButtonText: 'Cập nhật',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }
    )

    if (confirmResult === 'confirm') {
      loading.value = true
      
      const updateData = {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        position: formData.position,
        address: formData.address
      }
      
      await updateProfile(updateData)
      
      ElMessage.success('Cập nhật profile thành công!')
      
      // Navigate back to profile page after success
      setTimeout(() => {
        goBack()
      }, 1500)
    }
  } catch (error) {
    console.error('Error updating profile:', error)
    if (error.response?.data?.message) {
      ElMessage.error(error.response.data.message)
    } else {
      ElMessage.error('Có lỗi xảy ra khi cập nhật profile')
    }
  } finally {
    loading.value = false
  }
}

const handleReset = async () => {
  try {
    await ElMessageBox.confirm(
      'Bạn có chắc chắn muốn đặt lại tất cả thông tin về trạng thái ban đầu?',
      'Xác nhận đặt lại',
      {
        confirmButtonText: 'Đặt lại',
        cancelButtonText: 'Hủy',
        type: 'warning'
      }
    )
    
    // Reset form data to original values
    Object.assign(formData, originalData.value)
    
    // Clear validation
    profileFormRef.value?.clearValidate()
    
    ElMessage.success('Đã đặt lại thông tin!')
  } catch (error) {
    // User cancelled, do nothing
  }
}

const goBack = () => {
  router.back() // Or router.push({ name: 'Profile' })
}

// Lifecycle
onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
/* Custom styles for Element Plus components */
:deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
}

:deep(.el-input__wrapper) {
  border-radius: 8px;
  transition: all 0.3s ease;
}

:deep(.el-input__wrapper:hover) {
  border-color: #409eff;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

:deep(.el-input__prefix) {
  color: #9ca3af;
}

/* Form animations */
.el-form-item {
  transition: all 0.3s ease;
}

.el-form-item:hover {
  transform: translateY(-1px);
}

/* Success state */
:deep(.is-success .el-input__wrapper) {
  border-color: #67c23a;
}

/* Error state */
:deep(.is-error .el-input__wrapper) {
  border-color: #f56c6c;
}
</style>