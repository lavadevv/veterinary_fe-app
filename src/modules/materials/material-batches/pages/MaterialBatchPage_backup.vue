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
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  Quản lý lô vật liệu
                </h1>
                <p class="text-sm sm:text-base text-gray-600 mt-1">
                  Theo dõi và quản lý thông tin các lô vật liệu trong kho
                </p>
              </div>
            </div>
            
            <!-- Stats Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Tổng lô</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ totalBatches }}</p>
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
                    <p class="text-xs text-gray-500 truncate">Sẵn sàng</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ readyBatches }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.732 15.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Cách ly</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ quarantineBatches }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Sắp hết hạn</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ expiredSoonBatches }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:ml-6">
            <button
              @click="refreshData"
              :disabled="loading"
              class="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105"
            >
              <ArrowPathIcon 
                :class="['w-4 h-4 mr-2', loading && 'animate-spin']" 
              />
              Làm mới
            </button>
            
            <button
              @click="goToCreate"
              class="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              Tạo lô mới
            </button>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      <Transition 
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 transform -translate-y-2 scale-95"
        enter-to-class="opacity-100 transform translate-y-0 scale-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 transform translate-y-0 scale-100"
        leave-to-class="opacity-0 transform -translate-y-2 scale-95"
      >
        <div v-if="materialBatchStore.error" class="mb-6">
          <div class="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
            <div class="flex">
              <div class="flex-shrink-0">
                <ExclamationCircleIcon class="h-5 w-5 text-red-400" />
              </div>
              <div class="ml-3 flex-1">
                <h3 class="text-sm font-medium text-red-800">
                  Có lỗi xảy ra
                </h3>
                <div class="mt-2 text-sm text-red-700">
                  <p>{{ materialBatchStore.error }}</p>
                </div>
                <div class="mt-4">
                  <div class="-mx-2 -my-1.5 flex">
                    <button
                      @click="materialBatchStore.error = null"
                      class="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600 transition-colors duration-200"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Main Content -->
      <div class="space-y-6">
        <!-- Batch List Component -->
        <BatchList
          :batches="batches"
          :loading="loading"
          :total="totalBatches"
          :current-page="currentPage"
          :total-pages="totalPages"
          :filters="filters"
          :materials="materials"
          @update:filters="handleFilterUpdate"
          @update:page="handlePageUpdate"
          @update:page-size="handlePageSizeUpdate"
          @create="goToCreate"
          @view="goToDetail"
          @edit="goToEdit"
          @update-quantity="handleUpdateQuantity"
          @move-location="handleMoveLocation"
          @update-status="handleUpdateStatus"
          @clear-filters="handleClearFilters"
        />
      </div>

      <!-- Loading Overlay -->
      <div v-if="loading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white rounded-lg p-6 shadow-xl">
          <div class="flex items-center space-x-3">
            <svg class="animate-spin h-5 w-5 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-700 font-medium">Đang tải...</span>
          </div>
        </div>
      </div>
      
      <!-- Update Quantity Modal -->
      <UpdateQuantityModal
        :show="showUpdateQuantityModal"
        :batch="selectedBatch"
        @close="closeUpdateQuantityModal"
        @save="handleSaveQuantity"
      />

      <!-- Move Location Modal -->
      <MoveLocationModal
        :show="showMoveLocationModal"
        :batch="selectedBatch"
        :locations="locations"
        @close="closeMoveLocationModal"
        @save="handleSaveLocation"
      />

      <!-- Update Status Modal -->
      <UpdateStatusModal
        :show="showUpdateStatusModal"
        :batch="selectedBatch"
        @close="closeUpdateStatusModal"
        @save="handleSaveStatus"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  ArrowPathIcon,
  PlusIcon,
  ExclamationCircleIcon
} from '@heroicons/vue/24/outline'

import { useMaterialBatchStore } from '../store/materialBatchStore'
import BatchList from '../components/BatchList.vue'
import UpdateQuantityModal from '../components/UpdateQuantityModal.vue'
import MoveLocationModal from '../components/MoveLocationModal.vue'
import UpdateStatusModal from '../components/UpdateStatusModal.vue'

// Store
const materialBatchStore = useMaterialBatchStore()
const { 
  batches, 
  loading, 
  totalBatches,
  filters,
  totalPages,
  currentPage
} = storeToRefs(materialBatchStore)

// Router
const router = useRouter()

// Local state
const materials = ref([])
const locations = ref([])
const selectedBatch = ref(null)
const showUpdateQuantityModal = ref(false)
const showMoveLocationModal = ref(false)
const showUpdateStatusModal = ref(false)

// Computed properties for stats
const readyBatches = computed(() => {
  return batches.value?.filter(batch => batch.status === 'READY').length || 0
})

const quarantineBatches = computed(() => {
  return batches.value?.filter(batch => batch.status === 'QUARANTINE').length || 0
})

const expiredSoonBatches = computed(() => {
  if (!batches.value) return 0
  const now = new Date()
  const daysThreshold = 30 // 30 days warning
  
  return batches.value.filter(batch => {
    if (!batch.expiryDate) return false
    const expiryDate = new Date(batch.expiryDate)
    const diffTime = expiryDate - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= daysThreshold && diffDays > 0
  }).length
})

// Load initial data
onMounted(() => {
  refreshData()
})

// Methods
const refreshData = async () => {
  try {
    await materialBatchStore.fetchBatches(filters.value)
  } catch (error) {
    console.error('Failed to fetch batches:', error)
  }
}

const goToCreate = () => {
  router.push({ name: 'CreateMaterialBatch' })
}

const goToDetail = (batch) => {
  router.push({ 
    name: 'MaterialBatchDetail', 
    params: { id: batch.id } 
  })
}

const goToEdit = (batch) => {
  router.push({ 
    name: 'EditMaterialBatch', 
    params: { id: batch.id } 
  })
}

const handleFilterUpdate = (newFilters) => {
  materialBatchStore.updateFilters(newFilters)
}

const handlePageUpdate = (page) => {
  materialBatchStore.updateCurrentPage(page)
}

const handlePageSizeUpdate = (pageSize) => {
  materialBatchStore.updatePageSize(pageSize)
}

const handleClearFilters = () => {
  materialBatchStore.clearFilters()
}

// Update quantity modal
const handleUpdateQuantity = (batch) => {
  selectedBatch.value = batch
  showUpdateQuantityModal.value = true
}

const closeUpdateQuantityModal = () => {
  selectedBatch.value = null
  showUpdateQuantityModal.value = false
}

const handleSaveQuantity = async (quantityData) => {
  try {
    await materialBatchStore.updateBatchQuantity(selectedBatch.value.id, quantityData)
    closeUpdateQuantityModal()
  } catch (error) {
    console.error('Failed to update quantity:', error)
  }
}

// Move location modal
const handleMoveLocation = (batch) => {
  selectedBatch.value = batch
  showMoveLocationModal.value = true
}

const closeMoveLocationModal = () => {
  selectedBatch.value = null
  showMoveLocationModal.value = false
}

const handleSaveLocation = async (locationData) => {
  try {
    await materialBatchStore.moveBatchLocation(selectedBatch.value.id, locationData)
    closeMoveLocationModal()
  } catch (error) {
    console.error('Failed to move location:', error)
  }
}

// Update status modal
const handleUpdateStatus = (batch) => {
  selectedBatch.value = batch
  showUpdateStatusModal.value = true
}

const closeUpdateStatusModal = () => {
  selectedBatch.value = null
  showUpdateStatusModal.value = false
}

const handleSaveStatus = async (statusData) => {
  try {
    if (statusData.type === 'test') {
      await materialBatchStore.updateBatchTestStatus(selectedBatch.value.id, statusData)
    } else {
      await materialBatchStore.updateBatchUsageStatus(selectedBatch.value.id, statusData)
    }
    closeUpdateStatusModal()
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

// Watch for route changes to refresh data
watch(() => router.currentRoute.value.name, (newName) => {
  if (newName === 'MaterialBatches') {
    refreshData()
  }
})
</script>
onMounted(async () => {
  await Promise.all([
    loadBatches(),
    loadMaterials(),
    loadLocations()
  ])
})

const loadBatches = async () => {
  try {
    await materialBatchStore.fetchBatches()
  } catch (error) {
    console.error('Failed to load batches:', error)
  }
}

const loadMaterials = async () => {
  try {
    // Import material service when needed
    const { getMaterials } = await import('../../material/services/material.service')
    const response = await getMaterials({ limit: 100 })
    if (response.data.success) {
      materials.value = response.data.data.items || []
    }
  } catch (error) {
    console.error('Failed to load materials:', error)
    materials.value = []
  }
}

const loadLocations = async () => {
  try {
    // Import location service when needed
    const { getLocations } = await import('../../location/services/location.service')
    const response = await getLocations({ limit: 100 })
    if (response.data.success) {
      locations.value = response.data.data.items || []
    }
  } catch (error) {
    console.error('Failed to load locations:', error)
    locations.value = []
  }
}

const refreshData = async () => {
  await loadBatches()
}

const handleFilterUpdate = async (newFilters) => {
  materialBatchStore.setFilters(newFilters)
  await loadBatches()
}

const handlePageUpdate = async (page) => {
  materialBatchStore.setPage(page)
  await loadBatches()
}

const handlePageSizeUpdate = async (size) => {
  materialBatchStore.setPageSize(size)
  await loadBatches()
}

const handleClearFilters = async () => {
  materialBatchStore.clearFilters()
  await loadBatches()
}

// Navigation
const goToCreate = () => {
  router.push({ name: 'MaterialBatchCreate' })
}

const goToDetail = (batch) => {
  router.push({ 
    name: 'MaterialBatchDetail', 
    params: { id: batch.id } 
  })
}

const goToEdit = (batch) => {
  router.push({ 
    name: 'MaterialBatchEdit', 
    params: { id: batch.id } 
  })
}

// Modal handlers
const handleUpdateQuantity = (batch) => {
  selectedBatch.value = batch
  showUpdateQuantityModal.value = true
}

const closeUpdateQuantityModal = () => {
  selectedBatch.value = null
  showUpdateQuantityModal.value = false
}

const handleSaveQuantity = async (quantityData) => {
  try {
    await materialBatchStore.updateBatchQuantity(selectedBatch.value.id, quantityData)
    closeUpdateQuantityModal()
  } catch (error) {
    console.error('Failed to update quantity:', error)
  }
}

const handleMoveLocation = (batch) => {
  selectedBatch.value = batch
  showMoveLocationModal.value = true
}

const closeMoveLocationModal = () => {
  selectedBatch.value = null
  showMoveLocationModal.value = false
}

const handleSaveLocation = async (locationData) => {
  try {
    await materialBatchStore.moveBatchLocation(selectedBatch.value.id, locationData)
    closeMoveLocationModal()
  } catch (error) {
    console.error('Failed to move location:', error)
  }
}

const handleUpdateStatus = (batch) => {
  selectedBatch.value = batch
  showUpdateStatusModal.value = true
}

const closeUpdateStatusModal = () => {
  selectedBatch.value = null
  showUpdateStatusModal.value = false
}

const handleSaveStatus = async (statusData) => {
  try {
    if (statusData.type === 'test') {
      await materialBatchStore.updateBatchTestStatus(selectedBatch.value.id, statusData)
    } else {
      await materialBatchStore.updateBatchUsageStatus(selectedBatch.value.id, statusData)
    }
    closeUpdateStatusModal()
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

// Watch for route changes to refresh data
watch(() => router.currentRoute.value.name, (newName) => {
  if (newName === 'MaterialBatches') {
    refreshData()
  }
})
</script>
