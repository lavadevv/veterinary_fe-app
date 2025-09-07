<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Left Column -->
      <div class="space-y-6">
        <!-- Transaction Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Loại giao dịch *
          </label>
          <div class="grid grid-cols-2 gap-3">
            <button
              v-for="(label, type) in transactionTypeOptions"
              :key="type"
              type="button"
              :class="[
                'p-3 text-left border rounded-lg transition-all duration-200',
                formData.transactionType === type
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-gray-300 hover:border-gray-400'
              ]"
              @click="formData.transactionType = type"
            >
              <div class="flex items-center space-x-2">
                <component
                  :is="getTypeIcon(type)"
                  :class="[
                    'w-5 h-5',
                    formData.transactionType === type ? 'text-emerald-600' : 'text-gray-400'
                  ]"
                />
                <span class="text-sm font-medium">{{ label }}</span>
              </div>
            </button>
          </div>
          <p v-if="errors.transactionType" class="mt-1 text-sm text-red-600">
            {{ errors.transactionType }}
          </p>
        </div>

        <!-- Material Batch Selection -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Lô vật liệu *
          </label>
          <div class="relative">
            <input
              v-model="batchSearchQuery"
              type="text"
              placeholder="Tìm kiếm lô vật liệu..."
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
              @input="searchBatches"
              @focus="showBatchDropdown = true"
            />
            
            <!-- Batch Dropdown -->
            <div
              v-if="showBatchDropdown && filteredBatches.length > 0"
              class="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg"
            >
              <div
                v-for="batch in filteredBatches"
                :key="batch.id"
                class="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                @click="selectBatch(batch)"
              >
                <div class="flex items-center justify-between">
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ batch.materialDto?.materialName || 'N/A' }}
                    </p>
                    <p class="text-xs text-gray-500">
                      Lô: {{ batch.batchNumber || 'N/A' }} | Tồn: {{ formatNumber(batch.currentQuantity) }} {{ batch.materialDto?.unitOfMeasure || '' }}
                    </p>
                  </div>
                  <BatchStatusBadge :status="batch.usageStatus || 'CHUA_SU_DUNG'" />
                </div>
              </div>
            </div>
          </div>

          <!-- Selected Batch Info -->
          <div v-if="selectedBatch" class="mt-3 p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ selectedBatch.materialDto?.materialName || 'N/A' }}
                </p>
                <p class="text-xs text-gray-500">
                  Lô: {{ selectedBatch.batchNumber || 'N/A' }} | 
                  Tồn kho: {{ formatNumber(selectedBatch.currentQuantity) }} {{ selectedBatch.materialDto?.unitOfMeasure || '' }}
                </p>
              </div>
              <button
                type="button"
                @click="clearBatchSelection"
                class="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon class="w-5 h-5" />
              </button>
            </div>
          </div>

          <p v-if="errors.materialBatchId" class="mt-1 text-sm text-red-600">
            {{ errors.materialBatchId }}
          </p>
        </div>

        <!-- Quantity -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Số lượng *
          </label>
          <div class="relative">
            <input
              v-model.number="formData.quantity"
              type="number"
              step="0.01"
              min="0"
              placeholder="Nhập số lượng"
              class="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm pr-16"
            />
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <span class="text-gray-500 text-sm">{{ selectedBatch?.materialDto?.unitOfMeasure }}</span>
            </div>
          </div>
          
          <!-- Max quantity hint for export -->
          <p v-if="formData.transactionType === 'EXPORT' && selectedBatch" class="mt-1 text-xs text-gray-500">
            Có thể xuất tối đa: {{ formatNumber(selectedBatch.currentQuantity || 0) }} {{ selectedBatch.materialDto?.unitOfMeasure || '' }}
          </p>
          
          <p v-if="errors.quantity" class="mt-1 text-sm text-red-600">
            {{ errors.quantity }}
          </p>
        </div>

        <!-- Warehouse -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Kho *
          </label>
          <select
            v-model="formData.warehouseId"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          >
            <option value="">Chọn kho</option>
            <option
              v-for="warehouse in (warehouses || [])"
              :key="warehouse.id"
              :value="warehouse.id"
            >
              {{ warehouse.warehouseName || warehouse.name }} - {{ warehouse.address }}
            </option>
          </select>
          <p v-if="errors.warehouseId" class="mt-1 text-sm text-red-600">
            {{ errors.warehouseId }}
          </p>
        </div>
      </div>

      <!-- Right Column -->
      <div class="space-y-6">
        <!-- Transaction Date -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Ngày giao dịch *
          </label>
          <input
            v-model="formData.transactionDate"
            type="datetime-local"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          />
          <p v-if="errors.transactionDate" class="mt-1 text-sm text-red-600">
            {{ errors.transactionDate }}
          </p>
        </div>

        <!-- Destination Warehouse (only for TRANSFER) -->
        <div v-if="formData.transactionType === 'TRANSFER'">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Kho đích *
          </label>
          <select
            v-model="formData.destinationWarehouseId"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          >
            <option value="">Chọn kho đích</option>
            <option
              v-for="warehouse in availableDestinationWarehouses"
              :key="warehouse.id"
              :value="warehouse.id"
            >
              {{ warehouse.warehouseName || warehouse.name }} - {{ warehouse.address }}
            </option>
          </select>
          <p v-if="errors.destinationWarehouseId" class="mt-1 text-sm text-red-600">
            {{ errors.destinationWarehouseId }}
          </p>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Mô tả
          </label>
          <textarea
            v-model="formData.description"
            rows="4"
            class="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
            placeholder="Nhập mô tả giao dịch (tùy chọn)"
          ></textarea>
        </div>

        <!-- Transaction Summary (when batch selected) -->
        <div v-if="selectedBatch && formData.transactionType" class="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
          <h4 class="text-sm font-medium text-emerald-900 mb-3">Tóm tắt giao dịch</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Loại giao dịch:</span>
              <span class="font-medium text-emerald-900">{{ transactionTypeOptions[formData.transactionType] || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Vật liệu:</span>
              <span class="font-medium text-emerald-900">{{ selectedBatch.materialDto?.materialName || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Số lô:</span>
              <span class="font-medium">{{ selectedBatch.batchNumber || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Số lượng:</span>
              <span class="font-medium">{{ formatNumber(formData.quantity || 0) }} {{ selectedBatch.materialDto?.unitOfMeasure || '' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Kho:</span>
              <span class="font-medium">{{ getWarehouseName(formData.warehouseId) || 'Chưa chọn' }}</span>
            </div>
            <div v-if="formData.transactionType === 'TRANSFER' && formData.destinationWarehouseId" class="flex justify-between">
              <span class="text-gray-600">Kho đích:</span>
              <span class="font-medium">{{ getWarehouseName(formData.destinationWarehouseId) || 'Chưa chọn' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
      <button
        type="button"
        @click="$emit('cancel')"
        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        Hủy
      </button>
      <button
        type="submit"
        :disabled="!isFormValid || loading"
        class="px-4 py-2 text-sm font-medium text-white bg-emerald-600 border border-transparent rounded-md shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span v-if="loading" class="flex items-center">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang xử lý...
        </span>
        <span v-else>
          {{ editMode ? 'Cập nhật' : 'Tạo giao dịch' }}
        </span>
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { debounce } from 'lodash-es'
import BatchStatusBadge from '../../material-batches/components/StatusBadge.vue'
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_ICONS
} from '../constants/transaction-types'

// Hero Icons
import {
  XMarkIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  transaction: {
    type: Object,
    default: () => null
  },
  materialBatches: {
    type: Array,
    default: () => []
  },
  warehouses: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

// Form data
const formData = ref({
  transactionType: '',
  materialBatchId: null,
  quantity: null,
  warehouseId: null,
  destinationWarehouseId: null,
  transactionDate: new Date().toISOString().slice(0, 16),
  description: ''
})

// Form state
const errors = ref({})
const batchSearchQuery = ref('')
const showBatchDropdown = ref(false)
const selectedBatch = ref(null)

// Computed
const editMode = computed(() => !!props.transaction)
const transactionTypeOptions = TRANSACTION_TYPE_LABELS

const iconComponents = {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
}

const filteredBatches = computed(() => {
  if (!batchSearchQuery.value) return (props.materialBatches || []).slice(0, 10)
  
  const query = batchSearchQuery.value.toLowerCase()
  return (props.materialBatches || []).filter(batch => 
    batch.materialDto?.materialName?.toLowerCase().includes(query) ||
    batch.batchNumber?.toLowerCase().includes(query) ||
    batch.internalBatchCode?.toLowerCase().includes(query)
  ).slice(0, 10)
})

const availableDestinationWarehouses = computed(() => {
  if (!selectedBatch.value?.locationDto?.warehouseDto?.id) return props.warehouses || []
  
  return (props.warehouses || []).filter(w => w.id !== selectedBatch.value.locationDto.warehouseDto.id)
})

const isFormValid = computed(() => {
  return (
    formData.value.transactionType &&
    formData.value.materialBatchId &&
    formData.value.quantity &&
    formData.value.quantity > 0 &&
    formData.value.warehouseId &&
    formData.value.transactionDate &&
    (formData.value.transactionType !== 'TRANSFER' || formData.value.destinationWarehouseId)
  )
})

// Methods
const getTypeIcon = (type) => {
  const iconName = TRANSACTION_TYPE_ICONS[type]
  return iconComponents[iconName] || ArrowDownOnSquareIcon
}

const searchBatches = debounce(() => {
  showBatchDropdown.value = true
}, 300)

const selectBatch = (batch) => {
  selectedBatch.value = batch
  formData.value.materialBatchId = batch.id
  batchSearchQuery.value = `${batch.materialDto?.materialName || 'N/A'} - ${batch.batchNumber || 'N/A'}`
  showBatchDropdown.value = false
  
  // Auto-fill warehouse for certain transaction types
  if (formData.value.transactionType === 'EXPORT' && batch.locationDto?.warehouseDto?.id) {
    formData.value.warehouseId = batch.locationDto.warehouseDto.id
  }
}

const clearBatchSelection = () => {
  selectedBatch.value = null
  formData.value.materialBatchId = null
  batchSearchQuery.value = ''
}

const getWarehouseName = (warehouseId) => {
  if (!props.warehouses || !warehouseId) return ''
  const warehouse = props.warehouses.find(w => w.id == warehouseId)
  return warehouse ? (warehouse.warehouseName || warehouse.name) : ''
}

const formatNumber = (number) => {
  if (number == null) return '0'
  return new Intl.NumberFormat('vi-VN').format(number)
}

const validateForm = () => {
  errors.value = {}
  
  if (!formData.value.transactionType) {
    errors.value.transactionType = 'Vui lòng chọn loại giao dịch'
  }
  
  if (!formData.value.materialBatchId) {
    errors.value.materialBatchId = 'Vui lòng chọn lô vật liệu'
  }
  
  if (!formData.value.quantity || formData.value.quantity <= 0) {
    errors.value.quantity = 'Vui lòng nhập số lượng hợp lệ'
  }
  
  // Check available quantity for export
  if (formData.value.transactionType === 'EXPORT' && selectedBatch.value) {
    if (formData.value.quantity > (selectedBatch.value.currentQuantity || 0)) {
      errors.value.quantity = `Số lượng xuất không được vượt quá tồn kho (${selectedBatch.value.currentQuantity || 0})`
    }
  }
  
  if (!formData.value.warehouseId) {
    errors.value.warehouseId = 'Vui lòng chọn kho'
  }
  
  if (formData.value.transactionType === 'TRANSFER' && !formData.value.destinationWarehouseId) {
    errors.value.destinationWarehouseId = 'Vui lòng chọn kho đích'
  }
  
  if (!formData.value.transactionDate) {
    errors.value.transactionDate = 'Vui lòng chọn ngày giao dịch'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  if (!validateForm()) return
  
  const submitData = { ...formData.value }
  
  // Convert quantity to number
  submitData.quantity = Number(submitData.quantity)
  
  // Convert datetime-local to ISO string
  submitData.transactionDate = new Date(submitData.transactionDate).toISOString()
  
  emit('submit', submitData)
}

// Click outside to close dropdown
const handleClickOutside = (event) => {
  if (!event.target.closest('.relative')) {
    showBatchDropdown.value = false
  }
}

// Initialize form with transaction data if editing
watch(() => props.transaction, (transaction) => {
  if (transaction) {
    formData.value = {
      transactionType: transaction.transactionType || '',
      materialBatchId: transaction.materialBatch?.id || null,
      quantity: transaction.quantity || null,
      warehouseId: transaction.warehouse?.id || null,
      destinationWarehouseId: transaction.destinationWarehouse?.id || null,
      transactionDate: transaction.transactionDate ? 
        new Date(transaction.transactionDate).toISOString().slice(0, 16) : 
        new Date().toISOString().slice(0, 16),
      description: transaction.description || ''
    }
    
    // Set selected batch
    if (transaction.materialBatch) {
      selectedBatch.value = transaction.materialBatch
      batchSearchQuery.value = `${transaction.materialBatch.materialDto?.materialName} - ${transaction.materialBatch.batchNumber}`
    }
  }
}, { immediate: true })

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>