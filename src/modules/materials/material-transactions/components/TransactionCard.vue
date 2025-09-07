<template>
  <div class="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 p-4 sm:p-6">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex items-center space-x-3">
        <div :class="[
          'w-10 h-10 rounded-lg flex items-center justify-center',
          typeConfig.bg
        ]">
          <component
            :is="typeIconComponent"
            :class="['w-5 h-5', typeConfig.icon]"
          />
        </div>
        <div class="min-w-0 flex-1">
          <h3 class="text-sm font-semibold text-gray-900 truncate">
            Giao dịch #{{ transaction.id }}
          </h3>
          <p class="text-xs text-gray-500 mt-1">
            {{ formatDate(transaction.transactionDate) }}
          </p>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center space-x-2">
        <button
          @click="$emit('view', transaction)"
          class="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          title="Xem chi tiết"
        >
          <EyeIcon class="w-4 h-4" />
        </button>
        
        <button
          v-if="canEdit"
          @click="$emit('edit', transaction)"
          class="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
          title="Chỉnh sửa"
        >
          <PencilIcon class="w-4 h-4" />
        </button>
        
        <button
          v-if="canDelete"
          @click="$emit('delete', transaction)"
          class="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
          title="Xóa"
        >
          <TrashIcon class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="space-y-3">
      <!-- Type and Status -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <TransactionTypeBadge :type="transaction.transactionType" />
        <StatusBadge :status="transaction.status" />
      </div>

      <!-- Material Info -->
      <div class="bg-gray-50 rounded-lg p-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p class="text-xs text-gray-500">Vật liệu</p>
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ transaction.materialBatch?.material?.name || 'N/A' }}
            </p>
          </div>
          <div>
            <p class="text-xs text-gray-500">Lô hàng</p>
            <p class="text-sm font-medium text-gray-900 truncate">
              {{ transaction.materialBatch?.batchNumber || 'N/A' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Quantity and Warehouse -->
      <div class="grid grid-cols-2 gap-4">
        <div>
          <p class="text-xs text-gray-500">Số lượng</p>
          <p class="text-sm font-semibold text-gray-900">
            {{ formatNumber(transaction.quantity) }}
            <span class="text-xs text-gray-500 ml-1">
              {{ transaction.materialBatch?.material?.unit || '' }}
            </span>
          </p>
        </div>
        <div>
          <p class="text-xs text-gray-500">Kho</p>
          <p class="text-sm font-medium text-gray-900 truncate">
            {{ transaction.warehouse?.name || 'N/A' }}
          </p>
        </div>
      </div>

      <!-- Description (if exists) -->
      <div v-if="transaction.description" class="border-t pt-3">
        <p class="text-xs text-gray-500 mb-1">Ghi chú</p>
        <p class="text-sm text-gray-700 line-clamp-2">
          {{ transaction.description }}
        </p>
      </div>

      <!-- Creator and Approver -->
      <div class="border-t pt-3">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span class="text-gray-500">Người tạo:</span>
            <span class="text-gray-900 font-medium ml-1">
              {{ transaction.createdBy?.fullName || 'N/A' }}
            </span>
          </div>
          <div v-if="transaction.approvedBy">
            <span class="text-gray-500">Người duyệt:</span>
            <span class="text-gray-900 font-medium ml-1">
              {{ transaction.approvedBy?.fullName || 'N/A' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Action buttons for pending transactions -->
      <div v-if="transaction.status === 'PENDING' && canApprove" class="border-t pt-3">
        <div class="flex flex-col sm:flex-row gap-2">
          <button
            @click="$emit('approve', transaction)"
            class="flex-1 px-3 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
          >
            <CheckIcon class="w-4 h-4 inline mr-1" />
            Phê duyệt
          </button>
          <button
            @click="$emit('reject', transaction)"
            class="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
          >
            <XMarkIcon class="w-4 h-4 inline mr-1" />
            Từ chối
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TransactionTypeBadge from './TransactionTypeBadge.vue'
import StatusBadge from './StatusBadge.vue'
import {
  TRANSACTION_TYPE_COLORS,
  TRANSACTION_TYPE_ICONS,
  TRANSACTION_TYPES
} from '../constants/transaction-types'

// Hero Icons
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  transaction: {
    type: Object,
    required: true
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  canDelete: {
    type: Boolean,
    default: false
  },
  canApprove: {
    type: Boolean,
    default: false
  }
})

defineEmits(['view', 'edit', 'delete', 'approve', 'reject'])

const iconComponents = {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
}

const typeConfig = computed(() => {
  return TRANSACTION_TYPE_COLORS[props.transaction.transactionType] || 
         TRANSACTION_TYPE_COLORS[TRANSACTION_TYPES.IMPORT]
})

const typeIconComponent = computed(() => {
  const iconName = TRANSACTION_TYPE_ICONS[props.transaction.transactionType]
  return iconComponents[iconName] || ArrowDownOnSquareIcon
})

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return dateString
  }
}

const formatNumber = (number) => {
  if (number == null) return '0'
  return new Intl.NumberFormat('vi-VN').format(number)
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
