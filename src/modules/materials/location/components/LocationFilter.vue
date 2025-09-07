<!-- LocationFilter.vue - Component filter cho location list -->
<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200">
    <!-- Filter Header -->
    <div class="px-4 py-3 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-sm font-medium text-gray-900">Bộ lọc</h3>
        <div class="flex items-center space-x-2">
          <button
            v-if="hasActiveFilters"
            @click="clearFilters"
            class="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
          >
            Xóa bộ lọc
          </button>
          <button
            @click="emit('toggle')"
            class="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200 lg:hidden"
          >
            <XMarkIcon class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- Filter Content -->
    <div class="p-4 space-y-4">
      <!-- Keywords Search -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-2">
          Tìm kiếm
        </label>
        <div class="relative">
          <input
            v-model="localFilters.keywords"
            type="text"
            class="block w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mã vị trí, kệ, tầng..."
          />
          <MagnifyingGlassIcon class="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
        </div>
      </div>

      <!-- Warehouse Filter -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-2">
          Kho
        </label>
        <Listbox v-model="localFilters.warehouseId">
          <div class="relative">
            <ListboxButton class="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-8 text-left border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
              <span v-if="selectedWarehouse" class="block truncate text-gray-900">
                {{ selectedWarehouse.warehouseCode }} - {{ selectedWarehouse.warehouseName }}
              </span>
              <span v-else class="block truncate text-gray-500">
                Tất cả kho
              </span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-4 w-4 text-gray-400" />
              </span>
            </ListboxButton>

            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions class="absolute z-10 mt-1 max-h-40 w-full overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <ListboxOption :value="null" v-slot="{ active, selected }" as="template">
                  <li :class="[active ? 'bg-blue-600 text-white' : 'text-gray-900', 'relative cursor-pointer select-none py-2 pl-8 pr-4']">
                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                      Tất cả kho
                    </span>
                    <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 left-0 flex items-center pl-2']">
                      <CheckIcon class="h-4 w-4" />
                    </span>
                  </li>
                </ListboxOption>
                
                <ListboxOption
                  v-for="warehouse in warehouses"
                  :key="warehouse.id"
                  :value="warehouse.id"
                  v-slot="{ active, selected }"
                  as="template"
                >
                  <li :class="[active ? 'bg-blue-600 text-white' : 'text-gray-900', 'relative cursor-pointer select-none py-2 pl-8 pr-4']">
                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                      {{ warehouse.warehouseCode }} - {{ warehouse.warehouseName }}
                    </span>
                    <span v-if="selected" :class="[active ? 'text-white' : 'text-blue-600', 'absolute inset-y-0 left-0 flex items-center pl-2']">
                      <CheckIcon class="h-4 w-4" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>

      <!-- Availability Filter -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-2">
          Trạng thái
        </label>
        <div class="space-y-2">
          <label class="flex items-center">
            <input
              v-model="availabilityFilter"
              type="radio"
              :value="null"
              class="h-3 w-3 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Tất cả</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="availabilityFilter"
              type="radio"
              :value="true"
              class="h-3 w-3 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Khả dụng</span>
          </label>
          <label class="flex items-center">
            <input
              v-model="availabilityFilter"
              type="radio"
              :value="false"
              class="h-3 w-3 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <span class="ml-2 text-sm text-gray-700">Không khả dụng</span>
          </label>
        </div>
      </div>

      <!-- Capacity Range -->
      <div class="space-y-3">
        <label class="block text-xs font-medium text-gray-700">
          Phạm vi sức chứa
        </label>
        
        <div class="grid grid-cols-2 gap-2">
          <div>
            <input
              v-model.number="localFilters.minCapacity"
              type="number"
              min="0"
              step="0.1"
              class="block w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tối thiểu"
            />
          </div>
          <div>
            <input
              v-model.number="localFilters.maxCapacity"
              type="number"
              min="0"
              step="0.1"
              class="block w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tối đa"
            />
          </div>
        </div>
      </div>

      <!-- Sort Options -->
      <div>
        <label class="block text-xs font-medium text-gray-700 mb-2">
          Sắp xếp theo
        </label>
        <div class="grid grid-cols-2 gap-2">
          <select
            v-model="localFilters.sortField"
            class="block w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdDate">Ngày tạo</option>
            <option value="locationCode">Mã vị trí</option>
            <option value="maxCapacity">Sức chứa</option>
            <option value="currentCapacity">Đã sử dụng</option>
          </select>
          
          <select
            v-model="localFilters.sortType"
            class="block w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="desc">Giảm dần</option>
            <option value="asc">Tăng dần</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Apply Button -->
    <div class="px-4 py-3 border-t border-gray-200">
      <button
        @click="applyFilters"
        class="w-full bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
      >
        Áp dụng bộ lọc
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  ChevronUpDownIcon,
  CheckIcon
} from '@heroicons/vue/24/outline'

// Props
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

// Emits
const emit = defineEmits(['update', 'clear', 'toggle'])

// Local filters state
const localFilters = ref({ ...props.filters })

// Availability filter helper
const availabilityFilter = computed({
  get: () => localFilters.value.isAvailable,
  set: (value) => {
    localFilters.value.isAvailable = value
  }
})

// Computed
const selectedWarehouse = computed(() => {
  return props.warehouses.find(w => w.id === localFilters.value.warehouseId)
})

const hasActiveFilters = computed(() => {
  const defaultFilters = {
    keywords: '',
    warehouseId: null,
    isAvailable: null,
    minCapacity: null,
    maxCapacity: null,
    sortField: 'createdDate',
    sortType: 'desc'
  }
  
  return Object.keys(defaultFilters).some(key => {
    const current = localFilters.value[key]
    const defaultValue = defaultFilters[key]
    
    if (key === 'keywords') {
      return current !== '' && current !== defaultValue
    }
    
    return current !== defaultValue
  })
})

// Methods
const applyFilters = () => {
  emit('update', { ...localFilters.value })
}

const clearFilters = () => {
  localFilters.value = {
    keywords: '',
    warehouseId: null,
    isAvailable: null,
    minCapacity: null,
    maxCapacity: null,
    sortField: 'createdDate',
    sortType: 'desc'
  }
  emit('clear')
}

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters }
}, { deep: true })

// Auto-apply search keywords with debounce
let searchTimeout = null
watch(() => localFilters.value.keywords, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    applyFilters()
  }, 500)
})
</script>
