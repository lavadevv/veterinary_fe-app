<!-- WarehouseFilters.vue - Advanced filtering component for warehouses -->
<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
    <!-- Filter Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6">
      <div class="flex items-center space-x-3 mb-3 sm:mb-0">
        <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-gray-900">Bộ lọc tìm kiếm</h3>
          <p class="text-sm text-gray-500">Tìm kiếm và lọc danh sách kho</p>
        </div>
      </div>
      
      <!-- Mobile Toggle Button -->
      <button
        v-if="isMobile"
        @click="showMobileFilters = !showMobileFilters"
        class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
        </svg>
        {{ showMobileFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc' }}
      </button>
    </div>

    <!-- Search Bar (Always visible) -->
    <div class="mb-4 sm:mb-6">
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          v-model="localFilters.keywords"
          @input="handleSearch"
          type="text"
          placeholder="Tìm kiếm theo tên kho, mã kho..."
          class="block w-full pl-9 sm:pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-sm sm:text-base"
        />
      </div>
    </div>

    <!-- Advanced Filters -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 max-h-0"
      enter-to-class="opacity-100 max-h-screen"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100 max-h-screen"
      leave-to-class="opacity-0 max-h-0"
    >
      <div v-show="showMobileFilters || !isMobile" class="overflow-hidden">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          <!-- Warehouse Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Loại kho
            </label>
            <Listbox v-model="localFilters.warehouseType" @update:modelValue="handleSearch">
              <div class="relative">
                <ListboxButton 
                  :class="[
                    'relative w-full cursor-default rounded-md border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-sm',
                    'focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500',
                    'hover:border-gray-400 transition-colors duration-200'
                  ]"
                >
                  <span class="block truncate">{{ getWarehouseTypeLabel(localFilters.warehouseType) || 'Chọn loại kho' }}</span>
                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>
                <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                  <ListboxOptions class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                    <ListboxOption v-slot="{ active, selected }" :value="''" as="template">
                      <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">Tất cả loại kho</span>
                        <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                    <ListboxOption v-for="type in warehouseTypes" :key="type.value" v-slot="{ active, selected }" :value="type.value" as="template">
                      <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ type.label }}</span>
                        <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>

          <!-- Status Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái
            </label>
            <Listbox v-model="localFilters.isActive" @update:modelValue="handleSearch">
              <div class="relative">
                <ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 hover:border-gray-400 transition-colors duration-200">
                  <span class="block truncate">{{ getStatusLabel(localFilters.isActive) }}</span>
                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>
                <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                  <ListboxOptions class="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white py-1 text-base shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-200">
                    <ListboxOption v-for="status in statusOptions" :key="status.value" v-slot="{ active, selected }" :value="status.value" as="template">
                      <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-10 pr-4']">
                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">{{ status.label }}</span>
                        <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>

          <!-- Sort Field Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Sắp xếp theo
            </label>
            <Listbox v-model="localFilters.sortField" @update:modelValue="handleSearch">
              <div class="relative">
                <ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <span class="block truncate text-sm">{{ getSortFieldLabel(localFilters.sortField) }}</span>
                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>
                <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                  <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <ListboxOption v-for="option in sortFieldOptions" :key="option.value" v-slot="{ active, selected }" :value="option.value" as="template">
                      <li :class="[
                        active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-10 pr-4'
                      ]">
                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate text-sm']">
                          {{ option.label }}
                        </span>
                        <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>

          <!-- Sort Type Filter -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Thứ tự
            </label>
            <Listbox v-model="localFilters.sortType" @update:modelValue="handleSearch">
              <div class="relative">
                <ListboxButton class="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-3 pl-3 pr-10 text-left shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <span class="block truncate text-sm">{{ getSortTypeLabel(localFilters.sortType) }}</span>
                  <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                    <ChevronUpDownIcon class="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </span>
                </ListboxButton>
                <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                  <ListboxOptions class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <ListboxOption v-for="option in sortTypeOptions" :key="option.value" v-slot="{ active, selected }" :value="option.value" as="template">
                      <li :class="[
                        active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900',
                        'relative cursor-default select-none py-2 pl-10 pr-4'
                      ]">
                        <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate text-sm']">
                          {{ option.label }}
                        </span>
                        <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-3 text-emerald-600">
                          <CheckIcon class="h-5 w-5" aria-hidden="true" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>
        </div>

        <!-- Filter Actions -->
        <div class="mt-6 flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            @click="handleReset"
            type="button"
            class="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
          >
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Đặt lại bộ lọc
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/vue/20/solid'

// Props
const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['update:filters', 'search', 'reset'])

// Local state
const localFilters = ref({ ...props.filters })
const showMobileFilters = ref(false)

// Responsive detection
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value < 1024) // lg breakpoint

// Update window width on resize
const updateWindowWidth = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', updateWindowWidth)
  // Auto-show filters on desktop
  if (!isMobile.value) {
    showMobileFilters.value = true
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWindowWidth)
})

// Warehouse type options
const warehouseTypes = ref([
  { value: 'Kho nguyên liệu', label: 'Kho nguyên liệu' },
  { value: 'Kho bao bì', label: 'Kho bao bì' },
  { value: 'Thành phẩm', label: 'Kho thành phẩm' },
  { value: 'Kho phụ liệu', label: 'Kho phụ liệu' },
  { value: 'Kho tạm', label: 'Kho tạm' }
])

// Status options
const statusOptions = ref([
  { value: null, label: 'Tất cả trạng thái' },
  { value: true, label: 'Đang hoạt động' },
  { value: false, label: 'Ngừng hoạt động' }
])

// Sort field options
const sortFieldOptions = ref([
  { value: 'id', label: 'ID' },
  { value: 'warehouseCode', label: 'Mã kho' },
  { value: 'warehouseName', label: 'Tên kho' },
  { value: 'warehouseType', label: 'Loại kho' },
  { value: 'address', label: 'Địa chỉ' }
])

// Sort type options
const sortTypeOptions = ref([
  { value: 'ASC', label: 'Tăng dần' },
  { value: 'DESC', label: 'Giảm dần' }
])

// Helper functions
const getWarehouseTypeLabel = (value) => {
  const type = warehouseTypes.value.find(t => t.value === value)
  return type ? type.label : 'Tất cả loại kho'
}

const getStatusLabel = (value) => {
  const status = statusOptions.value.find(s => s.value === value)
  return status ? status.label : 'Tất cả trạng thái'
}

const getSortFieldLabel = (value) => {
  const field = sortFieldOptions.value.find(f => f.value === value)
  return field ? field.label : 'ID'
}

const getSortTypeLabel = (value) => {
  const type = sortTypeOptions.value.find(t => t.value === value)
  return type ? type.label : 'Giảm dần'
}

// Event handlers
const handleSearch = () => {
  emit('update:filters', localFilters.value)
  emit('search')
}

const handleReset = () => {
  localFilters.value = {
    keywords: '',
    warehouseType: '',
    isActive: null,
    sortField: 'id',
    sortType: 'DESC'
  }
  emit('update:filters', localFilters.value)
  emit('reset')
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })
</script>
