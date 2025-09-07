<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-sm font-medium text-gray-900">Thống kê theo loại giao dịch</h3>
      <button class="text-xs text-gray-500 hover:text-gray-700">
        Xem chi tiết
      </button>
    </div>

    <div class="space-y-3">
      <div
        v-for="(count, type) in transactionsByType"
        :key="type"
        class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
      >
        <div class="flex items-center space-x-3">
          <div :class="[
            'w-8 h-8 rounded-lg flex items-center justify-center',
            getTypeConfig(type).bg
          ]">
            <component
              :is="getTypeIcon(type)"
              :class="['w-4 h-4', getTypeConfig(type).icon]"
            />
          </div>
          <div>
            <p class="text-sm font-medium text-gray-900">
              {{ getTypeLabel(type) }}
            </p>
            <p class="text-xs text-gray-500">
              Loại giao dịch {{ type.toLowerCase() }}
            </p>
          </div>
        </div>
        
        <div class="text-right">
          <p class="text-lg font-bold text-gray-900">{{ count }}</p>
          <p class="text-xs text-gray-500">giao dịch</p>
        </div>
      </div>
      
      <!-- Empty state -->
      <div v-if="Object.keys(transactionsByType).length === 0" class="text-center py-8">
        <div class="w-12 h-12 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
          <ChartBarIcon class="w-6 h-6 text-gray-400" />
        </div>
        <p class="text-sm text-gray-500">Chưa có dữ liệu thống kê</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_TYPE_COLORS,
  TRANSACTION_TYPE_ICONS
} from '../constants/transaction-types'

// Hero Icons
import {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon,
  ChartBarIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  transactionsByType: {
    type: Object,
    default: () => ({})
  }
})

const iconComponents = {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
}

const getTypeLabel = (type) => {
  return TRANSACTION_TYPE_LABELS[type] || type
}

const getTypeConfig = (type) => {
  return TRANSACTION_TYPE_COLORS[type] || TRANSACTION_TYPE_COLORS.IMPORT
}

const getTypeIcon = (type) => {
  const iconName = TRANSACTION_TYPE_ICONS[type]
  return iconComponents[iconName] || ArrowDownOnSquareIcon
}
</script>
