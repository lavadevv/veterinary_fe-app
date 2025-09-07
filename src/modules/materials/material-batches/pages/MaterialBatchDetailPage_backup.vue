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
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ScaleIcon class="w-4 h-4 mr-2" />
              Cập nhật số lượng
            </button>
          
            <button
              v-if="canMove"
              @click="showMoveLocationModal = true"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <ArrowsRightLeftIcon class="w-4 h-4 mr-2" />
              Chuyển vị trí
            </button>
          
            <button
              v-if="canUpdateStatus"
              @click="showUpdateStatusModal = true"
              class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <CogIcon class="w-4 h-4 mr-2" />
              Cập nhật trạng thái
            </button>
          </div>
      </div>

      <!-- Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Basic Information -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Thông tin cơ bản</h3>
            </div>
            <div class="px-6 py-4">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Số lô</dt>
                  <dd class="mt-1 text-sm text-gray-900 font-semibold">{{ batch.batchNumber }}</dd>
                </div>
                <div v-if="batch.internalBatchCode">
                  <dt class="text-sm font-medium text-gray-500">Mã lô nội bộ</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ batch.internalBatchCode }}</dd>
                </div>
                <div v-if="batch.manufacturerBatchNumber">
                  <dt class="text-sm font-medium text-gray-500">Số lô nhà sản xuất</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ batch.manufacturerBatchNumber }}</dd>
                </div>
                <div v-if="batch.coaNumber">
                  <dt class="text-sm font-medium text-gray-500">Số COA</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ batch.coaNumber }}</dd>
                </div>
                <div v-if="batch.testReportNumber">
                  <dt class="text-sm font-medium text-gray-500">Số báo cáo kiểm nghiệm</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ batch.testReportNumber }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Material Information -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Thông tin vật liệu</h3>
            </div>
            <div class="px-6 py-4">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Mã vật liệu</dt>
                  <dd class="mt-1 text-sm text-gray-900 font-semibold">{{ batch.materialDto?.materialCode }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Tên vật liệu</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto?.materialName }}</dd>
                </div>
                <div v-if="batch.materialDto?.shortName">
                  <dt class="text-sm font-medium text-gray-500">Tên viết tắt</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto.shortName }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Loại vật liệu</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ getMaterialTypeLabel(batch.materialDto?.materialType) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Hình thái</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ getMaterialFormLabel(batch.materialDto?.materialForm) }}</dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Đơn vị đo</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto?.unitOfMeasure }}</dd>
                </div>
                <div v-if="batch.materialDto?.supplierDto">
                  <dt class="text-sm font-medium text-gray-500">Nhà cung cấp</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ batch.materialDto.supplierDto.supplierName }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Quantity and Pricing -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Số lượng và giá cả</h3>
            </div>
            <div class="px-6 py-4">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Số lượng nhận</dt>
                  <dd class="mt-1 text-sm text-gray-900 font-semibold">
                    {{ formatNumber(batch.receivedQuantity) }} {{ batch.materialDto?.unitOfMeasure }}
                  </dd>
                </div>
                <div>
                  <dt class="text-sm font-medium text-gray-500">Số lượng hiện tại</dt>
                  <dd class="mt-1 text-sm font-semibold" :class="getQuantityColor(batch)">
                    {{ formatNumber(batch.currentQuantity) }} {{ batch.materialDto?.unitOfMeasure }}
                  </dd>
                </div>
                <div v-if="batch.unitPrice">
                  <dt class="text-sm font-medium text-gray-500">Đơn giá</dt>
                  <dd class="mt-1 text-sm text-gray-900 font-semibold">{{ formatCurrency(batch.unitPrice) }}</dd>
                </div>
                <div v-if="batch.unitPrice">
                  <dt class="text-sm font-medium text-gray-500">Tổng giá trị</dt>
                  <dd class="mt-1 text-sm text-gray-900 font-semibold">
                    {{ formatCurrency(batch.currentQuantity * batch.unitPrice) }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Dates -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Thông tin ngày tháng</h3>
            </div>
            <div class="px-6 py-4">
              <dl class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt class="text-sm font-medium text-gray-500">Ngày nhận</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(batch.receivedDate) }}</dd>
                </div>
                <div v-if="batch.manufacturingDate">
                  <dt class="text-sm font-medium text-gray-500">Ngày sản xuất</dt>
                  <dd class="mt-1 text-sm text-gray-900">{{ formatDate(batch.manufacturingDate) }}</dd>
                </div>
                <div v-if="batch.expiryDate">
                  <dt class="text-sm font-medium text-gray-500">Ngày hết hạn</dt>
                  <dd class="mt-1 text-sm text-gray-900 flex items-center space-x-2">
                    <span>{{ formatDate(batch.expiryDate) }}</span>
                    <ExpiryAlert :expiry-date="batch.expiryDate" />
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Notes -->
          <div v-if="batch.notes || batch.quarantineReason" class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Ghi chú</h3>
            </div>
            <div class="px-6 py-4 space-y-4">
              <div v-if="batch.notes">
                <dt class="text-sm font-medium text-gray-500">Ghi chú chung</dt>
                <dd class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ batch.notes }}</dd>
              </div>
              <div v-if="batch.quarantineReason">
                <dt class="text-sm font-medium text-gray-500">Lý do cách ly</dt>
                <dd class="mt-1 text-sm text-gray-900 whitespace-pre-wrap">{{ batch.quarantineReason }}</dd>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Status -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Trạng thái</h3>
            </div>
            <div class="px-6 py-4 space-y-4">
              <div>
                <dt class="text-sm font-medium text-gray-500">Trạng thái kiểm nghiệm</dt>
                <dd class="mt-1">
                  <StatusBadge type="test" :status="batch.testStatus" />
                </dd>
              </div>
              <div>
                <dt class="text-sm font-medium text-gray-500">Trạng thái sử dụng</dt>
                <dd class="mt-1">
                  <StatusBadge type="usage" :status="batch.usageStatus" />
                </dd>
              </div>
            </div>
          </div>

          <!-- Location -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Vị trí lưu trữ</h3>
            </div>
            <div class="px-6 py-4">
              <div v-if="batch.locationDto">
                <dl class="space-y-3">
                  <div>
                    <dt class="text-sm font-medium text-gray-500">Mã vị trí</dt>
                    <dd class="mt-1 text-sm text-gray-900 font-semibold">{{ batch.locationDto.locationCode }}</dd>
                  </div>
                  <div v-if="batch.locationDto.warehouseDto">
                    <dt class="text-sm font-medium text-gray-500">Kho</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.locationDto.warehouseDto.warehouseName }}</dd>
                  </div>
                  <div v-if="batch.locationDto.floor">
                    <dt class="text-sm font-medium text-gray-500">Tầng</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.locationDto.floor }}</dd>
                  </div>
                  <div v-if="batch.locationDto.shelf">
                    <dt class="text-sm font-medium text-gray-500">Kệ</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.locationDto.shelf }}</dd>
                  </div>
                  <div v-if="batch.locationDto.positionDetail">
                    <dt class="text-sm font-medium text-gray-500">Vị trí chi tiết</dt>
                    <dd class="mt-1 text-sm text-gray-900">{{ batch.locationDto.positionDetail }}</dd>
                  </div>
                </dl>
              </div>
              <div v-else class="text-sm text-gray-500 italic">
                Chưa có vị trí lưu trữ
              </div>
            </div>
          </div>

          <!-- Files -->
          <div v-if="hasFiles" class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Tài liệu đính kèm</h3>
            </div>
            <div class="px-6 py-4">
              <ul class="space-y-3">
                <li v-if="batch.coaFilePath" class="flex items-center justify-between">
                  <span class="text-sm text-gray-900">File COA</span>
                  <button class="text-sm text-blue-600 hover:text-blue-800">Tải về</button>
                </li>
                <li v-if="batch.msdsFilePath" class="flex items-center justify-between">
                  <span class="text-sm text-gray-900">File MSDS</span>
                  <button class="text-sm text-blue-600 hover:text-blue-800">Tải về</button>
                </li>
                <li v-if="batch.testCertificatePath" class="flex items-center justify-between">
                  <span class="text-sm text-gray-900">Chứng nhận kiểm nghiệm</span>
                  <button class="text-sm text-blue-600 hover:text-blue-800">Tải về</button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Quick Stats -->
          <div class="bg-white shadow rounded-lg">
            <div class="px-6 py-4 border-b border-gray-200">
              <h3 class="text-lg font-medium text-gray-900">Thống kê nhanh</h3>
            </div>
            <div class="px-6 py-4 space-y-3">
              <div class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Tỷ lệ sử dụng</span>
                <span class="text-sm font-medium text-gray-900">{{ getUsagePercentage() }}%</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  class="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                  :style="{ width: `${getUsagePercentage()}%` }"
                ></div>
              </div>
              <div v-if="batch.expiryDate" class="flex justify-between items-center">
                <span class="text-sm text-gray-500">Ngày hết hạn</span>
                <span class="text-sm font-medium" :class="getExpiryColor()">
                  {{ getDaysToExpiry() }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <UpdateQuantityModal
        :show="showUpdateQuantityModal"
        :batch="batch"
        @close="showUpdateQuantityModal = false"
        @save="handleSaveQuantity"
      />

      <MoveLocationModal
        :show="showMoveLocationModal"
        :batch="batch"
        :locations="locations"
        @close="showMoveLocationModal = false"
        @save="handleSaveLocation"
      />

      <UpdateStatusModal
        :show="showUpdateStatusModal"
        :batch="batch"
        @close="showUpdateStatusModal = false"
        @save="handleSaveStatus"
      />
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
import {
  MATERIAL_TYPE_LABELS,
  MATERIAL_FORM_LABELS,
  USAGE_STATUS
} from '../constants'

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

// Computed
const canUpdateQuantity = computed(() => {
  return batch.value?.usageStatus === USAGE_STATUS.SAN_SANG_SU_DUNG || 
         batch.value?.usageStatus === USAGE_STATUS.DANG_SU_DUNG
})

const canMove = computed(() => {
  return batch.value?.usageStatus !== USAGE_STATUS.DA_HET &&
         batch.value?.usageStatus !== USAGE_STATUS.HONG
})

const canUpdateStatus = computed(() => {
  return batch.value?.usageStatus !== USAGE_STATUS.DA_HET
})

const hasFiles = computed(() => {
  return batch.value?.coaFilePath || 
         batch.value?.msdsFilePath || 
         batch.value?.testCertificatePath
})

// Methods
const formatNumber = (value) => {
  if (!value) return '0'
  return new Intl.NumberFormat('vi-VN', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
  }).format(value)
}

const formatCurrency = (value) => {
  if (!value) return '0 VNĐ'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(value)
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('vi-VN')
}

const getMaterialTypeLabel = (type) => {
  return MATERIAL_TYPE_LABELS[type] || type
}

const getMaterialFormLabel = (form) => {
  return MATERIAL_FORM_LABELS[form] || form
}

const getQuantityColor = (batch) => {
  const current = parseFloat(batch.currentQuantity || 0)
  const received = parseFloat(batch.receivedQuantity || 0)
  const percentage = received > 0 ? (current / received) * 100 : 0
  
  if (current <= 0) return 'text-red-600'
  if (percentage < 20) return 'text-orange-600'
  if (percentage < 50) return 'text-yellow-600'
  return 'text-gray-900'
}

const getUsagePercentage = () => {
  if (!batch.value) return 0
  const current = parseFloat(batch.value.currentQuantity || 0)
  const received = parseFloat(batch.value.receivedQuantity || 0)
  if (received === 0) return 0
  return Math.round(((received - current) / received) * 100)
}

const getDaysToExpiry = () => {
  if (!batch.value?.expiryDate) return ''
  const today = new Date()
  const expiry = new Date(batch.value.expiryDate)
  const diffTime = expiry - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) {
    return `Quá hạn ${Math.abs(diffDays)} ngày`
  } else if (diffDays === 0) {
    return 'Hết hạn hôm nay'
  } else {
    return `Còn ${diffDays} ngày`
  }
}

const getExpiryColor = () => {
  if (!batch.value?.expiryDate) return 'text-gray-500'
  const today = new Date()
  const expiry = new Date(batch.value.expiryDate)
  const diffTime = expiry - today
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'text-red-600'
  if (diffDays <= 30) return 'text-orange-600'
  return 'text-green-600'
}

const loadBatch = async () => {
  try {
    console.log('Loading batch with ID:', route.params.id)
    const batchData = await materialBatchStore.fetchBatchById(route.params.id)
    batch.value = batchData
  } catch (error) {
    console.error('Failed to load batch:', error)
  }
}

const loadLocations = async () => {
  try {
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

const goBack = () => {
  router.push({ name: 'MaterialBatchList' })
}

const goToEdit = () => {
  router.push({ 
    name: 'MaterialBatchEdit', 
    params: { id: route.params.id } 
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

onMounted(async () => {
  await Promise.all([
    loadBatch(),
    loadLocations()
  ])
})
</script>
