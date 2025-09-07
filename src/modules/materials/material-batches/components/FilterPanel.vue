<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
    <!-- Enhanced Header -->
    <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
            <FunnelIcon class="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 class="text-base font-semibold text-gray-900">Bộ lọc nâng cao</h3>
            <p class="text-xs text-gray-500 mt-0.5">Tìm kiếm và lọc lô vật liệu</p>
          </div>
          <span 
            v-if="hasActiveFilters" 
            class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 shadow-sm"
          >
            {{ activeFilterCount }} bộ lọc đang áp dụng
          </span>
        </div>
        <div class="flex items-center space-x-2">
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 border border-red-200 hover:border-red-300"
          >
            <XMarkIcon class="w-4 h-4 mr-1" />
            Xóa bộ lọc
          </button>
          <button
            @click="toggleExpanded"
            class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
          >
            <ChevronDownIcon
              :class="[
                'w-5 h-5 transition-transform duration-300',
                expanded ? 'transform rotate-180' : ''
              ]"
            />
          </button>
        </div>
      </div>
    </div>

    <!-- Content -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 scale-95 max-h-0"
      enter-to-class="opacity-100 scale-100 max-h-screen"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 scale-100 max-h-screen"
      leave-to-class="opacity-0 scale-95 max-h-0"
    >
      <div v-show="expanded" class="px-6 py-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Search -->
          <div class="col-span-full">
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Tìm kiếm
            </label>
            <div class="relative">
              <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="localFilters.keywords"
                type="text"
                placeholder="Tìm theo số lô, mã nội bộ, mã NSX, tên vật liệu..."
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                @input="debouncedSearch"
              />
            </div>
          </div>

          <!-- Material -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Vật liệu
            </label>
            <Listbox v-model="localFilters.materialId">
              <div class="relative">
                <ListboxButton class="relative w-full py-3 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors">
                  <span class="block truncate">
                    {{ selectedMaterialName || 'Tất cả vật liệu' }}
                  </span>
                  <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronUpDownIcon class="w-5 h-5 text-gray-400" />
                  </span>
                </ListboxButton>
                <Transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <ListboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-sm bg-white border border-gray-300 rounded-md shadow-lg max-h-60 focus:outline-none">
                    <ListboxOption
                      :value="null"
                      :class="({ active, selected }) => [
                        'relative cursor-pointer select-none py-2 pl-3 pr-9',
                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                      ]"
                    >
                      <span class="block truncate">Tất cả vật liệu</span>
                    </ListboxOption>
                    <ListboxOption
                      v-for="material in materials"
                      :key="material.id"
                      :value="material.id"
                      :class="({ active, selected }) => [
                        'relative cursor-pointer select-none py-2 pl-3 pr-9',
                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                      ]"
                    >
                      <span :class="['block truncate', selected ? 'font-medium' : 'font-normal']">
                        {{ material.materialCode }} - {{ material.materialName }}
                      </span>
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
                      >
                        <CheckIcon class="w-4 h-4" />
                      </span>
                    </ListboxOption>
                  </ListboxOptions>
                </Transition>
              </div>
            </Listbox>
          </div>

          <!-- Test Status -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Trạng thái kiểm nghiệm
            </label>
            <Listbox v-model="localFilters.testStatus">
              <div class="relative">
                <ListboxButton class="relative w-full py-3 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors">
                  <span class="block truncate">
                    {{ selectedTestStatusLabel || 'Tất cả trạng thái' }}
                  </span>
                  <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronUpDownIcon class="w-5 h-5 text-gray-400" />
                  </span>
                </ListboxButton>
                <Transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <ListboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-sm bg-white border border-gray-300 rounded-md shadow-lg max-h-60 focus:outline-none">
                    <ListboxOption
                      :value="null"
                      :class="({ active }) => [
                        'relative cursor-pointer select-none py-2 pl-3 pr-9',
                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                      ]"
                    >
                      <span class="block truncate">Tất cả trạng thái</span>
                    </ListboxOption>
                    <ListboxOption
                      v-for="(label, status) in TEST_STATUS_LABELS"
                      :key="status"
                      :value="status"
                      :class="({ active, selected }) => [
                        'relative cursor-pointer select-none py-2 pl-3 pr-9',
                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                      ]"
                    >
                      <span :class="['block truncate', selected ? 'font-medium' : 'font-normal']">
                        {{ label }}
                      </span>
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
                      >
                        <CheckIcon class="w-4 h-4" />
                      </span>
                    </ListboxOption>
                  </ListboxOptions>
                </Transition>
              </div>
            </Listbox>
          </div>

          <!-- Usage Status -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Trạng thái sử dụng
            </label>
            <Listbox v-model="localFilters.usageStatus">
              <div class="relative">
                <ListboxButton class="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                  <span class="block truncate">
                    {{ selectedUsageStatusLabel || 'Tất cả trạng thái' }}
                  </span>
                  <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <ChevronUpDownIcon class="w-4 h-4 text-gray-400" />
                  </span>
                </ListboxButton>
                <Transition
                  enter-active-class="transition duration-100 ease-out"
                  enter-from-class="transform scale-95 opacity-0"
                  enter-to-class="transform scale-100 opacity-100"
                  leave-active-class="transition duration-75 ease-in"
                  leave-from-class="transform scale-100 opacity-100"
                  leave-to-class="transform scale-95 opacity-0"
                >
                  <ListboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-sm bg-white border border-gray-300 rounded-md shadow-lg max-h-60 focus:outline-none">
                    <ListboxOption
                      :value="null"
                      :class="({ active }) => [
                        'relative cursor-pointer select-none py-2 pl-3 pr-9',
                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                      ]"
                    >
                      <span class="block truncate">Tất cả trạng thái</span>
                    </ListboxOption>
                    <ListboxOption
                      v-for="(label, status) in USAGE_STATUS_LABELS"
                      :key="status"
                      :value="status"
                      :class="({ active, selected }) => [
                        'relative cursor-pointer select-none py-2 pl-3 pr-9',
                        active ? 'bg-blue-600 text-white' : 'text-gray-900'
                      ]"
                    >
                      <span :class="['block truncate', selected ? 'font-medium' : 'font-normal']">
                        {{ label }}
                      </span>
                      <span
                        v-if="selected"
                        class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
                      >
                        <CheckIcon class="w-4 h-4" />
                      </span>
                    </ListboxOption>
                  </ListboxOptions>
                </Transition>
              </div>
            </Listbox>
          </div>

          <!-- Sort -->
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Sắp xếp
            </label>
            <div class="flex space-x-2">
              <Listbox v-model="localFilters.sortBy" class="flex-1">
                <div class="relative">
                  <ListboxButton class="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
                    <span class="block truncate">
                      {{ sortOptions.find(opt => opt.value === localFilters.sortBy)?.label || 'ID' }}
                    </span>
                    <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronUpDownIcon class="w-4 h-4 text-gray-400" />
                    </span>
                  </ListboxButton>
                  <Transition
                    enter-active-class="transition duration-100 ease-out"
                    enter-from-class="transform scale-95 opacity-0"
                    enter-to-class="transform scale-100 opacity-100"
                    leave-active-class="transition duration-75 ease-in"
                    leave-from-class="transform scale-100 opacity-100"
                    leave-to-class="transform scale-95 opacity-0"
                  >
                    <ListboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-sm bg-white border border-gray-300 rounded-md shadow-lg max-h-60 focus:outline-none">
                      <ListboxOption
                        v-for="option in sortOptions"
                        :key="option.value"
                        :value="option.value"
                        :class="({ active, selected }) => [
                          'relative cursor-pointer select-none py-2 pl-3 pr-9',
                          active ? 'bg-blue-600 text-white' : 'text-gray-900'
                        ]"
                      >
                        <span :class="['block truncate', selected ? 'font-medium' : 'font-normal']">
                          {{ option.label }}
                        </span>
                        <span
                          v-if="selected"
                          class="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600"
                        >
                          <CheckIcon class="w-4 h-4" />
                        </span>
                      </ListboxOption>
                    </ListboxOptions>
                  </Transition>
                </div>
              </Listbox>
              <button
                @click="toggleSortDirection"
                :class="[
                  'px-3 py-2 border border-gray-300 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500',
                  localFilters.sortDir === 'asc' 
                    ? 'bg-blue-50 text-blue-700 border-blue-300' 
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                ]"
              >
                <component
                  :is="localFilters.sortDir === 'asc' ? ChevronUpIcon : ChevronDownIcon"
                  class="w-4 h-4"
                />
              </button>
            </div>
          </div>

          <!-- Date Range Filters -->
          <div class="col-span-full">
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Bộ lọc theo ngày</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Received Date Range -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ngày nhận từ
                  </label>
                  <input
                    v-model="localFilters.receivedFromDate"
                    type="date"
                    class="w-full py-3 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Ngày nhận đến
                  </label>
                  <input
                    v-model="localFilters.receivedToDate"
                    type="date"
                    class="w-full py-3 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <div class="col-span-full">
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Hạn sử dụng</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Expiry Date Range -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Hạn sử dụng từ
                  </label>
                  <input
                    v-model="localFilters.expiryFromDate"
                    type="date"
                    class="w-full py-3 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Hạn sử dụng đến
                  </label>
                  <input
                    v-model="localFilters.expiryToDate"
                    type="date"
                    class="w-full py-3 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Quantity Range -->
          <div class="col-span-full">
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Khoảng số lượng</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng tối thiểu
                  </label>
                  <input
                    v-model.number="localFilters.minQuantity"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    class="w-full py-3 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    Số lượng tối đa
                  </label>
                  <input
                    v-model.number="localFilters.maxQuantity"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="999999.99"
                    class="w-full py-3 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <!-- Quick Filters -->
          <div class="col-span-full">
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h4 class="text-sm font-medium text-gray-900 mb-3">Bộ lọc nhanh</h4>
              <div class="flex flex-wrap gap-3">
                <button
                  @click="toggleNearExpiry"
                  :class="[
                    'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out transform',
                    localFilters.nearExpiry 
                      ? 'bg-orange-100 text-orange-800 border border-orange-300 shadow-sm scale-100' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:scale-105'
                  ]"
                >
                  <ClockIcon class="w-4 h-4 mr-2" />
                  Gần hết hạn (30 ngày)
                </button>
                <button
                  @click="toggleExpired"
                  :class="[
                    'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out transform',
                    localFilters.expired 
                      ? 'bg-red-100 text-red-800 border border-red-300 shadow-sm scale-100' 
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400 hover:scale-105'
                  ]"
                >
                  <ExclamationTriangleIcon class="w-4 h-4 mr-2" />
                  Đã hết hạn
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, shallowRef } from 'vue'
import { debounce, throttle } from 'lodash-es'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  ChevronUpIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  XMarkIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/20/solid'
import { TEST_STATUS, USAGE_STATUS } from '../constants/materialBatchConstants'

// Convert enum to labels for display
const TEST_STATUS_LABELS = {
  [TEST_STATUS.CHUA_KIEM_NGHIEM]: 'Chưa kiểm nghiệm',
  [TEST_STATUS.DANG_KIEM_NGHIEM]: 'Đang kiểm nghiệm',
  [TEST_STATUS.DAT_TIEU_CHUAN]: 'Đạt tiêu chuẩn',
  [TEST_STATUS.KHONG_DAT_TIEU_CHUAN]: 'Không đạt tiêu chuẩn',
  [TEST_STATUS.CAN_KIEM_NGHIEM_LAI]: 'Cần kiểm nghiệm lại'
}

const USAGE_STATUS_LABELS = {
  [USAGE_STATUS.CHUA_SU_DUNG]: 'Chưa sử dụng',
  [USAGE_STATUS.SAN_SANG_SU_DUNG]: 'Sẵn sàng sử dụng',
  [USAGE_STATUS.DANG_SU_DUNG]: 'Đang sử dụng',
  [USAGE_STATUS.DA_SU_DUNG_HET]: 'Đã sử dụng hết',
  [USAGE_STATUS.BI_LOI]: 'Bị lỗi',
  [USAGE_STATUS.HET_HAN]: 'Hết hạn',
  [USAGE_STATUS.BI_HUY]: 'Bị hủy'
}

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  materials: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:filters'])

const expanded = ref(false)
const localFilters = ref({ ...props.filters })

const sortOptions = [
  { value: 'id', label: 'ID' },
  { value: 'batchNumber', label: 'Số lô' },
  { value: 'receivedDate', label: 'Ngày nhận' },
  { value: 'expiryDate', label: 'Ngày hết hạn' },
  { value: 'currentQuantity', label: 'Số lượng hiện tại' }
]

const selectedMaterialName = computed(() => {
  if (!localFilters.value.materialId) return null
  const material = props.materials.find(m => m.id === localFilters.value.materialId)
  return material ? `${material.materialCode} - ${material.materialName}` : null
})

const selectedTestStatusLabel = computed(() => {
  return TEST_STATUS_LABELS[localFilters.value.testStatus] || null
})

const selectedUsageStatusLabel = computed(() => {
  return USAGE_STATUS_LABELS[localFilters.value.usageStatus] || null
})

const hasActiveFilters = computed(() => {
  return localFilters.value.keywords ||
         localFilters.value.materialId ||
         localFilters.value.testStatus ||
         localFilters.value.usageStatus ||
         localFilters.value.receivedFromDate ||
         localFilters.value.receivedToDate ||
         localFilters.value.expiryFromDate ||
         localFilters.value.expiryToDate ||
         localFilters.value.minQuantity ||
         localFilters.value.maxQuantity ||
         localFilters.value.nearExpiry ||
         localFilters.value.expired ||
         localFilters.value.sortBy !== 'id' ||
         localFilters.value.sortDir !== 'desc'
})

const activeFilterCount = computed(() => {
  let count = 0
  if (localFilters.value.keywords) count++
  if (localFilters.value.materialId) count++
  if (localFilters.value.testStatus) count++
  if (localFilters.value.usageStatus) count++
  if (localFilters.value.receivedFromDate || localFilters.value.receivedToDate) count++
  if (localFilters.value.expiryFromDate || localFilters.value.expiryToDate) count++
  if (localFilters.value.minQuantity || localFilters.value.maxQuantity) count++
  if (localFilters.value.nearExpiry) count++
  if (localFilters.value.expired) count++
  if (localFilters.value.sortBy !== 'id' || localFilters.value.sortDir !== 'desc') count++
  return count
})

const debouncedSearch = debounce(() => {
  emit('update:filters', { ...localFilters.value })
}, 500) // Increase debounce time to reduce re-renders

const throttledEmit = throttle(() => {
  emit('update:filters', { ...localFilters.value })
}, 200) // Throttle other filter changes

const toggleExpanded = () => {
  expanded.value = !expanded.value
}

const toggleSortDirection = () => {
  localFilters.value.sortDir = localFilters.value.sortDir === 'asc' ? 'desc' : 'asc'
  // Don't emit immediately, let the watcher handle it
}

const clearFilters = () => {
  localFilters.value = {
    materialId: null,
    locationId: null,
    testStatus: null,
    usageStatus: null,
    keywords: '',
    receivedFromDate: null,
    receivedToDate: null,
    expiryFromDate: null,
    expiryToDate: null,
    minQuantity: null,
    maxQuantity: null,
    nearExpiry: null,
    expired: null,
    sortBy: 'id',
    sortDir: 'desc'
  }
  emit('update:filters', { ...localFilters.value })
}

const toggleNearExpiry = async () => {
  // Use nextTick to defer the state update and prevent flash
  await nextTick()
  localFilters.value.nearExpiry = localFilters.value.nearExpiry ? null : true
}

const toggleExpired = async () => {
  // Use nextTick to defer the state update and prevent flash
  await nextTick()
  localFilters.value.expired = localFilters.value.expired ? null : true
}

// Watch for changes in non-search filters (exclude keywords to avoid conflicts)
watch(() => [
  localFilters.value.materialId,
  localFilters.value.testStatus,
  localFilters.value.usageStatus,
  localFilters.value.receivedFromDate,
  localFilters.value.receivedToDate,
  localFilters.value.expiryFromDate,
  localFilters.value.expiryToDate,
  localFilters.value.minQuantity,
  localFilters.value.maxQuantity,
  localFilters.value.nearExpiry,
  localFilters.value.expired,
  localFilters.value.sortBy,
  localFilters.value.sortDir
], (newValues, oldValues) => {
  // Only emit if values actually changed
  if (oldValues && JSON.stringify(newValues) !== JSON.stringify(oldValues)) {
    throttledEmit() // Use throttled emit instead of immediate emit
  }
}, { flush: 'post' }) // Execute after component updates

// Watch for external filter changes
watch(() => props.filters, (newFilters, oldFilters) => {
  // Only update if different to avoid infinite loop
  if (oldFilters && JSON.stringify(localFilters.value) !== JSON.stringify(newFilters)) {
    localFilters.value = { ...newFilters }
  }
}, { deep: true, immediate: false })
</script>

<style scoped>
/* Prevent layout shift during state changes */
button {
  will-change: transform, background-color, border-color;
  backface-visibility: hidden;
  transform: translateZ(0);
}

/* Smooth transitions for filter buttons */
.transition-all {
  transition-property: background-color, border-color, color, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Prevent flash during re-renders */
* {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
