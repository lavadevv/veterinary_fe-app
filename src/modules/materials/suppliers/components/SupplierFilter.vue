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
              placeholder="Tên nhà cung cấp, mã, nhà sản xuất..."
              class="pl-10 pr-4 py-3 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400"
              @input="debouncedSearch"
            />
          </div>
        </div>

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

        <!-- Country -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Quốc gia xuất xứ
          </label>
          <input
            v-model="localFilters.countryOfOrigin"
            type="text"
            placeholder="Nhập quốc gia"
            class="w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm placeholder-gray-400"
            @input="debouncedSearch"
          />
        </div>
      </div>

      <!-- Date range filters -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
        <!-- GMP Expiry From -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            GMP hết hạn từ ngày
          </label>
          <input
            v-model="localFilters.gmpExpiryFromDate"
            type="date"
            class="w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            @change="handleFilterChange"
          />
        </div>

        <!-- GMP Expiry To -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            GMP hết hạn đến ngày
          </label>
          <input
            v-model="localFilters.gmpExpiryToDate"
            type="date"
            class="w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
            @change="handleFilterChange"
          />
        </div>

        <!-- Sort Field -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Sắp xếp theo
          </label>
          <select
            v-model="localFilters.sortField"
            class="w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-white"
            @change="handleFilterChange"
          >
            <option value="id">Mã ID</option>
            <option value="supplierCode">Mã nhà cung cấp</option>
            <option value="supplierName">Tên nhà cung cấp</option>
            <option value="countryOfOrigin">Quốc gia</option>
            <option value="gmpExpiryDate">Ngày hết hạn GMP</option>
          </select>
        </div>

        <!-- Sort Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Thứ tự sắp xếp
          </label>
          <select
            v-model="localFilters.sortType"
            class="w-full py-3 px-4 rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm bg-white"
            @change="handleFilterChange"
          >
            <option value="asc">Tăng dần (A-Z, 1-9)</option>
            <option value="desc">Giảm dần (Z-A, 9-1)</option>
          </select>
        </div>
      </div>

      <!-- Actions and Results -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
        <div class="flex flex-wrap items-center gap-3">
          <button
            @click="clearFilters"
            class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <XMarkIcon class="h-4 w-4 mr-2" />
            Xóa bộ lọc
          </button>
          
          <div class="flex items-center text-sm text-gray-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
            <span class="font-medium text-blue-700">{{ totalResults }}</span>
            <span class="ml-1">kết quả được tìm thấy</span>
          </div>
        </div>

        <!-- Quick filters -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="setQuickFilter('active')"
            class="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
          >
            Đang hoạt động
          </button>
          <button
            @click="setQuickFilter('inactive')"
            class="px-3 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full hover:bg-red-200 transition-colors"
          >
            Ngừng hoạt động
          </button>
          <button
            @click="setQuickFilter('expiring')"
            class="px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full hover:bg-yellow-200 transition-colors"
          >
            GMP sắp hết hạn
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { ChevronDownIcon, MagnifyingGlassIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { debounce } from 'lodash-es'

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

const emit = defineEmits(['update:filters', 'clear-filters'])

const showFilters = ref(false)

const localFilters = reactive({
  keywords: props.filters.keywords || '',
  isActive: props.filters.isActive,
  countryOfOrigin: props.filters.countryOfOrigin || '',
  gmpExpiryFromDate: props.filters.gmpExpiryFromDate || null,
  gmpExpiryToDate: props.filters.gmpExpiryToDate || null,
  sortField: props.filters.sortField || 'id',
  sortType: props.filters.sortType || 'desc'
})

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  Object.assign(localFilters, {
    keywords: newFilters.keywords || '',
    isActive: newFilters.isActive,
    countryOfOrigin: newFilters.countryOfOrigin || '',
    gmpExpiryFromDate: newFilters.gmpExpiryFromDate || null,
    gmpExpiryToDate: newFilters.gmpExpiryToDate || null,
    sortField: newFilters.sortField || 'id',
    sortType: newFilters.sortType || 'desc'
  })
}, { deep: true })

const debouncedSearch = debounce(() => {
  handleFilterChange()
}, 500)

const handleFilterChange = () => {
  const cleanFilters = { ...localFilters }
  
  // Remove empty values
  Object.keys(cleanFilters).forEach(key => {
    if (cleanFilters[key] === '' || cleanFilters[key] === null) {
      delete cleanFilters[key]
    }
  })
  
  emit('update:filters', cleanFilters)
}

const clearFilters = () => {
  Object.assign(localFilters, {
    keywords: '',
    isActive: null,
    countryOfOrigin: '',
    gmpExpiryFromDate: null,
    gmpExpiryToDate: null,
    sortField: 'id',
    sortType: 'desc'
  })
  emit('clear-filters')
}

const setQuickFilter = (type) => {
  // Clear existing filters first
  Object.assign(localFilters, {
    keywords: '',
    isActive: null,
    countryOfOrigin: '',
    gmpExpiryFromDate: null,
    gmpExpiryToDate: null,
    sortField: 'id',
    sortType: 'desc'
  })

  // Apply quick filter
  switch (type) {
    case 'active':
      localFilters.isActive = true
      break
    case 'inactive':
      localFilters.isActive = false
      break
    case 'expiring':
      // Set GMP expiry to next 30 days
      const today = new Date()
      const in30Days = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000))
      localFilters.gmpExpiryFromDate = today.toISOString().split('T')[0]
      localFilters.gmpExpiryToDate = in30Days.toISOString().split('T')[0]
      break
  }
  
  handleFilterChange()
}
</script>
