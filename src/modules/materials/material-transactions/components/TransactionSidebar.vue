<template>
  <div class="lg:w-80 lg:flex-shrink-0 bg-white border-r border-gray-200">
    <!-- Transaction Status Card -->
    <div class="p-6 border-b border-gray-200">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Trạng thái giao dịch</h3>
      
      <div class="flex items-center space-x-3 p-3 rounded-lg" :class="getTransactionTypeClass(transaction.transactionType)">
        <component :is="getTransactionIcon(transaction.transactionType)" class="w-5 h-5" />
        <span class="font-medium">{{ getTransactionTypeText(transaction.transactionType) }}</span>
      </div>
      
      <div class="mt-4 space-y-3">
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">ID Giao dịch:</span>
          <span class="font-medium">#{{ transaction.id }}</span>
        </div>
        <div class="flex justify-between text-sm">
          <span class="text-gray-500">Ngày tạo:</span>
          <span class="font-medium">{{ formatDate(transaction.transactionDate) }}</span>
        </div>
        <div class="flex justify-between text-sm" v-if="transaction.createdBy">
          <span class="text-gray-500">Người tạo:</span>
          <span class="font-medium">{{ transaction.createdBy }}</span>
        </div>
      </div>
    </div>

    <!-- Quick Actions (Desktop Only) -->
    <div class="hidden lg:block p-6 border-b border-gray-200">
      <h4 class="text-sm font-semibold text-gray-900 mb-3">Thao tác</h4>
      <div class="space-y-2">
        <button 
          class="w-full flex items-center px-3 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 rounded-md"
          @click="$emit('edit')"
        >
          <PencilIcon class="w-4 h-4 mr-3" />
          Chỉnh sửa giao dịch
        </button>
        <button 
          class="w-full flex items-center px-3 py-2 text-sm text-left text-red-700 hover:bg-red-50 rounded-md"
          @click="$emit('delete')"
        >
          <TrashIcon class="w-4 h-4 mr-3" />
          Xóa giao dịch
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  PencilIcon,
  TrashIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowsRightLeftIcon,
  AdjustmentsHorizontalIcon,
  DocumentIcon
} from '@heroicons/vue/24/outline'

defineProps({
  transaction: {
    type: Object,
    required: true
  }
})

defineEmits(['edit', 'delete'])

// Utility functions
const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getTransactionTypeText = (type) => {
  const types = {
    'NHAP_KHO': 'Nhập kho',
    'XUAT_KHO': 'Xuất kho',
    'CHUYEN_KHO': 'Chuyển kho',
    'DIEU_CHINH': 'Điều chỉnh',
    'IN': 'Nhập kho',
    'OUT': 'Xuất kho',
    'TRANSFER': 'Chuyển kho',
    'ADJUST': 'Điều chỉnh'
  }
  return types[type] || type
}

const getTransactionTypeClass = (type) => {
  const classes = {
    'NHAP_KHO': 'bg-green-100 text-green-800',
    'XUAT_KHO': 'bg-red-100 text-red-800',
    'CHUYEN_KHO': 'bg-blue-100 text-blue-800',
    'DIEU_CHINH': 'bg-yellow-100 text-yellow-800',
    'IN': 'bg-green-100 text-green-800',
    'OUT': 'bg-red-100 text-red-800',
    'TRANSFER': 'bg-blue-100 text-blue-800',
    'ADJUST': 'bg-yellow-100 text-yellow-800'
  }
  return classes[type] || 'bg-gray-100 text-gray-800'
}

const getTransactionIcon = (type) => {
  const icons = {
    'NHAP_KHO': ArrowDownIcon,
    'XUAT_KHO': ArrowUpIcon,
    'CHUYEN_KHO': ArrowsRightLeftIcon,
    'DIEU_CHINH': AdjustmentsHorizontalIcon,
    'IN': ArrowDownIcon,
    'OUT': ArrowUpIcon,
    'TRANSFER': ArrowsRightLeftIcon,
    'ADJUST': AdjustmentsHorizontalIcon
  }
  return icons[type] || DocumentIcon
}
</script>
