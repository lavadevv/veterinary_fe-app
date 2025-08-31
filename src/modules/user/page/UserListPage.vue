<template>
  <div class="user-list-container p-3 sm:p-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-4 sm:space-y-0">
      <div>
        <h1 class="text-xl sm:text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Danh sách tất cả người dùng trong hệ thống</p>
      </div>
      <el-button 
        type="primary" 
        @click="showCreateDialog = true"
        :disabled="!canCreate"
        class="w-full sm:w-auto"
        size="large"
      >
        <i class="fas fa-plus mr-2"></i>
        <span class="hidden sm:inline">Thêm người dùng</span>
        <span class="sm:hidden">Thêm</span>
      </el-button>
    </div>

    <!-- Filters -->
    <UserFilters 
      v-model:filters="userStore.filters"
      @search="handleSearch"
      @reset="handleResetFilters"
    />

    <!-- Actions Bar -->
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-2 sm:space-y-0" v-if="selectedUsers.length > 0">
      <div class="text-sm text-gray-600">
        Đã chọn {{ selectedUsers.length }} người dùng
      </div>
      <el-button 
        type="danger" 
        size="small"
        @click="handleDeleteMultiple"
        :disabled="!canDelete"
        class="w-full sm:w-auto"
      >
        <i class="fas fa-trash mr-2"></i>
        Xóa đã chọn
      </el-button>
    </div>

    <!-- User Table -->
    <UserTable 
      :users="userStore.users"
      :loading="userStore.loading"
      :pagination="userStore.pagination"
      v-model:selected="selectedUsers"
      @view="handleViewUser"
      @edit="handleEditUser"
      @delete="handleDeleteUser"
      @page-change="handlePageChange"
      @sort-change="handleSortChange"
    />

    <!-- Create/Edit Dialog -->
    <UserDialog 
      v-model:visible="showCreateDialog"
      :user="null"
      @save="handleCreateUser"
    />

    <UserDialog 
      v-model:visible="showEditDialog"
      :user="editingUser"
      @save="handleUpdateUser"
    />

    <!-- View Dialog -->
    <UserViewDialog 
      v-model:visible="showViewDialog"
      :user="viewingUser"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useUserStore } from '../store/userStore'
import { useAuthStore } from '@/modules/auth'
import { ROLES } from '@/modules/auth/constants/roles'
import UserFilters from '../components/UserFilters.vue'
import UserTable from '../components/UserTable.vue'
import UserDialog from '../components/UserDialog.vue'
import UserViewDialog from '../components/UserViewDialog.vue'

// Stores
const userStore = useUserStore()
const authStore = useAuthStore()

// Reactive data
const selectedUsers = ref([])
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const editingUser = ref(null)
const viewingUser = ref(null)

// Computed
const canCreate = computed(() => 
  authStore.hasPermission([ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER])
)

const canDelete = computed(() => 
  authStore.hasPermission([ROLES.ADMIN])
)

// Methods
const handleSearch = async () => {
  userStore.setPagination({ current: 1 })
  await userStore.fetchUsers()
}

const handleResetFilters = async () => {
  userStore.resetFilters()
  await userStore.fetchUsers()
}

const handlePageChange = async (page, pageSize) => {
  if (pageSize) {
    userStore.setPagination({ current: 1, pageSize })
    await userStore.fetchUsers({ page: 0, limit: pageSize })
  } else {
    userStore.setPagination({ current: page })
    await userStore.fetchUsers({ page: page - 1 })
  }
}

const handleSortChange = async ({ sortField, sortType }) => {
  userStore.setFilters({ sortField, sortType })
  await userStore.fetchUsers()
}

const handleViewUser = async (user) => {
  viewingUser.value = user
  showViewDialog.value = true
}

const handleEditUser = (user) => {
  editingUser.value = { ...user }
  showEditDialog.value = true
}

const handleCreateUser = async (userData) => {
  try {
    await userStore.createUser(userData)
    showCreateDialog.value = false
    // Reload data after successful creation
    await userStore.fetchUsers()
  } catch (error) {
    console.error('Error creating user:', error)
  }
}

const handleUpdateUser = async (userData) => {
  try {
    await userStore.updateUser(userData)
    showEditDialog.value = false
    editingUser.value = null
    // Reload data after successful update
    await userStore.fetchUsers()
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

const handleDeleteUser = async (user) => {
  await userStore.deleteUser(user.id)
  // Reload data after successful deletion
  await userStore.fetchUsers()
}

const handleDeleteMultiple = async () => {
  const ids = selectedUsers.value.map(user => user.id)
  await userStore.deleteMultipleUsers(ids)
  selectedUsers.value = []
  // Reload data after successful deletion
  await userStore.fetchUsers()
}

// Lifecycle
onMounted(async () => {
  await userStore.fetchUsers()
})
</script>

<style scoped>
.user-list-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Mobile responsive styles */
@media (max-width: 640px) {
  .user-list-container {
    padding: 1rem;
  }
}

@media (max-width: 768px) {
  .user-list-container {
    max-width: 100%;
  }
}
</style>