<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
      <!-- Loading State -->
      <div v-if="loading && !transaction" class="text-center py-12">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-emerald-500 transition ease-in-out duration-150">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang tải thông tin giao dịch...
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon class="w-8 h-8 text-red-600" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không thể tải thông tin giao dịch</h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <div class="flex justify-center space-x-3">
          <button
            @click="loadTransaction"
            class="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
          >
            Thử lại
          </button>
          <router-link
            to="/materials/transactions"
            class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Quay lại danh sách
          </router-link>
        </div>
      </div>

      <!-- Transaction Detail -->
      <div v-else-if="transaction">
        <!-- Header -->
        <div class="mb-6 sm:mb-8">
          <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
            <div class="flex-1 min-w-0">
              <div class="flex items-center space-x-3 mb-2">
                <button
                  @click="$router.go(-1)"
                  class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <ArrowLeftIcon class="w-5 h-5" />
                </button>
                <div>
                  <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">
                    Chi tiết Giao dịch #{{ transaction.id }}
                  </h1>
                  <p class="text-sm text-gray-500 mt-1">
                    {{ getTransactionTypeLabel(transaction.transactionType) }} • {{ formatDate(transaction.transactionDate) }}
                  </p>
                </div>
              </div>

              <!-- Quick Stats -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div class="bg-white rounded-lg border border-gray-200 p-4">
                  <div class="flex items-center">
                    <component
                      :is="getTransactionIcon(transaction.transactionType)"
                      :class="[
                        'h-8 w-8',
                        getTransactionTypeColor(transaction.transactionType).icon
                      ]"
                    />
                    <div class="ml-3">
                      <p class="text-sm text-gray-500 mb-1">Loại</p>
                      <p class="text-sm font-semibold text-gray-900">
                        {{ getTransactionTypeLabel(transaction.transactionType) }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="bg-white rounded-lg border border-gray-200 p-4">
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Trạng thái</p>
                    <StatusBadge :status="getTransactionStatus(transaction)" />
                  </div>
                </div>
                <div class="bg-white rounded-lg border border-gray-200 p-4">
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Số lượng</p>
                    <p class="text-lg font-semibold text-gray-900">
                      {{ formatNumber(transaction.quantity) }}
                      <span class="text-sm text-gray-500 ml-1">
                        {{ transaction.materialBatchDto?.materialDto?.unitOfMeasure || '' }}
                      </span>
                    </p>
                  </div>
                </div>
                <div class="bg-white rounded-lg border border-gray-200 p-4">
                  <div>
                    <p class="text-sm text-gray-500 mb-1">Giá trị</p>
                    <p class="text-lg font-semibold text-gray-900">
                      {{ formatCurrency(transaction.totalValue) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex-shrink-0 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
              <router-link
                :to="{ name: 'MaterialTransactionEdit', params: { id: transaction.id } }"
                class="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
              >
                <PencilIcon class="-ml-1 mr-2 h-4 w-4" />
                Chỉnh sửa
              </router-link>
              <button
                @click="handleDelete"
                class="inline-flex items-center justify-center px-4 py-2 border border-red-300 text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                <TrashIcon class="-ml-1 mr-2 h-4 w-4" />
                Xóa
              </button>
            </div>
          </div>
        </div>

        <!-- Transaction Details Grid -->
        <div class="grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8">
          <!-- Material Information -->
          <div class="xl:col-span-2 space-y-6 sm:space-y-8">
            <!-- Material Details Card -->
            <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <CubeIcon class="w-5 h-5 mr-2 text-emerald-600" />
                  Thông tin vật liệu
                </h3>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 mb-1">Tên vật liệu</dt>
                    <dd class="text-sm text-gray-900 font-medium">
                      {{ transaction.materialBatchDto?.materialDto?.materialName || 'N/A' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 mb-1">Mã lô</dt>
                    <dd class="text-sm text-gray-900 font-medium">
                      {{ transaction.materialBatchDto?.batchNumber || 'N/A' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 mb-1">Mã nội bộ</dt>
                    <dd class="text-sm text-gray-900 font-medium">
                      {{ transaction.materialBatchDto?.internalBatchCode || 'N/A' }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 mb-1">Đơn vị</dt>
                    <dd class="text-sm text-gray-900 font-medium">
                      {{ transaction.materialBatchDto?.materialDto?.unitOfMeasure || 'N/A' }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            <!-- Transaction Details Card -->
            <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <DocumentTextIcon class="w-5 h-5 mr-2 text-emerald-600" />
                  Chi tiết giao dịch
                </h3>
              </div>
              <div class="p-6">
                <dl class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <dt class="text-sm font-medium text-gray-500 mb-1">Số lượng giao dịch</dt>
                    <dd class="text-sm text-gray-900 font-medium">
                      {{ formatNumber(transaction.quantity) }} {{ transaction.materialBatchDto?.materialDto?.unitOfMeasure }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 mb-1">Đơn giá</dt>
                    <dd class="text-sm text-gray-900 font-medium">
                      {{ formatCurrency(transaction.unitPrice) }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 mb-1">Tổng giá trị</dt>
                    <dd class="text-sm text-gray-900 font-medium">
                      {{ formatCurrency(transaction.totalValue) }}
                    </dd>
                  </div>
                  <div>
                    <dt class="text-sm font-medium text-gray-500 mb-1">Ngày thực hiện</dt>
                    <dd class="text-sm text-gray-900 font-medium">
                      {{ formatDate(transaction.transactionDate) }}
                    </dd>
                  </div>
                  <div v-if="transaction.referenceDocument">
                    <dt class="text-sm font-medium text-gray-500 mb-1">Số chứng từ</dt>
                    <dd class="text-sm text-gray-900 font-medium">
                      {{ transaction.referenceDocument }}
                    </dd>
                  </div>
                  <div v-if="transaction.productionOrderId">
                    <dt class="text-sm font-medium text-gray-500 mb-1">Mã đơn sản xuất</dt>
                    <dd class="text-sm text-gray-900 font-medium">
                      {{ transaction.productionOrderId }}
                    </dd>
                  </div>
                  <div v-if="transaction.reason" class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500 mb-1">Lý do</dt>
                    <dd class="text-sm text-gray-900">
                      {{ transaction.reason }}
                    </dd>
                  </div>
                  <div v-if="transaction.notes" class="sm:col-span-2">
                    <dt class="text-sm font-medium text-gray-500 mb-1">Ghi chú</dt>
                    <dd class="text-sm text-gray-900">
                      {{ transaction.notes }}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>

          <!-- Location Information -->
          <div class="space-y-6 sm:space-y-8">
            <!-- Location Card -->
            <div class="bg-white overflow-hidden shadow-sm rounded-xl border border-gray-200">
              <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                <h3 class="text-lg font-semibold text-gray-900 flex items-center">
                  <BuildingStorefrontIcon class="w-5 h-5 mr-2 text-emerald-600" />
                  Thông tin vị trí
                </h3>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <!-- From Location -->
                  <div v-if="transaction.fromLocationDto">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Từ vị trí</dt>
                    <dd class="bg-gray-50 rounded-lg p-3">
                      <p class="text-sm font-medium text-gray-900">
                        {{ transaction.fromLocationDto.locationCode }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ transaction.fromLocationDto.positionDetail }}
                      </p>
                      <p class="text-xs text-gray-500">
                        Kho: {{ transaction.fromLocationDto.warehouseDto?.warehouseName }}
                      </p>
                    </dd>
                  </div>
                  
                  <!-- To Location -->
                  <div v-if="transaction.toLocationDto">
                    <dt class="text-sm font-medium text-gray-500 mb-2">Đến vị trí</dt>
                    <dd class="bg-gray-50 rounded-lg p-3">
                      <p class="text-sm font-medium text-gray-900">
                        {{ transaction.toLocationDto.locationCode }}
                      </p>
                      <p class="text-xs text-gray-500 mt-1">
                        {{ transaction.toLocationDto.positionDetail }}
                      </p>
                      <p class="text-xs text-gray-500">
                        Kho: {{ transaction.toLocationDto.warehouseDto?.warehouseName }}
                      </p>
                    </dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMaterialTransactionStore } from '../store/materialTransactionStore'

// Components
import StatusBadge from '../components/StatusBadge.vue'

// Icons
import {
  ArrowLeftIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  CubeIcon,
  DocumentTextIcon,
  BuildingStorefrontIcon
} from '@heroicons/vue/24/outline'

// Constants
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_COLORS,
  TRANSACTION_TYPE_ICONS
} from '../constants/transaction-types'

// Composables
const route = useRoute()
const router = useRouter()

// Store
const materialTransactionStore = useMaterialTransactionStore()

// State
const transaction = ref(null)
const loading = ref(false)
const error = ref(null)

// Methods
const loadTransaction = async () => {
  try {
    loading.value = true
    error.value = null
    
    const id = route.params.id
    const result = await materialTransactionStore.fetchTransactionById(id)
    transaction.value = result
  } catch (err) {
    console.error('Error loading transaction:', err)
    error.value = err.message || 'Có lỗi xảy ra khi tải thông tin giao dịch'
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
    try {
      await materialTransactionStore.deleteTransaction(transaction.value.id)
      router.push({ name: 'MaterialTransactionList' })
    } catch (err) {
      console.error('Error deleting transaction:', err)
    }
  }
}

// Helper functions
const formatNumber = (number) => {
  if (number == null) return '0'
  return new Intl.NumberFormat('vi-VN').format(number)
}

const formatCurrency = (amount) => {
  if (amount == null) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTransactionTypeLabel = (type) => {
  return TRANSACTION_TYPE_LABELS[type] || type
}

const getTransactionTypeColor = (type) => {
  return TRANSACTION_TYPE_COLORS[type] || { 
    bg: 'bg-gray-100', 
    text: 'text-gray-800',
    icon: 'text-gray-600'
  }
}

const getTransactionIcon = (type) => {
  return TRANSACTION_TYPE_ICONS[type] || 'DocumentTextIcon'
}

const getTransactionStatus = (transaction) => {
  if (transaction.approvedByDto) {
    return 'COMPLETED'
  } else {
    return 'PENDING'
  }
}

// Lifecycle
onMounted(() => {
  loadTransaction()
})
</script>
