<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Mobile Filter Toggle -->
    <div class="block md:hidden p-4 border-b border-gray-200">
      <button
        @click="showMobileFilters = !showMobileFilters"
        class="flex items-center justify-between w-full text-left"
      >
        <span class="text-sm font-medium text-gray-900">
          Bộ lọc {{ hasActiveFilters ? `(${activeFilterCount})` : '' }}
        </span>
        <ChevronDownIcon 
          class="h-5 w-5 text-gray-400 transition-transform duration-200"
          :class="showMobileFilters ? 'rotate-180' : ''"
        />
      </button>
    </div>

    <!-- Filter Content -->
    <div 
      class="transition-all duration-200 ease-in-out"
      :class="showMobileFilters ? 'block' : 'hidden md:block'"
    >
      <div class="p-4 space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-4">
        <!-- Search Keywords -->
        <div class="md:col-span-3">
          <label class="block text-xs font-medium text-gray-700 mb-1">
            Tìm kiếm
          </label>
          <div class="relative">
            <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              v-model="localFilters.keywords"
              type="text"
              placeholder="Tên, mã, tên viết tắt..."
              class="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              @input="debouncedSearch"
            />
          </div>
        </div>

        <!-- Material Type -->
        <div class="md:col-span-2">
          <label class="block text-xs font-medium text-gray-700 mb-1">
            Loại vật liệu
          </label>
          <Listbox v-model="localFilters.materialType">
            <div class="relative">
              <ListboxButton class="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <span class="block truncate">
                  {{ selectedMaterialTypeLabel || 'Tất cả' }}
                </span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronUpDownIcon class="w-4 h-4 text-gray-400" />
                </span>
              </ListboxButton>
              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-sm bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ListboxOption
                    v-slot="{ active, selected }"
                    :value="null"
                    as="template"
                  >
                    <li :class="[active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9']">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                        Tất cả
                      </span>
                      <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                        <CheckIcon class="w-4 h-4" />
                      </span>
                    </li>
                  </ListboxOption>
                  <ListboxOption
                    v-for="type in materialTypes"
                    :key="type.value"
                    v-slot="{ active, selected }"
                    :value="type.value"
                    as="template"
                  >
                    <li :class="[active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9']">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                        {{ type.label }}
                      </span>
                      <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                        <CheckIcon class="w-4 h-4" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <!-- Material Form -->
        <div class="md:col-span-2">
          <label class="block text-xs font-medium text-gray-700 mb-1">
            Dạng vật liệu
          </label>
          <Listbox v-model="localFilters.materialForm">
            <div class="relative">
              <ListboxButton class="relative w-full py-2 pl-3 pr-10 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm">
                <span class="block truncate">
                  {{ selectedMaterialFormLabel || 'Tất cả' }}
                </span>
                <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                  <ChevronUpDownIcon class="w-4 h-4 text-gray-400" />
                </span>
              </ListboxButton>
              <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                <ListboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-sm bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <ListboxOption
                    v-slot="{ active, selected }"
                    :value="null"
                    as="template"
                  >
                    <li :class="[active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9']">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                        Tất cả
                      </span>
                      <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                        <CheckIcon class="w-4 h-4" />
                      </span>
                    </li>
                  </ListboxOption>
                  <ListboxOption
                    v-for="form in materialForms"
                    :key="form.value"
                    v-slot="{ active, selected }"
                    :value="form.value"
                    as="template"
                  >
                    <li :class="[active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-3 pr-9']">
                      <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                        {{ form.label }}
                      </span>
                      <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-4']">
                        <CheckIcon class="w-4 h-4" />
                      </span>
                    </li>
                  </ListboxOption>
                </ListboxOptions>
              </transition>
            </div>
          </Listbox>
        </div>

        <!-- Quick Filters -->
        <div class="md:col-span-3">
          <label class="block text-xs font-medium text-gray-700 mb-1">
            Lọc nhanh
          </label>
          <div class="grid grid-cols-2 gap-2">
            <label class="flex items-center text-xs">
              <input
                v-model="localFilters.isActive"
                type="checkbox"
                :indeterminate="localFilters.isActive === null"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 focus:ring-2"
                @change="handleActiveChange"
              />
              <span class="ml-2">Đang hoạt động</span>
            </label>
            <label class="flex items-center text-xs">
              <input
                v-model="localFilters.lowStock"
                type="checkbox"
                class="rounded border-gray-300 text-amber-600 focus:ring-amber-500 focus:ring-offset-0 focus:ring-2"
              />
              <span class="ml-2">Tồn kho thấp</span>
            </label>
            <label class="flex items-center text-xs">
              <input
                v-model="localFilters.requiresColdStorage"
                type="checkbox"
                class="rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 focus:ring-2"
              />
              <span class="ml-2">Bảo quản lạnh</span>
            </label>
          </div>
        </div>

        <!-- Sort -->
        <div class="md:col-span-2">
          <label class="block text-xs font-medium text-gray-700 mb-1">
            Sắp xếp
          </label>
          <div class="grid grid-cols-2 gap-1">
            <Listbox v-model="localFilters.sortField">
              <div class="relative">
                <ListboxButton class="relative w-full py-2 pl-2 pr-6 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs">
                  <span class="block truncate">
                    {{ selectedSortFieldLabel }}
                  </span>
                  <span class="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                    <ChevronUpDownIcon class="w-3 h-3 text-gray-400" />
                  </span>
                </ListboxButton>
                <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                  <ListboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-xs bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <ListboxOption
                      v-for="option in sortOptions"
                      :key="option.value"
                      v-slot="{ active, selected }"
                      :value="option.value"
                      as="template"
                    >
                      <li :class="[active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-2 pr-6']">
                        <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                          {{ option.label }}
                        </span>
                        <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-2']">
                          <CheckIcon class="w-3 h-3" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
            <Listbox v-model="localFilters.sortType">
              <div class="relative">
                <ListboxButton class="relative w-full py-2 pl-2 pr-6 text-left bg-white border border-gray-300 rounded-md shadow-sm cursor-default focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs">
                  <span class="block truncate">
                    {{ selectedSortTypeLabel }}
                  </span>
                  <span class="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                    <ChevronUpDownIcon class="w-3 h-3 text-gray-400" />
                  </span>
                </ListboxButton>
                <transition leave-active-class="transition duration-100 ease-in" leave-from-class="opacity-100" leave-to-class="opacity-0">
                  <ListboxOptions class="absolute z-10 w-full py-1 mt-1 overflow-auto text-xs bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <ListboxOption
                      v-for="type in sortTypes"
                      :key="type.value"
                      v-slot="{ active, selected }"
                      :value="type.value"
                      as="template"
                    >
                      <li :class="[active ? 'text-white bg-blue-600' : 'text-gray-900', 'cursor-default select-none relative py-2 pl-2 pr-6']">
                        <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                          {{ type.label }}
                        </span>
                        <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 right-0 flex items-center pr-2']">
                          <CheckIcon class="w-3 h-3" />
                        </span>
                      </li>
                    </ListboxOption>
                  </ListboxOptions>
                </transition>
              </div>
            </Listbox>
          </div>
        </div>
      </div>

      <!-- Price Range (Advanced Filter) -->
      <div class="px-4 pb-4" v-if="showAdvancedFilters">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Giá từ (VND)
            </label>
            <input
              v-model.number="localFilters.minFixedPrice"
              type="number"
              min="0"
              step="1000"
              placeholder="0"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-gray-700 mb-1">
              Giá đến (VND)
            </label>
            <input
              v-model.number="localFilters.maxFixedPrice"
              type="number"
              min="0"
              step="1000"
              placeholder="Không giới hạn"
              class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <!-- Filter Actions -->
      <div class="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <button
            @click="showAdvancedFilters = !showAdvancedFilters"
            class="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            {{ showAdvancedFilters ? 'Ẩn' : 'Hiện' }} bộ lọc nâng cao
          </button>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="resetFilters"
            class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          >
            Đặt lại
          </button>
          <button
            @click="applyFilters"
            class="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { debounce } from 'lodash-es'
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption
} from '@headlessui/vue'
import {
  ChevronDownIcon,
  ChevronUpDownIcon,
  CheckIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import {
  getMaterialTypesOptions,
  getMaterialFormsOptions,
  getMaterialTypeLabel,
  getMaterialFormLabel,
  SORT_OPTIONS,
  SORT_TYPES
} from '../constants/material.constants'

const props = defineProps({
  filters: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update:filters', 'reset'])

// Local state
const showMobileFilters = ref(false)
const showAdvancedFilters = ref(false)
const localFilters = ref({ ...props.filters })
const isUpdatingFromProps = ref(false)

// Options
const materialTypes = getMaterialTypesOptions()
const materialForms = getMaterialFormsOptions()
const sortOptions = SORT_OPTIONS
const sortTypes = Object.values(SORT_TYPES)

// Computed properties
const selectedMaterialTypeLabel = computed(() => {
  return localFilters.value.materialType ? getMaterialTypeLabel(localFilters.value.materialType) : null
})

const selectedMaterialFormLabel = computed(() => {
  return localFilters.value.materialForm ? getMaterialFormLabel(localFilters.value.materialForm) : null
})

const selectedSortFieldLabel = computed(() => {
  return sortOptions.find(option => option.value === localFilters.value.sortField)?.label || 'Mới nhất'
})

const selectedSortTypeLabel = computed(() => {
  return sortTypes.find(type => type.value === localFilters.value.sortType)?.label || 'Giảm dần'
})

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

const handleActiveChange = () => {
  // Handle tri-state checkbox for isActive
  if (localFilters.value.isActive === null) {
    localFilters.value.isActive = true
  } else if (localFilters.value.isActive === true) {
    localFilters.value.isActive = false
  } else {
    localFilters.value.isActive = null
  }
  // Note: applyFilters sẽ được gọi tự động bởi watcher
}

const applyFilters = () => {
  emit('update:filters', { ...localFilters.value })
}

const resetFilters = () => {
  const resetData = {
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
  
  // Cập nhật local filters mà không trigger watcher
  Object.assign(localFilters.value, resetData)
  
  // Emit update với dữ liệu mới
  emit('update:filters', { ...resetData })
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  if (JSON.stringify(newFilters) !== JSON.stringify(localFilters.value)) {
    isUpdatingFromProps.value = true
    localFilters.value = { ...newFilters }
    nextTick(() => {
      isUpdatingFromProps.value = false
    })
  }
}, { deep: true, immediate: true })

// Watch for filter changes and auto-apply (except keywords)
watch(() => localFilters.value.materialType, () => {
  if (!isUpdatingFromProps.value) {
    localFilters.value.start = 0
    applyFilters()
  }
})

watch(() => localFilters.value.materialForm, () => {
  if (!isUpdatingFromProps.value) {
    localFilters.value.start = 0
    applyFilters()
  }
})

watch(() => localFilters.value.supplierId, () => {
  if (!isUpdatingFromProps.value) {
    localFilters.value.start = 0
    applyFilters()
  }
})

watch(() => localFilters.value.requiresColdStorage, () => {
  if (!isUpdatingFromProps.value) {
    localFilters.value.start = 0
    applyFilters()
  }
})

watch(() => localFilters.value.isActive, () => {
  if (!isUpdatingFromProps.value) {
    localFilters.value.start = 0
    applyFilters()
  }
})

watch(() => localFilters.value.lowStock, () => {
  if (!isUpdatingFromProps.value) {
    localFilters.value.start = 0
    applyFilters()
  }
})

watch(() => localFilters.value.sortField, () => {
  if (!isUpdatingFromProps.value) {
    applyFilters()
  }
})

watch(() => localFilters.value.sortType, () => {
  if (!isUpdatingFromProps.value) {
    applyFilters()
  }
})
</script>
