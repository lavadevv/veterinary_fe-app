<template>
  <div class="bg-white border border-gray-200 rounded-lg p-4 md:p-6 space-y-4">
    <!-- Search -->
    <div class="relative">
      <label class="block text-sm font-medium text-gray-700 mb-2">Tìm kiếm</label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon class="h-5 w-5 text-gray-400" />
        </div>
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Tìm theo tên, mã nhà cung cấp..."
          class="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          @input="debouncedUpdate"
        />
      </div>
    </div>

    <!-- Filters Row -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <!-- Country Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Quốc gia xuất xứ</label>
        <select
          v-model="localFilters.country"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          @change="updateFilters"
        >
          <option value="">Tất cả quốc gia</option>
          <option v-for="country in countryOptions" :key="country" :value="country">
            {{ country }}
          </option>
        </select>
      </div>

      <!-- Status Filter -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
        <select
          v-model="localFilters.isActive"
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
          @change="updateFilters"
        >
          <option :value="null">Tất cả trạng thái</option>
          <option :value="true">Hoạt động</option>
          <option :value="false">Ngừng hoạt động</option>
        </select>
      </div>

      <!-- GMP Expiring Filter -->
      <div class="flex items-end">
        <label class="flex items-center">
          <input
            v-model="localFilters.gmpExpiring"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            @change="updateFilters"
          >
          <span class="ml-2 text-sm text-gray-700">GMP sắp hết hạn (30 ngày)</span>
        </label>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="flex flex-wrap gap-2">
      <button
        @click="showActiveOnly"
        :class="[
          'inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          localFilters.isActive === true ? 'ring-2 ring-blue-500 border-blue-500' : ''
        ]"
      >
        <CheckCircleIcon class="w-4 h-4 mr-1" />
        Chỉ hiện hoạt động
      </button>
      <button
        @click="showGmpExpiring"
        :class="[
          'inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500',
          localFilters.gmpExpiring ? 'ring-2 ring-yellow-500 border-yellow-500' : ''
        ]"
      >
        <ExclamationTriangleIcon class="w-4 h-4 mr-1" />
        GMP sắp hết hạn
      </button>
      <button
        @click="clearAllFilters"
        class="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <XMarkIcon class="w-4 h-4 mr-1" />
        Xóa bộ lọc
      </button>
    </div>

    <!-- Active filters display -->
    <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
      <span class="text-sm text-gray-500">Bộ lọc đang áp dụng:</span>
      <span v-if="localFilters.search" 
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        Tìm kiếm: {{ localFilters.search }}
        <button @click="clearSearch" class="ml-1 hover:text-blue-600">
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>
      <span v-if="localFilters.country" 
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
        Quốc gia: {{ localFilters.country }}
        <button @click="clearCountry" class="ml-1 hover:text-green-600">
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>
      <span v-if="localFilters.isActive !== null" 
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        Trạng thái: {{ localFilters.isActive ? 'Hoạt động' : 'Ngừng hoạt động' }}
        <button @click="clearStatus" class="ml-1 hover:text-yellow-600">
          <XMarkIcon class="w-3 h-3" />
        </button>
      </span>
      <span v-if="localFilters.gmpExpiring" 
            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
        GMP sắp hết hạn
        <button @click="clearGmpExpiring" class="ml-1 hover:text-red-600">
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
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  countryOptions: {
    type: Array,
    default: () => ['Việt Nam', 'Hoa Kỳ', 'Trung Quốc', 'Nhật Bản', 'Hàn Quốc', 'Đức', 'Pháp', 'Ấn Độ', 'Thái Lan']
  }
})

const emit = defineEmits(['update:filters'])

const localFilters = ref({ ...props.filters })

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

const hasActiveFilters = computed(() => {
  return localFilters.value.search || 
         localFilters.value.country || 
         localFilters.value.isActive !== null || 
         localFilters.value.gmpExpiring
})

const updateFilters = () => {
  emit('update:filters', { ...localFilters.value })
}

const debouncedUpdate = debounce(updateFilters, 300)

// Quick filter actions
const showActiveOnly = () => {
  localFilters.value.isActive = localFilters.value.isActive === true ? null : true
  updateFilters()
}

const showGmpExpiring = () => {
  localFilters.value.gmpExpiring = !localFilters.value.gmpExpiring
  updateFilters()
}

const clearAllFilters = () => {
  localFilters.value = {
    search: '',
    country: '',
    isActive: null,
    gmpExpiring: false
  }
  updateFilters()
}

// Individual filter clear functions
const clearSearch = () => {
  localFilters.value.search = ''
  updateFilters()
}

const clearCountry = () => {
  localFilters.value.country = ''
  updateFilters()
}

const clearStatus = () => {
  localFilters.value.isActive = null
  updateFilters()
}

const clearGmpExpiring = () => {
  localFilters.value.gmpExpiring = false
  updateFilters()
}
</script>
