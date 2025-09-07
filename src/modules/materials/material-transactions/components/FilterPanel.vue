<template>
  <div class="space-y-4">
    <!-- Quick Filters -->
    <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 class="text-sm font-medium text-gray-900">Bộ lọc</h3>
        <button
          v-if="hasFilters"
          @click="clearAllFilters"
          class="mt-2 sm:mt-0 text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Xóa tất cả bộ lọc
        </button>
      </div>

      <!-- Search -->
      <div class="mb-4">
        <label class="block text-xs font-medium text-gray-700 mb-2">
          Tìm kiếm
        </label>
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Tìm theo mã giao dịch, mô tả..."
          class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          @input="debouncedSearch"
        />
      </div>

      <!-- Filter Row 1 -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <!-- Transaction Type -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Loại giao dịch
          </label>
          <select
            v-model="localFilters.transactionType"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="updateFilter('transactionType', $event.target.value)"
          >
            <option value="">Tất cả</option>
            <option
              v-for="(label, type) in transactionTypeOptions"
              :key="type"
              :value="type"
            >
              {{ label }}
            </option>
          </select>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Trạng thái
          </label>
          <select
            v-model="localFilters.status"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="updateFilter('status', $event.target.value)"
          >
            <option value="">Tất cả</option>
            <option
              v-for="(label, status) in statusOptions"
              :key="status"
              :value="status"
            >
              {{ label }}
            </option>
          </select>
        </div>

        <!-- Warehouse -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Kho
          </label>
          <select
            v-model="localFilters.warehouseId"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="updateFilter('warehouseId', $event.target.value)"
          >
            <option value="">Tất cả kho</option>
            <option
              v-for="warehouse in warehouses"
              :key="warehouse.id"
              :value="warehouse.id"
            >
              {{ warehouse.name }}
            </option>
          </select>
        </div>

        <!-- Material Batch -->
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Lô hàng
          </label>
          <input
            v-model="localFilters.materialBatchId"
            type="number"
            placeholder="ID lô hàng"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @input="updateFilter('materialBatchId', $event.target.value)"
          />
        </div>
      </div>

      <!-- Date Range -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Từ ngày
          </label>
          <input
            v-model="localFilters.startDate"
            type="datetime-local"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="updateFilter('startDate', $event.target.value)"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Đến ngày
          </label>
          <input
            v-model="localFilters.endDate"
            type="datetime-local"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="updateFilter('endDate', $event.target.value)"
          />
        </div>
      </div>
    </div>

    <!-- Sort Options -->
    <div class="bg-white rounded-lg border border-gray-200 p-4">
      <h3 class="text-sm font-medium text-gray-900 mb-3">Sắp xếp</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Sắp xếp theo
          </label>
          <select
            v-model="localFilters.sortBy"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="updateFilter('sortBy', $event.target.value)"
          >
            <option value="transactionDate">Ngày giao dịch</option>
            <option value="id">Mã giao dịch</option>
            <option value="quantity">Số lượng</option>
            <option value="transactionType">Loại giao dịch</option>
            <option value="status">Trạng thái</option>
          </select>
        </div>
        <div>
          <label class="block text-xs font-medium text-gray-700 mb-2">
            Thứ tự
          </label>
          <select
            v-model="localFilters.sortOrder"
            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            @change="updateFilter('sortOrder', $event.target.value)"
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Active Filters Display -->
    <div v-if="activeFiltersCount > 0" class="flex flex-wrap gap-2">
      <span class="text-xs text-gray-500">Bộ lọc đang áp dụng:</span>
      
      <span
        v-if="localFilters.search"
        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
      >
        Tìm kiếm: "{{ localFilters.search }}"
        <button
          @click="clearFilter('search')"
          class="ml-1 hover:text-emerald-600"
        >
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>

      <span
        v-if="localFilters.transactionType"
        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
      >
        Loại: {{ transactionTypeOptions[localFilters.transactionType] }}
        <button
          @click="clearFilter('transactionType')"
          class="ml-1 hover:text-blue-600"
        >
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>

      <span
        v-if="localFilters.status"
        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
      >
        Trạng thái: {{ statusOptions[localFilters.status] }}
        <button
          @click="clearFilter('status')"
          class="ml-1 hover:text-purple-600"
        >
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>

      <span
        v-if="localFilters.warehouseId"
        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
      >
        Kho: {{ getWarehouseName(localFilters.warehouseId) }}
        <button
          @click="clearFilter('warehouseId')"
          class="ml-1 hover:text-orange-600"
        >
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>

      <span
        v-if="localFilters.startDate || localFilters.endDate"
        class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
      >
        Thời gian: {{ formatDateRange() }}
        <button
          @click="clearDateRange"
          class="ml-1 hover:text-indigo-600"
        >
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import {
  TRANSACTION_TYPES,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_STATUSES,
  TRANSACTION_STATUS_LABELS
} from '../constants/transaction-types'
import { XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  warehouses: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filters'])

// Local filters for immediate UI updates
const localFilters = ref({ ...props.filters })

// Options
const transactionTypeOptions = TRANSACTION_TYPE_LABELS
const statusOptions = TRANSACTION_STATUS_LABELS

// Computed
const hasFilters = computed(() => {
  const { start, limit, sortBy, sortOrder, ...filterValues } = localFilters.value
  return Object.values(filterValues).some(value => 
    value !== null && value !== undefined && value !== ''
  )
})

const activeFiltersCount = computed(() => {
  const { start, limit, sortBy, sortOrder, ...filterValues } = localFilters.value
  return Object.values(filterValues).filter(value => 
    value !== null && value !== undefined && value !== ''
  ).length
})

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// Debounced search
const debouncedSearch = debounce(() => {
  updateFilter('search', localFilters.value.search)
}, 300)

// Methods
const updateFilter = (key, value) => {
  const newValue = value === '' ? null : value
  localFilters.value[key] = newValue
  
  const updatedFilters = { ...localFilters.value }
  if (key !== 'start') {
    updatedFilters.start = 0 // Reset to first page when filtering
  }
  
  emit('update:filters', updatedFilters)
}

const clearFilter = (key) => {
  updateFilter(key, null)
}

const clearAllFilters = () => {
  localFilters.value = {
    start: 0,
    limit: localFilters.value.limit,
    search: '',
    transactionType: null,
    status: null,
    warehouseId: null,
    materialBatchId: null,
    startDate: null,
    endDate: null,
    sortBy: 'transactionDate',
    sortOrder: 'desc'
  }
  emit('update:filters', { ...localFilters.value })
}

const clearDateRange = () => {
  localFilters.value.startDate = null
  localFilters.value.endDate = null
  updateFilter('startDate', null)
  updateFilter('endDate', null)
}

const getWarehouseName = (warehouseId) => {
  const warehouse = props.warehouses.find(w => w.id == warehouseId)
  return warehouse ? warehouse.name : `Kho #${warehouseId}`
}

const formatDateRange = () => {
  const start = localFilters.value.startDate
  const end = localFilters.value.endDate
  
  if (start && end) {
    return `${formatDate(start)} - ${formatDate(end)}`
  } else if (start) {
    return `Từ ${formatDate(start)}`
  } else if (end) {
    return `Đến ${formatDate(end)}`
  }
  return ''
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('vi-VN')
  } catch {
    return dateString
  }
}
</script>
