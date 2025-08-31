<template>
  <el-dialog
    :model-value="visible"
    @update:model-value="$emit('update:visible', $event)"
    title="Chi tiết người dùng"
    :width="dialogWidth"
    :fullscreen="isMobile"
  >
    <div v-if="user" class="px-5 py-6">
      <!-- Avatar & Basic Info -->
      <div class="text-center mb-6">
        <UserAvatar :user="user" size="large" class="mx-auto mb-3" />
        <h3 class="text-xl font-semibold text-gray-900">{{ user.fullName }}</h3>
        <p class="text-gray-600">{{ user.email }}</p>
        <el-tag 
          :type="user.block ? 'danger' : 'success'" 
          class="mt-2"
        >
          {{ user.block ? 'Bị khóa' : 'Hoạt động' }}
        </el-tag>
      </div>

      <!-- User Information -->
      <div class="grid grid-cols-1 gap-4">
        <div class="flex items-start py-2 border-b border-gray-100 last:border-b-0">
          <span class="font-medium text-gray-700 min-w-[100px] mr-4">ID:</span>
          <span class="text-gray-900 flex-1">{{ user.id }}</span>
        </div>

        <div class="flex items-start py-2 border-b border-gray-100 last:border-b-0">
          <span class="font-medium text-gray-700 min-w-[100px] mr-4">Số điện thoại:</span>
          <span class="text-gray-900 flex-1">{{ user.phone || 'Chưa có' }}</span>
        </div>

        <div class="flex items-start py-2 border-b border-gray-100 last:border-b-0">
          <span class="font-medium text-gray-700 min-w-[100px] mr-4">Địa chỉ:</span>
          <span class="text-gray-900 flex-1">{{ user.address || 'Chưa có' }}</span>
        </div>

        <div class="flex items-start py-2 border-b border-gray-100 last:border-b-0">
          <span class="font-medium text-gray-700 min-w-[100px] mr-4">Vai trò:</span>
          <div class="flex-1">
            <el-tag 
              v-if="user.role"
              :type="getRoleTagType(user.role.roleId)"
              size="small"
            >
              {{ user.role.name }}
            </el-tag>
            <span v-else class="text-gray-500">Chưa có</span>
            <div v-if="user.role?.description" class="text-xs text-gray-500 mt-1">
              {{ user.role.description }}
            </div>
          </div>
        </div>

        <div class="flex items-start py-2 border-b border-gray-100 last:border-b-0">
          <span class="font-medium text-gray-700 min-w-[100px] mr-4">Phòng ban:</span>
          <span class="text-gray-900 flex-1">{{ user.department || 'Chưa có' }}</span>
        </div>

        <div class="flex items-start py-2 border-b border-gray-100 last:border-b-0">
          <span class="font-medium text-gray-700 min-w-[100px] mr-4">Chức vụ:</span>
          <span class="text-gray-900 flex-1">{{ user.position || 'Chưa có' }}</span>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <el-button @click="$emit('update:visible', false)">Đóng</el-button>
        <el-button 
          type="primary" 
          @click="$emit('edit', user)"
          v-if="canEdit"
        >
          <i class="fas fa-edit mr-2"></i>
          Chỉnh sửa
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/modules/auth'
import { ROLES } from '@/modules/auth/constants/roles'
import UserAvatar from './UserAvatar.vue'

// Props
const props = defineProps({
  visible: { type: Boolean, default: false },
  user: { type: Object, default: null }
})

// Emits
const emit = defineEmits(['update:visible', 'edit'])

// Store
const authStore = useAuthStore()

// Reactive data
const windowWidth = ref(window.innerWidth)

// Computed
const canEdit = computed(() =>
  authStore.hasPermission([ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER])
)

const isMobile = computed(() => windowWidth.value < 768)

const dialogWidth = computed(() => {
  if (windowWidth.value < 640) return '95%'
  if (windowWidth.value < 768) return '80%'
  return '500px'
})

// Methods
const getRoleTagType = (roleId) => {
  const roleTypes = {
    [ROLES.ADMIN]: 'danger',
    [ROLES.WAREHOUSE_MANAGER]: 'warning',
    [ROLES.PRODUCTION_MANAGER]: 'warning',
    [ROLES.QC_STAFF]: 'success',
    [ROLES.OPERATOR]: 'info',
    [ROLES.MAINTENANCE_STAFF]: 'info',
    [ROLES.REGULATORY_AFFAIRS]: 'primary',
    [ROLES.SALES_STAFF]: 'success',
    [ROLES.ACCOUNTANT]: 'warning',
    [ROLES.VIEWER]: ''
  }
  return roleTypes[roleId] || 'info'
}

const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

// Lifecycle
onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})
</script>

<style scoped>
:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  border-radius: 8px 8px 0 0;
}

:deep(.el-dialog__title) {
  color: white;
}

:deep(.el-dialog__headerbtn .el-dialog__close) {
  color: white;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  :deep(.el-dialog__body) {
    padding: 1rem;
  }
  
  .grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .flex.items-start {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .font-medium.text-gray-700 {
    min-width: auto;
    margin-bottom: 0.25rem;
    font-size: 14px;
  }
}

@media (max-width: 640px) {
  :deep(.el-dialog__body) {
    padding: 0.75rem;
  }
  
  .px-5.py-6 {
    padding: 1rem;
  }
  
  .text-xl {
    font-size: 1.125rem;
  }
  
  .mb-6 {
    margin-bottom: 1.5rem;
  }
  
  .gap-4 {
    gap: 0.5rem;
  }
}
</style>
