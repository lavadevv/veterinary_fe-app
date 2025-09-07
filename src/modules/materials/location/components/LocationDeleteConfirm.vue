<!-- LocationDeleteConfirm.vue - Component xác nhận xóa location -->
<template>
  <div class="text-center space-y-6">
    <!-- Warning Icon -->
    <div class="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-red-100">
      <ExclamationTriangleIcon class="w-8 h-8 text-red-600" />
    </div>

    <!-- Content -->
    <div class="space-y-3">
      <h3 class="text-lg font-semibold text-gray-900">
        Xác nhận xóa vị trí kho
      </h3>
      
      <div class="space-y-2">
        <p class="text-sm text-gray-600">
          Bạn có chắc chắn muốn xóa vị trí kho sau?
        </p>
        
        <div class="bg-gray-50 rounded-lg p-4 text-left">
          <div class="space-y-2">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Mã vị trí:</span>
              <span class="text-sm text-gray-900 font-mono">{{ location.locationCode }}</span>
            </div>
            
            <div v-if="location.warehouse" class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Kho:</span>
              <span class="text-sm text-gray-900">{{ location.warehouse.warehouseName }}</span>
            </div>
            
            <div v-if="location.positionDetail" class="flex items-start justify-between">
              <span class="text-sm font-medium text-gray-700">Chi tiết:</span>
              <span class="text-sm text-gray-900 text-right max-w-48 line-clamp-2">{{ location.positionDetail }}</span>
            </div>
            
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-gray-700">Sức chứa:</span>
              <span class="text-sm text-gray-900">{{ formatCapacity(location.currentCapacity) }} / {{ formatCapacity(location.maxCapacity) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Warnings -->
      <div class="space-y-3">
        <!-- Capacity Warning -->
        <div v-if="location.currentCapacity > 0" class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <div class="flex items-start">
            <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
            <div class="text-left">
              <p class="text-sm font-medium text-yellow-800">Cảnh báo</p>
              <p class="text-sm text-yellow-700">
                Vị trí này đang chứa {{ formatCapacity(location.currentCapacity) }} đơn vị. 
                Vui lòng di chuyển hàng hóa trước khi xóa.
              </p>
            </div>
          </div>
        </div>

        <!-- Data Loss Warning -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-3">
          <div class="flex items-start">
            <ExclamationCircleIcon class="w-5 h-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
            <div class="text-left">
              <p class="text-sm font-medium text-red-800">Lưu ý quan trọng</p>
              <p class="text-sm text-red-700">
                Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến vị trí này sẽ bị xóa vĩnh viễn.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col sm:flex-row gap-3 pt-4">
      <button
        @click="emit('confirm')"
        :disabled="loading"
        :class="[
          'flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg transition-all duration-200',
          loading
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
        ]"
      >
        <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <TrashIcon v-else class="w-4 h-4 mr-2" />
        {{ loading ? 'Đang xóa...' : 'Xác nhận xóa' }}
      </button>

      <button
        @click="emit('cancel')"
        :disabled="loading"
        class="flex-1 inline-flex items-center justify-center px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Hủy bỏ
      </button>
    </div>

    <!-- Additional Info -->
    <div class="text-xs text-gray-500 text-left">
      <p>Nếu bạn chỉ muốn tạm dừng sử dụng vị trí này, hãy chỉnh sửa và bỏ tick "Vị trí khả dụng" thay vì xóa.</p>
    </div>
  </div>
</template>

<script setup>
import {
  ExclamationTriangleIcon,
  ExclamationCircleIcon,
  TrashIcon
} from '@heroicons/vue/24/outline'

// Props
const props = defineProps({
  location: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['confirm', 'cancel'])

// Methods
const formatCapacity = (capacity) => {
  if (!capacity) return '0'
  if (capacity >= 1000) {
    return (capacity / 1000).toFixed(1) + 'K'
  }
  return capacity.toString()
}
</script>
