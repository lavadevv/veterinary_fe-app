<!-- WarehouseListPage.vue - Warehouse Management with HeadlessUI + TailwindCSS -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
      <!-- Enhanced Header -->
      <div class="mb-6 sm:mb-8">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  Quản lý kho
                </h1>
                <p class="text-sm sm:text-base text-gray-600 mt-1">
                  Quản lý thông tin kho và theo dõi hoạt động
                </p>
              </div>
            </div>
            
            <!-- Stats Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Tổng kho</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ warehouseStore.warehouseCount }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Hoạt động</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ warehouseStore.activeWarehouseCount }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Ngừng hoạt động</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ warehouseStore.inactiveWarehouseCount }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Tổng vị trí</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ locationStore.capacityStats.total }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Action Button -->
          <div class="flex-shrink-0 flex space-x-2 sm:space-x-3">
            <button
              v-if="canCreate"
              @click="showCreateDialog = true"
              class="inline-flex items-center justify-center px-3 sm:px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200"
            >
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span class="hidden sm:inline">Thêm kho</span>
              <span class="sm:hidden">Thêm mới</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Enhanced Filters Section -->
      <div class="mb-6 sm:mb-8">
        <WarehouseFilters 
          v-model:filters="warehouseStore.filters"
          @search="handleSearch"
          @reset="handleResetFilters"
        />
      </div>

      <!-- Enhanced Selected Warehouses Actions -->
      <Transition 
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform -translate-y-2 scale-95"
        enter-to-class="opacity-100 transform translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 transform translate-y-0 scale-100"
        leave-to-class="opacity-0 transform -translate-y-2 scale-95"
      >
        <div v-if="selectedWarehouses.length > 0" class="mb-6">
          <div class="bg-blue-50 border border-blue-200 rounded-xl p-4 sm:p-6">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-blue-900">
                    Đã chọn {{ selectedWarehouses.length }} kho
                  </p>
                  <p class="text-xs text-blue-700">Thực hiện hành động cho các kho đã chọn</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="clearSelection"
                  class="inline-flex items-center px-3 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  Bỏ chọn
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Enhanced Warehouse Table -->
      <div class="bg-white shadow-sm rounded-xl border border-gray-200">
        <WarehouseTable 
          :warehouses="warehouseStore.warehouses"
          :loading="warehouseStore.loading"
          :pagination="warehouseStore.pagination"
          v-model:selected="selectedWarehouses"
          @view="handleViewWarehouse"
          @edit="handleEditWarehouse"
          @toggle-status="handleToggleStatus"
          @page-change="handlePageChange"
          @sort-change="handleSortChange"
        />
      </div>
    </div>

    <!-- Dialogs -->
    <WarehouseDialog
      :visible="showCreateDialog"
      title="Tạo kho mới"
      @close="showCreateDialog = false"
      @success="handleCreateSuccess"
    />

    <WarehouseDialog
      :visible="showEditDialog"
      :warehouse="editingWarehouse"
      title="Chỉnh sửa kho"
      @close="showEditDialog = false"
      @success="handleUpdateSuccess"
    />

    <WarehouseViewDialog
      v-model:visible="showViewDialog"
      :warehouse="viewingWarehouse"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWarehouseStore } from '../store/warehouseStore'
import { useLocationStore } from '../../location/store/locationStore'
import { useAuthStore } from '@/modules/auth'
import { ROLES } from '@/modules/auth/constants/roles'
import WarehouseFilters from '../components/WarehouseFilters.vue'
import WarehouseTable from '../components/WarehouseTable.vue'
import WarehouseDialog from '../components/WarehouseDialog.vue'
import WarehouseViewDialog from '../components/WarehouseViewDialog.vue'

// Stores
const warehouseStore = useWarehouseStore()
const locationStore = useLocationStore()
const authStore = useAuthStore()

// Reactive data
const selectedWarehouses = ref([])
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const showViewDialog = ref(false)
const editingWarehouse = ref(null)
const viewingWarehouse = ref(null)

// Permission checks
const canCreate = computed(() => 
  authStore.hasPermission && authStore.hasPermission([ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER])
)

// Methods
const handleSearch = async () => {
  warehouseStore.setPagination({ current: 1 })
  await warehouseStore.fetchWarehouses()
}

const handleResetFilters = async () => {
  warehouseStore.resetFilters()
  await warehouseStore.fetchWarehouses()
}

const handlePageChange = async (page, pageSize) => {
  if (pageSize) {
    warehouseStore.setPagination({ current: 1, pageSize })
    await warehouseStore.fetchWarehouses({ page: 0, limit: pageSize })
  } else {
    warehouseStore.setPagination({ current: page })
    await warehouseStore.fetchWarehouses({ page: page - 1 })
  }
}

const handleSortChange = async ({ sortField, sortType }) => {
  warehouseStore.setFilters({ sortField, sortType })
  await warehouseStore.fetchWarehouses()
}

const clearSelection = () => {
  selectedWarehouses.value = []
}

const handleViewWarehouse = async (warehouse) => {
  viewingWarehouse.value = warehouse
  showViewDialog.value = true
}

const handleEditWarehouse = (warehouse) => {
  editingWarehouse.value = { ...warehouse }
  showEditDialog.value = true
}

const handleCreateWarehouse = () => {
  showCreateDialog.value = true
}

const handleCreateSuccess = async (result) => {
  if (result.type === 'success') {
    // Show success message (you can add a toast notification here)
    console.log(result.message)
    // Reload data after successful creation
    await warehouseStore.fetchWarehouses()
  } else {
    // Show error message
    console.error(result.message)
  }
}

const handleUpdateSuccess = async (result) => {
  if (result.type === 'success') {
    // Show success message
    console.log(result.message)
    // Reload data after successful update
    await warehouseStore.fetchWarehouses()
  } else {
    // Show error message
    console.error(result.message)
  }
}

const handleUpdateWarehouse = async (warehouseData) => {
  try {
    await warehouseStore.updateExistingWarehouse(warehouseData.id, warehouseData)
    showEditDialog.value = false
    editingWarehouse.value = null
    // Reload data after successful update
    await warehouseStore.fetchWarehouses()
  } catch (error) {
    console.error('Error updating warehouse:', error)
  }
}

const handleToggleStatus = async (warehouse) => {
  if (confirm(`Bạn có chắc chắn muốn ${warehouse.isActive ? 'ngừng hoạt động' : 'kích hoạt'} kho "${warehouse.warehouseName}"?`)) {
    try {
      await warehouseStore.toggleWarehouseActivation(warehouse.id)
    } catch (error) {
      console.error('Error toggling warehouse status:', error)
    }
  }
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    warehouseStore.fetchWarehouses(),
    locationStore.fetchLocations() // Fetch locations để có dữ liệu cho stats
  ])
})
</script>
