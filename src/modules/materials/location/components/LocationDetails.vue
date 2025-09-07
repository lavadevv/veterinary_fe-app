<!-- LocationDetails.vue - Component hiển thị chi tiết location -->
<template>
  <div class="space-y-6">
    <!-- Location Header -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
      <div class="flex items-start justify-between">
        <div class="flex-1">
          <div class="flex items-center space-x-3 mb-3">
            <h2 class="text-2xl font-bold text-gray-900">{{ location.locationCode }}</h2>
            <LocationStatusBadge :status="location.isAvailable" size="md" />
          </div>
          
          <p v-if="location.positionDetail" class="text-gray-700 mb-4">
            {{ location.positionDetail }}
          </p>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div v-if="location.warehouse" class="flex items-center space-x-2">
              <BuildingStorefrontIcon class="w-5 h-5 text-gray-400" />
              <div>
                <p class="text-sm text-gray-600">Kho</p>
                <p class="font-medium text-gray-900">{{ location.warehouse.warehouseName }}</p>
              </div>
            </div>

            <div v-if="location.shelf" class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 7v10c0 2.21 3.79 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.79 4 8 4s8-1.79 8-4M4 7c0-2.21 3.79-4 8-4s8 1.79 8 4" />
              </svg>
              <div>
                <p class="text-sm text-gray-600">Kệ</p>
                <p class="font-medium text-gray-900">{{ location.shelf }}</p>
              </div>
            </div>

            <div v-if="location.floor" class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div>
                <p class="text-sm text-gray-600">Tầng</p>
                <p class="font-medium text-gray-900">{{ location.floor }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Capacity Information -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <ChartBarIcon class="w-5 h-5 mr-2 text-blue-600" />
        Thông tin sức chứa
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Capacity Stats -->
        <div class="space-y-4">
          <div class="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span class="text-sm font-medium text-gray-600">Sức chứa tối đa</span>
            <span class="text-lg font-bold text-gray-900">{{ formatCapacity(location.maxCapacity) }}</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
            <span class="text-sm font-medium text-blue-600">Đang sử dụng</span>
            <span class="text-lg font-bold text-blue-700">{{ formatCapacity(location.currentCapacity) }}</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-green-50 rounded-lg">
            <span class="text-sm font-medium text-green-600">Còn trống</span>
            <span class="text-lg font-bold text-green-700">{{ formatCapacity(remainingCapacity) }}</span>
          </div>

          <div class="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
            <span class="text-sm font-medium text-purple-600">Tỷ lệ sử dụng</span>
            <span class="text-lg font-bold text-purple-700">{{ utilizationRate.toFixed(1) }}%</span>
          </div>
        </div>

        <!-- Capacity Visual -->
        <div class="space-y-4">
          <!-- Circular Progress -->
          <div class="relative w-48 h-48 mx-auto">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
                class="text-gray-200"
              />
              <!-- Progress circle -->
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                stroke-width="8"
                fill="none"
                :stroke-dasharray="circumference"
                :stroke-dashoffset="progressOffset"
                :class="progressColor"
                class="transition-all duration-1000 ease-out"
                stroke-linecap="round"
              />
            </svg>
            
            <!-- Center text -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="text-2xl font-bold text-gray-900">{{ utilizationRate.toFixed(0) }}%</div>
                <div class="text-sm text-gray-600">Đã sử dụng</div>
              </div>
            </div>
          </div>

          <!-- Status indicator -->
          <div class="text-center">
            <div
              :class="[
                'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                capacityStatusClass
              ]"
            >
              <div :class="['w-2 h-2 rounded-full mr-2', capacityDotClass]"></div>
              {{ capacityStatusText }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Metadata -->
    <div class="bg-white rounded-xl border border-gray-200 p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <InformationCircleIcon class="w-5 h-5 mr-2 text-gray-600" />
        Thông tin khác
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-3">
          <div v-if="location.createdDate" class="flex justify-between">
            <span class="text-sm text-gray-600">Ngày tạo</span>
            <span class="text-sm font-medium text-gray-900">{{ formatDateTime(location.createdDate) }}</span>
          </div>

          <div v-if="location.lastModifiedDate" class="flex justify-between">
            <span class="text-sm text-gray-600">Cập nhật lần cuối</span>
            <span class="text-sm font-medium text-gray-900">{{ formatDateTime(location.lastModifiedDate) }}</span>
          </div>

          <div v-if="location.createdBy" class="flex justify-between">
            <span class="text-sm text-gray-600">Người tạo</span>
            <span class="text-sm font-medium text-gray-900">{{ location.createdBy }}</span>
          </div>
        </div>

        <div class="space-y-3">
          <div class="flex justify-between">
            <span class="text-sm text-gray-600">ID</span>
            <span class="text-sm font-medium text-gray-900 font-mono">{{ location.id }}</span>
          </div>

          <div v-if="location.warehouse?.id" class="flex justify-between">
            <span class="text-sm text-gray-600">ID Kho</span>
            <span class="text-sm font-medium text-gray-900 font-mono">{{ location.warehouse.id }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
      <button
        v-if="canEdit"
        @click="emit('edit')"
        class="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
      >
        <PencilIcon class="w-4 h-4 mr-2" />
        Chỉnh sửa
      </button>

      <button
        v-if="canDelete"
        @click="emit('delete')"
        class="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors duration-200"
      >
        <TrashIcon class="w-4 h-4 mr-2" />
        Xóa
      </button>

      <button
        @click="emit('close')"
        class="flex-1 sm:flex-none inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200"
      >
        Đóng
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  BuildingStorefrontIcon,
  ChartBarIcon,
  InformationCircleIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'
import LocationStatusBadge from './LocationStatusBadge.vue'

// Props
const props = defineProps({
  location: {
    type: Object,
    required: true
  },
  canEdit: {
    type: Boolean,
    default: true
  },
  canDelete: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['edit', 'delete', 'close'])

// Computed
const remainingCapacity = computed(() => {
  return props.location.maxCapacity - props.location.currentCapacity
})

const utilizationRate = computed(() => {
  if (!props.location.maxCapacity || props.location.maxCapacity === 0) return 0
  return (props.location.currentCapacity / props.location.maxCapacity) * 100
})

const circumference = computed(() => 2 * Math.PI * 40) // radius = 40

const progressOffset = computed(() => {
  const progress = utilizationRate.value / 100
  return circumference.value - (progress * circumference.value)
})

const progressColor = computed(() => {
  const rate = utilizationRate.value
  if (rate >= 90) return 'text-red-500'
  if (rate >= 75) return 'text-yellow-500'
  if (rate >= 50) return 'text-blue-500'
  return 'text-green-500'
})

const capacityStatusClass = computed(() => {
  const rate = utilizationRate.value
  if (rate >= 90) return 'bg-red-100 text-red-800'
  if (rate >= 75) return 'bg-yellow-100 text-yellow-800'
  if (rate >= 50) return 'bg-blue-100 text-blue-800'
  return 'bg-green-100 text-green-800'
})

const capacityDotClass = computed(() => {
  const rate = utilizationRate.value
  if (rate >= 90) return 'bg-red-500'
  if (rate >= 75) return 'bg-yellow-500'
  if (rate >= 50) return 'bg-blue-500'
  return 'bg-green-500'
})

const capacityStatusText = computed(() => {
  const rate = utilizationRate.value
  if (rate >= 90) return 'Gần đầy'
  if (rate >= 75) return 'Cao'
  if (rate >= 50) return 'Trung bình'
  return 'Thấp'
})

// Methods
const formatCapacity = (capacity) => {
  if (!capacity) return '0'
  if (capacity >= 1000) {
    return (capacity / 1000).toFixed(1) + 'K'
  }
  return capacity.toString()
}

const formatDateTime = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>
