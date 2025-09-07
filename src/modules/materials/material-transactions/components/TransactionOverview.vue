<template>
  <div class="bg-white rounded-lg shadow">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-900">Thông tin chung</h2>
    </div>
    
    <div class="p-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Loại giao dịch</label>
          <div class="flex items-center space-x-2">
            <component :is="getTransactionIcon(transaction.transactionType)" class="w-4 h-4 text-gray-400" />
            <span class="text-sm font-medium text-gray-900">{{ getTransactionTypeText(transaction.transactionType) }}</span>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Số lượng</label>
          <span class="text-sm font-medium text-gray-900">
            {{ formatNumber(transaction.quantity) }} {{ transaction.materialBatchDto?.materialDto?.unitOfMeasure || '' }}
          </span>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">Ngày giao dịch</label>
          <span class="text-sm font-medium text-gray-900">{{ formatDate(transaction.transactionDate) }}</span>
        </div>
        
        <div v-if="transaction.referenceNumber">
          <label class="block text-sm font-medium text-gray-500 mb-1">Số tham chiếu</label>
          <span class="text-sm font-medium text-gray-900">{{ transaction.referenceNumber }}</span>
        </div>
        
        <div v-if="transaction.unitPrice">
          <label class="block text-sm font-medium text-gray-500 mb-1">Đơn giá</label>
          <span class="text-sm font-medium text-gray-900">{{ formatCurrency(transaction.unitPrice) }}</span>
        </div>
        
        <div v-if="transaction.totalValue">
          <label class="block text-sm font-medium text-gray-500 mb-1">Tổng giá trị</label>
          <span class="text-sm font-medium text-gray-900">{{ formatCurrency(transaction.totalValue) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
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

const formatNumber = (number) => {
  if (number === null || number === undefined) return 'N/A'
  return new Intl.NumberFormat('vi-VN').format(number)
}

const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return 'N/A'
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount)
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
