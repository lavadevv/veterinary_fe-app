<template>
  <div class="user-table">
    <el-table
      :data="users"
      v-loading="loading"
      @selection-change="handleSelectionChange"
      @sort-change="handleSortChange"
      stripe
      style="width: 100%"
      class="rounded-lg overflow-hidden shadow-sm"
    >
      <!-- Selection -->
      <el-table-column type="selection" width="55" />

      <!-- Avatar & Name -->
      <el-table-column 
        label="Người dùng" 
        min-width="200"
        prop="fullName"
        sortable="custom"
      >
        <template #default="{ row }">
          <div class="flex items-center space-x-3">
            <UserAvatar 
              :user="row" 
              size="large"
              class="flex-shrink-0"
            />
            <div class="min-w-0">
              <div class="font-medium text-gray-900 truncate">{{ row.fullName }}</div>
              <div class="text-sm text-gray-500 truncate">{{ row.email }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- Contact -->
      <el-table-column label="Liên hệ" min-width="150" class="hidden sm:table-cell">
        <template #default="{ row }">
          <div>
            <div class="text-sm">
              <i class="fas fa-phone text-gray-400 mr-1"></i>
              {{ row.phone || 'Chưa có' }}
            </div>
            <div class="text-xs text-gray-500 mt-1">
              <i class="fas fa-map-marker-alt text-gray-400 mr-1"></i>
              <span class="truncate">{{ row.address || 'Chưa có' }}</span>
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- Role -->
      <el-table-column 
        label="Vai trò" 
        width="140"
        prop="roleId"
        sortable="custom"
      >
        <template #default="{ row }">
          <div>
            <el-tag 
              :type="getRoleTagType(row.role?.roleId)"
              size="small"
              class="mb-1"
            >
              {{ row.role?.name || 'Chưa có' }}
            </el-tag>
            <div class="text-xs text-gray-500" v-if="row.role?.description">
              {{ row.role.description }}
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- Department & Position -->
      <el-table-column label="Bộ phận" min-width="150" class="hidden md:table-cell">
        <template #default="{ row }">
          <div>
            <div class="text-sm font-medium truncate">
              {{ row.department || 'Chưa có phòng ban' }}
            </div>
            <div class="text-xs text-gray-500 truncate">
              {{ row.position || 'Chưa có chức vụ' }}
            </div>
          </div>
        </template>
      </el-table-column>

      <!-- Status -->
      <el-table-column 
        label="Trạng thái" 
        width="100"
        prop="block"
        sortable="custom"
      >
        <template #default="{ row }">
          <el-tag 
            :type="row.block ? 'danger' : 'success'"
            size="small"
          >
            <i :class="row.block ? 'fas fa-lock' : 'fas fa-check'" class="mr-1"></i>
            {{ row.block ? 'Bị khóa' : 'Hoạt động' }}
          </el-tag>
        </template>
      </el-table-column>

      <!-- ID Column -->
      <el-table-column 
        label="ID" 
        width="80"
        prop="id"
        sortable="custom"
        class="hidden lg:table-cell"
      >
        <template #default="{ row }">
          <span class="text-sm font-mono text-gray-600">#{{ row.id }}</span>
        </template>
      </el-table-column>

      <!-- Actions -->
      <el-table-column label="Thao tác" width="160" fixed="right">
        <template #default="{ row }">
          <div class="flex space-x-1 justify-center">
            <!-- View Button -->
            <el-tooltip content="Xem chi tiết" placement="top">
              <el-button 
                type="info" 
                size="small" 
                @click="$emit('view', row)"
                circle
                class="!w-8 !h-8 !p-0"
              >
                <i class="fas fa-eye text-xs"></i>
              </el-button>
            </el-tooltip>
            
            <!-- Edit Button -->
            <el-tooltip content="Chỉnh sửa" placement="top">
              <el-button 
                type="primary" 
                size="small" 
                @click="$emit('edit', row)"
                :disabled="!canEdit"
                circle
                class="!w-8 !h-8 !p-0"
              >
                <i class="fas fa-edit text-xs"></i>
              </el-button>
            </el-tooltip>
            
            <!-- Delete Button -->
            <el-tooltip content="Xóa" placement="top">
              <el-button 
                type="danger" 
                size="small" 
                @click="$emit('delete', row)"
                :disabled="!canDelete || row.isSuperAdmin"
                circle
                class="!w-8 !h-8 !p-0"
              >
                <i class="fas fa-trash text-xs"></i>
              </el-button>
            </el-tooltip>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6 space-y-4 sm:space-y-0">
      <div class="text-sm text-gray-600 text-center sm:text-left">
        Hiển thị {{ ((pagination.current - 1) * pagination.pageSize) + 1 }} - 
        {{ Math.min(pagination.current * pagination.pageSize, pagination.total) }} 
        trong tổng số {{ pagination.total }} người dùng
      </div>
      
      <el-pagination
        v-model:current-page="pagination.current"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        :layout="paginationLayout"
        :small="isMobile"
        @current-change="handlePageChange"
        @size-change="handleSizeChange"
        class="justify-center sm:justify-end"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/modules/auth'
import { ROLES } from '@/modules/auth/constants/roles'
import UserAvatar from './UserAvatar.vue'

// Props
const props = defineProps({
  users: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  pagination: {
    type: Object,
    required: true
  },
  selected: {
    type: Array,
    default: () => []
  }
})

// Emits
const emit = defineEmits([
  'update:selected', 'view', 'edit', 'delete', 
  'page-change', 'sort-change'
])

// Stores
const authStore = useAuthStore()

// Reactive data
const windowWidth = ref(window.innerWidth)

// Computed
const canEdit = computed(() => 
  authStore.hasPermission([ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER])
)

const canDelete = computed(() => 
  authStore.hasPermission([ROLES.ADMIN])
)

const isMobile = computed(() => windowWidth.value < 768)

const paginationLayout = computed(() => {
  if (windowWidth.value < 640) {
    return 'prev, pager, next'
  } else if (windowWidth.value < 768) {
    return 'prev, pager, next, jumper'
  } else {
    return 'sizes, prev, pager, next, jumper'
  }
})

// Methods
const handleSelectionChange = (selection) => {
  emit('update:selected', selection)
}

const handlePageChange = (page) => {
  emit('page-change', page)
}

const handleSizeChange = (size) => {
  emit('page-change', 1, size)
}

const handleSortChange = ({ prop, order }) => {
  const sortType = order === 'ascending' ? 'asc' : 'desc'
  emit('sort-change', { sortField: prop, sortType })
}

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
.user-table :deep(.el-table) {
  border-radius: 8px;
}

.user-table :deep(.el-table__header) {
  background-color: #f8fafc;
}

.user-table :deep(.el-table__row:hover) {
  background-color: #f1f5f9;
}

.user-table :deep(.el-table__header-wrapper th) {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  color: #374151;
  font-weight: 600;
}

.user-table :deep(.ascending .sort-caret.ascending) {
  border-bottom-color: #409eff;
}

.user-table :deep(.descending .sort-caret.descending) {
  border-top-color: #409eff;
}

/* Mobile responsive styles */
@media (max-width: 768px) {
  .user-table :deep(.el-table) {
    font-size: 12px;
  }
  
  .user-table :deep(.el-table__cell) {
    padding: 8px 4px;
  }
  
  .user-table :deep(.el-pagination) {
    font-size: 12px;
  }
  
  .user-table :deep(.el-pagination .btn-prev),
  .user-table :deep(.el-pagination .btn-next),
  .user-table :deep(.el-pagination .el-pager li) {
    min-width: 28px;
    height: 28px;
    line-height: 28px;
  }
}

@media (max-width: 640px) {
  .user-table :deep(.el-table__cell) {
    padding: 6px 2px;
  }
}

/* Hide columns on smaller screens */
@media (max-width: 1024px) {
  .user-table :deep(.hidden.lg\\:table-cell) {
    display: none !important;
  }
}

@media (max-width: 768px) {
  .user-table :deep(.hidden.md\\:table-cell) {
    display: none !important;
  }
}

@media (max-width: 640px) {
  .user-table :deep(.hidden.sm\\:table-cell) {
    display: none !important;
  }
}
</style>