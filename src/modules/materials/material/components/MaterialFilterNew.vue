<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
    <!-- Mobile toggle button -->
    <div class="flex items-center justify-between lg:hidden mb-6">
      <h3 class="text-lg font-semibold text-gray-900">Bộ lọc tìm kiếm</h3>
      <button 
        @click="showFilters = !showFilters"
        class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
      >
        <ChevronDownIcon 
          :class="['h-5 w-5 transition-transform duration-200', showFilters && 'rotate-180']" 
        />
      </button>
    </div>

    <!-- Filter content -->
    <div :class="['lg:block', !showFilters && 'hidden']">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <!-- Keywords search -->
        <div class="md:col-span-2 lg:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tìm kiếm theo từ khóa
          </label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              v-model="localFilters.keywords"
              type="text"
              placeholder="Tên vật liệu, mã, nhà cung cấp..."
              class="pl-10 pr-4 py-3 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Material Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Loại vật liệu
          </label>
          <select
            v-model="localFilters.materialType"
            class="w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-white"
            @change="handleFilterChange"
          >
            <option :value="null">Tất cả loại</option>
            <option value="HOAT_CHAT">Hoạt chất</option>
            <option value="PHU_LIEU">Phụ liệu</option>
            <option value="BAO_BI">Bao bì</option>
            <option value="HOA_CHAT">Hóa chất</option>
            <option value="KHAC">Khác</option>
          </select>
        </div>

        <!-- Material Form -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Dạng vật liệu
          </label>
          <select
            v-model="localFilters.materialForm"
            class="w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-white"
            @change="handleFilterChange"
          >
            <option :value="null">Tất cả dạng</option>
            <option value="BOT">Bột</option>
            <option value="VIEN">Viên</option>
            <option value="DUNG_DICH">Dung dịch</option>
            <option value="THUOC_TIM">Thuốc tiêm</option>
            <option value="KHAC">Khác</option>
          </select>
        </div>
      </div>

      <!-- Advanced filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <!-- Active status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Trạng thái hoạt động
          </label>
          <select
            v-model="localFilters.isActive"
            class="w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-white"
            @change="handleFilterChange"
          >
            <option :value="null">Tất cả trạng thái</option>
            <option :value="true">Đang hoạt động</option>
            <option :value="false">Ngừng hoạt động</option>
          </select>
        </div>

        <!-- Cold Storage -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Bảo quản lạnh
          </label>
          <select
            v-model="localFilters.requiresColdStorage"
            class="w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-white"
            @change="handleFilterChange"
          >
            <option :value="null">Tất cả</option>
            <option :value="true">Yêu cầu</option>
            <option :value="false">Không yêu cầu</option>
          </select>
        </div>

        <!-- Low Stock -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tồn kho
          </label>
          <select
            v-model="localFilters.lowStock"
            class="w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-white"
            @change="handleFilterChange"
          >
            <option :value="null">Tất cả</option>
            <option :value="true">Tồn kho thấp</option>
            <option :value="false">Tồn kho đủ</option>
          </select>
        </div>

        <!-- Sort -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Sắp xếp theo
          </label>
          <select
            v-model="localFilters.sortField"
            class="w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-white"
            @change="handleFilterChange"
          >
            <option value="id">Mới nhất</option>
            <option value="materialName">Tên vật liệu</option>
            <option value="materialCode">Mã vật liệu</option>
            <option value="fixedPrice">Giá cố định</option>
            <option value="currentStock">Tồn kho</option>
          </select>
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
        <div class="text-sm text-gray-500">
          <span v-if="totalResults !== undefined">
            Hiển thị {{ totalResults }} kết quả
          </span>
          <span v-if="hasActiveFilters" class="ml-2">
            · {{ activeFilterCount }} bộ lọc đang áp dụng
          </span>
        </div>
        
        <div class="flex items-center space-x-3">
          <button
            @click="clearFilters"
            v-if="hasActiveFilters"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Xóa bộ lọc
          </button>
          
          <button
            @click="applyFilters"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { debounce } from 'lodash-es'
import {
  ChevronDownIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  totalResults: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['update:filters', 'reset'])

// Local state
const showFilters = ref(false)
const localFilters = ref({ ...props.filters })

// Computed properties
const hasActiveFilters = computed(() => {
  const { start, limit, sortField, sortType, ...filterValues } = localFilters.value
  return Object.values(filterValues).some(value => 
    value !== null && value !== undefined && value !== ''
  )
})

const activeFilterCount = computed(() => {
  const { start, limit, sortField, sortType, ...filterValues } = localFilters.value
  return Object.values(filterValues).filter(value => 
    value !== null && value !== undefined && value !== ''
  ).length
})

// Methods
const debouncedSearch = debounce(() => {
  applyFilters()
}, 500)

const handleFilterChange = () => {
  localFilters.value.start = 0 // Reset to first page
  applyFilters()
}

const applyFilters = () => {
  emit('update:filters', { ...localFilters.value })
}

const clearFilters = () => {
  localFilters.value = {
    start: 0,
    limit: props.filters.limit,
    keywords: '',
    materialType: null,
    materialForm: null,
    supplierId: null,
    requiresColdStorage: null,
    isActive: null,
    lowStock: null,
    minFixedPrice: null,
    maxFixedPrice: null,
    sortField: 'id',
    sortType: 'desc'
  }
  emit('update:filters', { ...localFilters.value })
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true, immediate: true })
</script>
