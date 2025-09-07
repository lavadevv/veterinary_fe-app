<!-- LocationListPage.vue - Trang quản lý danh sách location -->
<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
      <!-- Header -->
      <div class="mb-6 sm:mb-8">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <MapPinIcon class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                  Quản lý vị trí kho
                </h1>
                <p class="mt-1 text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-1">
                  Quản lý và theo dõi các vị trí trong kho hàng
                </p>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mt-4">
              <div class="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPinIcon class="w-4 h-4 text-blue-600" />
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Tổng số</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ capacityStats.total }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckCircleIcon class="w-4 h-4 text-green-600" />
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Khả dụng</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ capacityStats.available }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100 col-span-2 sm:col-span-1">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon class="w-4 h-4 text-yellow-600" />
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Tỷ lệ sử dụng</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ capacityStats.utilizationRate.toFixed(1) }}%</p>
                  </div>
                </div>
              </div>

              <div class="hidden lg:block bg-white rounded-lg p-3 sm:p-4 shadow-sm border border-gray-100">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CubeIcon class="w-4 h-4 text-purple-600" />
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Tổng sức chứa</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ formatCapacity(capacityStats.totalCapacity) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              @click="toggleFilter"
              class="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 lg:hidden"
            >
              <FunnelIcon class="w-4 h-4 mr-2" />
              Bộ lọc
              <span v-if="hasActiveFilters" class="ml-1 bg-blue-600 text-white text-xs rounded-full w-2 h-2"></span>
            </button>

            <button
              @click="handleExport"
              :disabled="loading"
              class="inline-flex items-center justify-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50"
            >
              <ArrowDownTrayIcon class="w-4 h-4 mr-2" />
              Xuất dữ liệu
            </button>

            <button
              v-if="canCreate"
              @click="openCreateModal"
              class="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 sm:py-2 border border-transparent text-sm font-medium rounded-xl shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-[1.02] transition-all duration-200"
            >
              <PlusIcon class="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              <span class="hidden sm:inline">Thêm vị trí</span>
              <span class="sm:hidden">Thêm mới</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- Filter Sidebar (Desktop) -->
        <div class="hidden lg:block w-80 flex-shrink-0">
          <LocationFilter
            :filters="locationStore.filters"
            :warehouses="warehouses"
            @update="handleFilterUpdate"
            @clear="handleFilterClear"
          />
        </div>

        <!-- Mobile Filter Modal -->
        <TransitionRoot :show="isFilterOpen" as="template">
          <Dialog @close="setFilterOpen(false)" class="relative z-50 lg:hidden">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0"
              enter-to="opacity-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100"
              leave-to="opacity-0"
            >
              <div class="fixed inset-0 bg-black bg-opacity-25" />
            </TransitionChild>

            <div class="fixed inset-0 z-10 overflow-y-auto">
              <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <TransitionChild
                  as="template"
                  enter="duration-300 ease-out"
                  enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enter-to="opacity-100 translate-y-0 sm:scale-100"
                  leave="duration-200 ease-in"
                  leave-from="opacity-100 translate-y-0 sm:scale-100"
                  leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <LocationFilter
                      :filters="locationStore.filters"
                      :warehouses="warehouses"
                      @update="handleFilterUpdate"
                      @clear="handleFilterClear"
                      @toggle="setFilterOpen(false)"
                    />
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </TransitionRoot>

        <!-- Main Content -->
        <div class="flex-1 min-w-0">
          <!-- Search and Tools -->
          <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
            <div class="p-4 border-b border-gray-200">
              <div class="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
                <!-- Search -->
                <div class="flex-1 max-w-lg">
                  <div class="relative">
                    <input
                      v-model="searchQuery"
                      type="text"
                      class="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tìm kiếm theo mã vị trí, kệ, tầng..."
                    />
                    <MagnifyingGlassIcon class="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <!-- View Toggle -->
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-700">Hiển thị:</span>
                  <div class="inline-flex rounded-lg border border-gray-200 p-1">
                    <button
                      @click="viewMode = 'card'"
                      :class="[
                        'px-3 py-1.5 text-sm rounded-md transition-colors duration-200',
                        viewMode === 'card' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'
                      ]"
                    >
                      <Squares2X2Icon class="w-4 h-4" />
                    </button>
                    <button
                      @click="viewMode = 'table'"
                      :class="[
                        'px-3 py-1.5 text-sm rounded-md transition-colors duration-200',
                        viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:text-gray-900'
                      ]"
                    >
                      <Bars3Icon class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Bulk Actions -->
            <div v-if="selectedLocations.length > 0" class="p-4 bg-blue-50 border-b border-blue-200">
              <div class="flex items-center justify-between">
                <div class="flex items-center space-x-3">
                  <span class="text-sm font-medium text-blue-700">
                    Đã chọn {{ selectedLocations.length }} vị trí
                  </span>
                  <button
                    @click="clearSelection"
                    class="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Bỏ chọn
                  </button>
                </div>

                <div class="flex items-center space-x-2">
                  <button
                    @click="handleBulkToggleStatus"
                    class="inline-flex items-center px-3 py-1.5 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50 transition-colors duration-200"
                  >
                    <ArrowPathIcon class="w-4 h-4 mr-1.5" />
                    Đổi trạng thái
                  </button>

                  <button
                    v-if="canDelete"
                    @click="handleBulkDelete"
                    class="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors duration-200"
                  >
                    <TrashIcon class="w-4 h-4 mr-1.5" />
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="flex items-center justify-center py-12">
            <div class="flex items-center space-x-3">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span class="text-gray-600">Đang tải dữ liệu...</span>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else-if="!loading && locations.length === 0" class="text-center py-12">
            <div class="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MapPinIcon class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">Chưa có vị trí kho nào</h3>
            <p class="text-gray-600 mb-6">
              {{ hasActiveFilters ? 'Không tìm thấy vị trí kho nào phù hợp với bộ lọc.' : 'Hãy tạo vị trí kho đầu tiên của bạn.' }}
            </p>
            <button
              v-if="!hasActiveFilters && canCreate"
              @click="openCreateModal"
              class="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Tạo vị trí kho
            </button>
            <button
              v-else-if="hasActiveFilters"
              @click="handleFilterClear"
              class="inline-flex items-center px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors duration-200"
            >
              <XMarkIcon class="w-4 h-4 mr-2" />
              Xóa bộ lọc
            </button>
          </div>

          <!-- Content Display -->
          <div v-else>
            <!-- Card View -->
            <div v-if="viewMode === 'card'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div
                v-for="location in locations"
                :key="location.id"
                class="relative"
              >
                <!-- Selection Checkbox -->
                <div v-if="canSelect" class="absolute top-2 left-2 z-10">
                  <input
                    v-model="selectedLocations"
                    :value="location.id"
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                <LocationCard
                  :location="location"
                  :can-edit="canEdit"
                  :can-delete="canDelete"
                  :can-toggle-status="canToggleStatus"
                  @view="handleView"
                  @edit="handleEdit"
                  @delete="handleDelete"
                  @toggle-status="handleToggleStatus"
                />
              </div>
            </div>

            <!-- Table View -->
            <LocationTable
              v-else
              :locations="locations"
              :selected-locations="selectedLocations"
              :can-select="canSelect"
              :can-edit="canEdit"
              :can-delete="canDelete"
              :can-toggle-status="canToggleStatus"
              @select="handleSelect"
              @select-all="handleSelectAll"
              @view="handleView"
              @edit="handleEdit"
              @delete="handleDelete"
              @toggle-status="handleToggleStatus"
            />

            <!-- Pagination -->
            <LocationPagination
              v-if="pagination.totalPages > 1"
              :pagination="pagination"
              @change="handlePageChange"
              class="mt-6"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Location Modal -->
    <LocationModal
      :is-open="modal.isOpen"
      :mode="modal.mode"
      :location="modal.location"
      :warehouses="warehouses"
      :loading="modal.loading"
      :can-edit="canEdit"
      :can-delete="canDelete"
      @close="closeModal"
      @submit="handleModalSubmit"
      @edit="handleModalEdit"
      @delete="handleModalDelete"
      @delete-confirm="handleModalDeleteConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import {
  TransitionRoot,
  TransitionChild,
  Dialog,
  DialogPanel
} from '@headlessui/vue'
import {
  MapPinIcon,
  CheckCircleIcon,
  ChartBarIcon,
  CubeIcon,
  PlusIcon,
  FunnelIcon,
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  Bars3Icon,
  ArrowPathIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

import { useLocationStore } from '../store/locationStore'
import { useToast } from '@/config/toast'
import LocationCard from '../components/LocationCard.vue'
import LocationTable from '../components/LocationTable.vue'
import LocationFilter from '../components/LocationFilter.vue'
import LocationModal from '../components/LocationModal.vue'
import LocationPagination from '../components/LocationPagination.vue'

// Store and composables
const locationStore = useLocationStore()
const { showSuccess, showError } = useToast()

// Reactive references from store
const { 
  pagination, 
  capacityStats, 
  loading, 
  error,
  warehouses 
} = storeToRefs(locationStore)

// Computed to ensure locations is always an array
const locations = computed(() => Array.isArray(locationStore.locations) ? locationStore.locations : [])

// Local state
const searchQuery = ref('')
const selectedLocations = ref([])
const viewMode = ref('card')
const isFilterOpen = ref(false)

// Modal state
const modal = ref({
  isOpen: false,
  mode: 'create', // create, edit, view, delete
  location: {},
  loading: false
})

// Permissions (you might want to get these from auth store)
const canCreate = ref(true)
const canEdit = ref(true)
const canDelete = ref(true)
const canSelect = ref(true)
const canToggleStatus = ref(true)

// Computed
const hasActiveFilters = computed(() => {
  const filters = locationStore.filters
  return filters.keywords || filters.warehouseId || filters.isAvailable !== null ||
         filters.minCapacity || filters.maxCapacity
})

// Methods
const formatCapacity = (capacity) => {
  if (!capacity) return '0'
  if (capacity >= 1000) {
    return (capacity / 1000).toFixed(1) + 'K'
  }
  return capacity.toString()
}

const toggleFilter = () => {
  isFilterOpen.value = !isFilterOpen.value
}

const setFilterOpen = (value) => {
  isFilterOpen.value = value
}

const loadData = async () => {
  try {
    await locationStore.fetchLocations()
  } catch (error) {
    console.error('Error loading locations:', error)
  }
}

const loadWarehouses = async () => {
  await locationStore.loadWarehouses()
}

// Filter handlers
const handleFilterUpdate = (filters) => {
  locationStore.updateFilters(filters)
  loadData()
}

const handleFilterClear = () => {
  locationStore.resetFilters()
  loadData()
}

// Modal handlers
const openCreateModal = () => {
  modal.value = {
    isOpen: true,
    mode: 'create',
    location: {},
    loading: false
  }
}

const closeModal = () => {
  modal.value.isOpen = false
  setTimeout(() => {
    modal.value = {
      isOpen: false,
      mode: 'create',
      location: {},
      loading: false
    }
  }, 300)
}

const handleModalSubmit = async (data) => {
  modal.value.loading = true
  
  try {
    if (modal.value.mode === 'create') {
      await locationStore.createLocation(data)
    } else if (modal.value.mode === 'edit') {
      await locationStore.updateLocation(modal.value.location.id, data)
    }
    
    closeModal()
    await loadData()
  } catch (error) {
    console.error('Error submitting location:', error)
  } finally {
    modal.value.loading = false
  }
}

const handleModalEdit = (location) => {
  modal.value = {
    isOpen: true,
    mode: 'edit',
    location,
    loading: false
  }
}

const handleModalDelete = (location) => {
  modal.value = {
    isOpen: true,
    mode: 'delete',
    location,
    loading: false
  }
}

const handleModalDeleteConfirm = async (location) => {
  modal.value.loading = true
  
  try {
    await locationStore.deleteLocation(location.id)
    closeModal()
    await loadData()
  } catch (error) {
    console.error('Error deleting location:', error)
  } finally {
    modal.value.loading = false
  }
}

// Action handlers
const handleView = (location) => {
  modal.value = {
    isOpen: true,
    mode: 'view',
    location,
    loading: false
  }
}

const handleEdit = (location) => {
  handleModalEdit(location)
}

const handleDelete = (location) => {
  handleModalDelete(location)
}

const handleToggleStatus = async (location) => {
  try {
    await locationStore.toggleAvailability(location.id)
    await loadData()
  } catch (error) {
    console.error('Error toggling status:', error)
  }
}

// Selection handlers
const handleSelect = (locationIds) => {
  selectedLocations.value = locationIds
}

const handleSelectAll = (isSelected) => {
  selectedLocations.value = isSelected ? locations.value.map(l => l.id) : []
}

const clearSelection = () => {
  selectedLocations.value = []
}

// Bulk actions
const handleBulkToggleStatus = async () => {
  try {
    const promises = selectedLocations.value.map(id => 
      locationStore.toggleAvailability(id)
    )
    await Promise.all(promises)
    showSuccess(`Đã cập nhật trạng thái ${selectedLocations.value.length} vị trí`)
    clearSelection()
    await loadData()
  } catch (error) {
    showError('Lỗi khi cập nhật trạng thái')
  }
}

const handleBulkDelete = async () => {
  if (confirm(`Bạn có chắc chắn muốn xóa ${selectedLocations.value.length} vị trí đã chọn?`)) {
    try {
      await locationStore.deleteMultipleLocations(selectedLocations.value)
      clearSelection()
      await loadData()
    } catch (error) {
      showError('Lỗi khi xóa vị trí')
    }
  }
}

// Export handler
const handleExport = async () => {
  try {
    await locationStore.exportData('excel')
  } catch (error) {
    showError('Lỗi khi xuất dữ liệu')
  }
}

// Pagination handler
const handlePageChange = (page) => {
  locationStore.setPagination({ currentPage: page })
  loadData()
}

// Search watcher với debounce
let searchTimeout = null
watch(searchQuery, (newQuery) => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    locationStore.updateFilters({ keywords: newQuery })
    loadData()
  }, 500)
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadData(),
    loadWarehouses()
  ])
})
</script>
