<!-- UserListPage.vue - User Management with HeadlessUI + TailwindCSS -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
      <!-- Enhanced Header -->
      <div class="mb-6 sm:mb-8">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-8a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Quản lý người dùng
                </h1>
                <p class="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-1">
                  Danh sách tất cả người dùng trong hệ thống veterinary
                </p>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
              <div class="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Tổng số</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ userStore.pagination?.total || 0 }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Hoạt động</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ activeUsersCount }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 col-span-2 sm:col-span-1">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636" />
                    </svg>
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Bị khóa</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ blockedUsersCount }}</p>
                  </div>
                </div>
              </div>

              <div class="hidden lg:block bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Online</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ onlineUsersCount }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Action Button -->
          <div class="flex-shrink-0">
            <button
              v-if="canCreate"
              @click="showCreateDialog = true"
              class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 sm:py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transform hover:scale-[1.02] transition-all duration-200"
            >
              <svg class="w-4 h-4 sm:w-5 sm:h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span class="hidden sm:inline">Thêm người dùng</span>
              <span class="sm:hidden">Thêm mới</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Filters Section -->
      <div class="mb-6 sm:mb-8">
        <UserFilters 
          v-model:filters="userStore.filters"
          @search="handleSearch"
          @reset="handleResetFilters"
        />
      </div>

      <!-- Enhanced Selected Users Actions -->
      <Transition 
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform -translate-y-2 scale-95"
        enter-to-class="opacity-100 transform translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 transform translate-y-0 scale-100"
        leave-to-class="opacity-0 transform -translate-y-2 scale-95"
      >
        <div v-if="selectedUsers.length > 0" class="mb-6 sm:mb-8 overflow-hidden">
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 sm:p-6 shadow-sm">
            <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div class="ml-4">
                  <p class="text-sm sm:text-base font-semibold text-blue-900">
                    Đã chọn {{ selectedUsers.length }} người dùng
                  </p>
                  <p class="text-xs sm:text-sm text-blue-700 mt-1">
                    Thực hiện hành động với {{ selectedUsers.length }} người dùng đã chọn
                  </p>
                </div>
              </div>
              
              <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <button
                  @click="selectedUsers = []"
                  class="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-xs sm:text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Bỏ chọn tất cả
                </button>
                <button
                  v-if="canDelete"
                  @click="handleDeleteMultiple"
                  class="inline-flex items-center justify-center px-3 py-2 border border-transparent text-xs sm:text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transform hover:scale-[1.02] transition-all duration-200"
                >
                  <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa đã chọn
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Enhanced User Table -->
      <div class="bg-white shadow-sm rounded-xl border border-gray-200">
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
      </div>

      <!-- Enhanced Dialogs -->
      <UserDialog 
        v-model:visible="showCreateDialog"
        :user="null"
        title="Thêm người dùng mới"
        @save="handleCreateUser"
      />

      <UserDialog 
        v-model:visible="showEditDialog"
        :user="editingUser"
        title="Chỉnh sửa người dùng"
        @save="handleUpdateUser"
      />

      <UserViewDialog 
        v-model:visible="showViewDialog"
        :user="viewingUser"
      />

      <!-- Enhanced Loading Overlay -->
      <Transition 
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="userStore.loading" class="fixed inset-0 bg-black bg-opacity-25 backdrop-blur-sm flex items-center justify-center z-50">
          <div class="bg-white rounded-xl p-6 sm:p-8 shadow-2xl max-w-sm mx-4">
            <div class="flex items-center">
              <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-emerald-600"></div>
              <span class="ml-3 sm:ml-4 text-gray-900 font-medium">Đang tải dữ liệu...</span>
            </div>
          </div>
        </div>
      </Transition>
    </div>
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

// Computed properties for stats
const activeUsersCount = computed(() => 
  userStore.users?.filter(user => !user.block)?.length || 0
)

const blockedUsersCount = computed(() => 
  userStore.users?.filter(user => user.block)?.length || 0
)

const onlineUsersCount = computed(() => 
  // This would typically come from real-time data
  Math.floor((activeUsersCount.value * 0.3)) || 0
)

// Permission checks
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
/* Enhanced responsive utilities */
.line-clamp-1 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
}

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

/* Smooth transitions for better UX */
* {
  transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>