<template>
  <div class="bg-white rounded-xl shadow-sm border border-emerald-100 h-full flex flex-col">
    <!-- Header -->
    <div class="p-6 border-b border-gray-200">
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center">
          <ChartBarIcon class="w-5 h-5 mr-2 text-emerald-500" />
          Vật liệu hàng đầu
        </h3>
        
        <Listbox v-model="selectedPeriod" @update:modelValue="handlePeriodChange">
          <div class="relative">
            <ListboxButton class="relative cursor-default rounded-lg bg-white py-1 pl-3 pr-8 text-left text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500">
              <span class="block truncate">{{ selectedPeriod.label }}</span>
              <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon class="h-4 w-4 text-gray-400" />
              </span>
            </ListboxButton>
            <transition
              leave-active-class="transition duration-100 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="opacity-0"
            >
              <ListboxOptions class="absolute right-0 z-10 mt-1 max-h-60 w-32 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <ListboxOption
                  v-slot="{ active, selected }"
                  v-for="period in periods"
                  :key="period.value"
                  :value="period"
                  as="template"
                >
                  <li :class="[active ? 'bg-emerald-100 text-emerald-900' : 'text-gray-900', 'relative cursor-default select-none py-2 pl-8 pr-4']">
                    <span :class="[selected ? 'font-medium' : 'font-normal', 'block truncate']">
                      {{ period.label }}
                    </span>
                    <span v-if="selected" class="absolute inset-y-0 left-0 flex items-center pl-2 text-emerald-600">
                      <CheckIcon class="h-4 w-4" />
                    </span>
                  </li>
                </ListboxOption>
              </ListboxOptions>
            </transition>
          </div>
        </Listbox>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 p-6">
      <!-- Loading State -->
      <div v-if="loading" class="space-y-3">
        <div v-for="i in 5" :key="i" class="animate-pulse">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 bg-gray-200 rounded-lg"></div>
            <div class="flex-1 space-y-2">
              <div class="h-3 bg-gray-200 rounded w-3/4"></div>
              <div class="h-2 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div class="w-16 h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <!-- Materials List -->
      <div v-else-if="materials.length > 0" class="space-y-3">
        <div 
          v-for="(material, index) in materials" 
          :key="material.id"
          class="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
        >
          <!-- Rank -->
          <div class="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
               :class="getRankClass(index)">
            {{ index + 1 }}
          </div>
          
          <!-- Material Icon -->
          <div class="flex-shrink-0">
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
              <CubeIcon class="w-5 h-5 text-white" />
            </div>
          </div>
          
          <!-- Material Info -->
          <div class="flex-1 min-w-0">
            <h4 class="text-sm font-medium text-gray-900 truncate">{{ material.name }}</h4>
            <p class="text-xs text-gray-500">{{ material.category }}</p>
          </div>
          
          <!-- Usage Stats -->
          <div class="text-right">
            <p class="text-sm font-semibold text-gray-900">{{ formatNumber(material.usage) }}</p>
            <p class="text-xs text-gray-500">{{ material.unit }}</p>
          </div>
          
          <!-- Actions -->
          <div class="flex space-x-1">
            <button
              @click="$emit('view-material', material)"
              class="p-1 text-gray-400 hover:text-emerald-600 focus:outline-none focus:text-emerald-600"
            >
              <EyeIcon class="w-4 h-4" />
            </button>
            <button
              @click="$emit('manage-material', material)"
              class="p-1 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <CogIcon class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <!-- No Data -->
      <div v-else class="flex flex-col items-center justify-center h-40">
        <CubeIcon class="w-12 h-12 text-gray-300 mb-2" />
        <p class="text-gray-500 text-sm">Không có dữ liệu vật liệu</p>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="materials.length > 0" class="p-4 border-t border-gray-200">
      <button
        @click="$emit('view-all')"
        class="w-full text-center text-sm text-emerald-600 hover:text-emerald-700 font-medium flex items-center justify-center"
      >
        Xem tất cả vật liệu
        <ArrowRightIcon class="w-3 h-3 ml-1" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import {
  ChartBarIcon,
  ChevronUpDownIcon,
  CheckIcon,
  CubeIcon,
  EyeIcon,
  CogIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  materials: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['view-material', 'manage-material', 'view-all', 'period-change'])

// Reactive data
const periods = [
  { value: '7d', label: '7 ngày' },
  { value: '30d', label: '30 ngày' },
  { value: '90d', label: '90 ngày' },
  { value: '1y', label: '1 năm' }
]

const selectedPeriod = ref(periods[1]) // Default to 30 days

// Methods
const getRankClass = (index) => {
  if (index === 0) return 'bg-yellow-100 text-yellow-800' // Gold
  if (index === 1) return 'bg-gray-100 text-gray-800'     // Silver
  if (index === 2) return 'bg-orange-100 text-orange-800' // Bronze
  return 'bg-blue-100 text-blue-800'                      // Others
}

const formatNumber = (num) => {
  if (!num && num !== 0) return '0'
  return num.toLocaleString('vi-VN')
}

const handlePeriodChange = (period) => {
  selectedPeriod.value = period
  emit('period-change', period.value)
}
</script>
