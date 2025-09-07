<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-20">
        <div class="bg-white rounded-lg p-8 shadow-xl">
          <div class="flex items-center space-x-3">
            <svg class="animate-spin h-6 w-6 text-emerald-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span class="text-gray-700 font-medium text-lg">Đang tải...</span>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-20">
        <div class="bg-white rounded-xl shadow-sm border border-red-200 p-8 max-w-md mx-auto">
          <ExclamationTriangleIcon class="mx-auto h-12 w-12 text-red-400 mb-4" />
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Có lỗi xảy ra</h3>
          <p class="text-sm text-gray-500 mb-6">{{ error }}</p>
          <button
            @click="goBack"
            class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 transition-all duration-200"
          >
            Quay lại
          </button>
        </div>
      </div>

      <!-- Content -->
      <div v-else-if="batch">
        <!-- Enhanced Header -->
        <div class="mb-6 sm:mb-8">
          <div class="flex items-center space-x-3 mb-4">
            <button
              @click="goBack"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-white shadow-sm transition-all duration-200"
            >
              <ArrowLeftIcon class="w-5 h-5" />
            </button>
            <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <svg class="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div class="flex-1">
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                Chi tiết lô vật liệu
              </h1>
              <p class="text-sm sm:text-base text-gray-600 mt-1">
                Thông tin chi tiết về lô {{ batch.batchNumber }}
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap gap-3">
            <button
              @click="goToEdit"
              class="inline-flex items-center px-3 sm:px-4 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-lg text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200 transform hover:scale-105"
            >
              <PencilIcon class="w-4 h-4 mr-2" />
              Chỉnh sửa
            </button>
          
            <button
              v-if="canUpdateQuantity"
              @click="showUpdateQuantityModal = true"
              class="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <ScaleIcon class="w-4 h-4 mr-2" />
              Cập nhật số lượng
            </button>
          
            <button
              v-if="canMove"
              @click="showMoveLocationModal = true"
              class="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <ArrowsRightLeftIcon class="w-4 h-4 mr-2" />
              Chuyển vị trí
            </button>
          
            <button
              v-if="canUpdateStatus"
              @click="showUpdateStatusModal = true"
              class="inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-200"
            >
              <CogIcon class="w-4 h-4 mr-2" />
              Cập nhật trạng thái
            </button>
          </div>
        </div>

        <!-- Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Main Content -->
          <div class="lg:col-span-2 space-y-6">
            <!-- Basic Information Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Thông tin cơ bản</h3>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Vật liệu</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-semibold">{{ batch.materialDto?.name }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mã lô</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">{{ batch.batchNumber }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mã lô nội bộ</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-mono">{{ batch.internalBatchCode || 'Chưa có' }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mã lô nhà sản xuất</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.manufacturerBatchNumber || 'Chưa có' }}</dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Quantity Information -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Thông tin số lượng</h3>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Số lượng nhập</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-semibold">
                      {{ formatNumber(batch.receivedQuantity) }} {{ batch.materialDto?.unitOfMeasure }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Số lượng hiện tại</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-semibold">
                      {{ formatNumber(batch.currentQuantity) }} {{ batch.materialDto?.unitOfMeasure }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Đơn giá</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-semibold">
                      {{ formatCurrency(batch.unitPrice) }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Date Information -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Thông tin ngày tháng</h3>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Ngày sản xuất</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(batch.manufacturingDate) }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Ngày hết hạn</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(batch.expiryDate) }}</dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Ngày nhập kho</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ formatDate(batch.receivedDate) }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <!-- Sidebar -->
          <div class="space-y-6">
            <!-- Status Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Trạng thái</h3>
              </div>
              <div class="p-6 space-y-4">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Trạng thái kiểm nghiệm</dt>
                  <dd class="mt-1">
                    <StatusBadge :status="batch.testStatus" type="test" />
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Trạng thái sử dụng</dt>
                  <dd class="mt-1">
                    <StatusBadge :status="batch.usageStatus" type="usage" />
                  </dd>
                </div>
              </div>
            </div>

            <!-- Location Card -->
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div class="px-6 py-4 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Vị trí lưu trữ</h3>
              </div>
              <div class="p-6">
                <div v-if="batch.locationDto">
                  <p class="text-sm font-medium text-gray-900">{{ batch.locationDto.locationCode }}</p>
                  <p class="text-sm text-gray-500">{{ batch.locationDto.warehouseDto?.name }}</p>
                </div>
                <div v-else class="text-sm text-gray-500">
                  Chưa có vị trí
                </div>
              </div>
            </div>

            <!-- Expiry Alert -->
            <ExpiryAlert v-if="batch.expiryDate" :expiry-date="batch.expiryDate" />
          </div>
        </div>

        <!-- Update Quantity Modal -->
        <UpdateQuantityModal
          :show="showUpdateQuantityModal"
          :batch="batch"
          @close="showUpdateQuantityModal = false"
          @save="handleSaveQuantity"
        />

        <!-- Move Location Modal -->
        <MoveLocationModal
          :show="showMoveLocationModal"
          :batch="batch"
          :locations="locations"
          @close="showMoveLocationModal = false"
          @save="handleSaveLocation"
        />

        <!-- Update Status Modal -->
        <UpdateStatusModal
          :show="showUpdateStatusModal"
          :batch="batch"
          @close="showUpdateStatusModal = false"
          @save="handleSaveStatus"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  ArrowLeftIcon,
  PencilIcon,
  ScaleIcon,
  ArrowsRightLeftIcon,
  CogIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'

import { useMaterialBatchStore } from '../store/materialBatchStore'
import StatusBadge from '../components/StatusBadge.vue'
import ExpiryAlert from '../components/ExpiryAlert.vue'
import UpdateQuantityModal from '../components/UpdateQuantityModal.vue'
import MoveLocationModal from '../components/MoveLocationModal.vue'
import UpdateStatusModal from '../components/UpdateStatusModal.vue'

const route = useRoute()
const router = useRouter()

// Store
const materialBatchStore = useMaterialBatchStore()
const { loading, error } = storeToRefs(materialBatchStore)

// Local state
const batch = ref(null)
const locations = ref([])
const showUpdateQuantityModal = ref(false)
const showMoveLocationModal = ref(false)
const showUpdateStatusModal = ref(false)

// Computed properties
const canUpdateQuantity = computed(() => {
  return batch.value && batch.value.usageStatus === 'SAN_SANG'
})

const canMove = computed(() => {
  return batch.value && batch.value.usageStatus !== 'DA_SU_DUNG'
})

const canUpdateStatus = computed(() => {
  return batch.value
})

// Methods
const loadBatch = async () => {
  try {
    const batchData = await materialBatchStore.fetchBatchById(route.params.id)
    batch.value = batchData
  } catch (error) {
    console.error('Failed to load batch:', error)
  }
}

const loadLocations = async () => {
  try {
    // Load locations from API
    const response = await axios.get('/api/locations')
    locations.value = response.data.data || response.data || []
  } catch (error) {
    console.error('Error loading locations:', error)
  }
}

const goBack = () => {
  router.push({ name: 'MaterialBatchList' })
}

const goToEdit = () => {
  router.push({ 
    name: 'EditMaterialBatch', 
    params: { id: batch.value.id } 
  })
}

const handleSaveQuantity = async (quantityData) => {
  try {
    const updatedBatch = await materialBatchStore.updateBatchQuantity(batch.value.id, quantityData)
    batch.value = updatedBatch
    showUpdateQuantityModal.value = false
  } catch (error) {
    console.error('Failed to update quantity:', error)
  }
}

const handleSaveLocation = async (locationData) => {
  try {
    const updatedBatch = await materialBatchStore.moveBatchLocation(batch.value.id, locationData)
    batch.value = updatedBatch
    showMoveLocationModal.value = false
  } catch (error) {
    console.error('Failed to move location:', error)
  }
}

const handleSaveStatus = async (statusData) => {
  try {
    let updatedBatch
    if (statusData.type === 'test') {
      updatedBatch = await materialBatchStore.updateBatchTestStatus(batch.value.id, statusData)
    } else {
      updatedBatch = await materialBatchStore.updateBatchUsageStatus(batch.value.id, statusData)
    }
    batch.value = updatedBatch
    showUpdateStatusModal.value = false
  } catch (error) {
    console.error('Failed to update status:', error)
  }
}

const formatNumber = (number) => {
  if (!number && number !== 0) return 'N/A'
  return new Intl.NumberFormat('vi-VN').format(number)
}

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return 'N/A'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (date) => {
  if (!date) return 'Chưa có'
  return new Date(date).toLocaleDateString('vi-VN')
}

onMounted(async () => {
  await Promise.all([
    loadBatch(),
    loadLocations()
  ])
})
</script>
