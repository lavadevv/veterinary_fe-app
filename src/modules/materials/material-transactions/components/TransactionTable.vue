<template>
  <div class="overflow-hidden bg-white shadow-sm rounded-lg border border-gray-200">
    <div class="px-4 py-5 sm:p-6">
      <div class="sm:flex sm:items-center">
        <div class="sm:flex-auto">
          <h3 class="text-base font-semibold leading-6 text-gray-900">
            Danh sách giao dịch
          </h3>
          <p class="mt-2 text-sm text-gray-700">
            Danh sách tất cả các giao dịch vật liệu trong hệ thống
          </p>
        </div>
      </div>
      
      <div class="mt-6 flow-root">
        <div class="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <!-- Loading State -->
            <div v-if="loading" class="text-center py-12">
              <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-emerald-500 transition ease-in-out duration-150">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tải...
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="!transactions || transactions.length === 0" class="text-center py-12">
              <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <DocumentIcon class="w-8 h-8 text-gray-400" />
              </div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">Không có giao dịch nào</h3>
              <p class="text-gray-500 max-w-sm mx-auto">
                Chưa có giao dịch nào được tạo hoặc không có giao dịch nào khớp với bộ lọc.
              </p>
            </div>

            <!-- Table -->
            <table v-else class="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Giao dịch
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden sm:table-cell">
                    Vật liệu
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Số lượng
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden lg:table-cell">
                    Kho
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Trạng thái
                  </th>
                  <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 hidden md:table-cell">
                    Ngày
                  </th>
                  <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span class="sr-only">Hành động</span>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr
                  v-for="transaction in transactions"
                  :key="transaction.id"
                  class="hover:bg-gray-50 transition-colors"
                >
                  <!-- Transaction Info -->
                  <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-0">
                    <div class="flex items-center">
                      <div :class="[
                        'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
                        getTypeConfig(transaction.transactionType).bg
                      ]">
                        <component
                          :is="getTypeIcon(transaction.transactionType)"
                          :class="['w-4 h-4', getTypeConfig(transaction.transactionType).icon]"
                        />
                      </div>
                      <div class="ml-3">
                        <div class="font-medium text-gray-900">#{{ transaction.id }}</div>
                        <div class="text-gray-500 text-xs">
                          <TransactionTypeBadge :type="transaction.transactionType" />
                        </div>
                      </div>
                    </div>
                  </td>

                  <!-- Material -->
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell">
                    <div>
                      <div class="font-medium text-gray-900">
                        {{ transaction.materialBatch?.material?.name || 'N/A' }}
                      </div>
                      <div class="text-gray-500 text-xs">
                        Lô: {{ transaction.materialBatch?.batchNumber || 'N/A' }}
                      </div>
                    </div>
                  </td>

                  <!-- Quantity -->
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <div class="font-semibold text-gray-900">
                      {{ formatNumber(transaction.quantity) }}
                    </div>
                    <div class="text-gray-500 text-xs">
                      {{ transaction.materialBatch?.material?.unit || '' }}
                    </div>
                  </td>

                  <!-- Warehouse -->
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell">
                    <div class="font-medium text-gray-900">
                      {{ transaction.warehouse?.name || 'N/A' }}
                    </div>
                    <div v-if="transaction.destinationWarehouse" class="text-xs text-gray-500">
                      → {{ transaction.destinationWarehouse.name }}
                    </div>
                  </td>

                  <!-- Status -->
                  <td class="whitespace-nowrap px-3 py-4 text-sm">
                    <StatusBadge :status="transaction.status" />
                  </td>

                  <!-- Date -->
                  <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden md:table-cell">
                    <div class="font-medium">
                      {{ formatDate(transaction.transactionDate) }}
                    </div>
                    <div class="text-xs text-gray-400">
                      {{ formatTime(transaction.transactionDate) }}
                    </div>
                  </td>

                  <!-- Actions -->
                  <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                    <div class="flex items-center justify-end space-x-2">
                      <button
                        @click="$emit('view', transaction)"
                        class="text-emerald-600 hover:text-emerald-900 p-1 rounded-lg hover:bg-emerald-50 transition-colors"
                        title="Xem chi tiết"
                      >
                        <EyeIcon class="w-4 h-4" />
                      </button>
                      
                      <button
                        v-if="canEdit(transaction)"
                        @click="$emit('edit', transaction)"
                        class="text-blue-600 hover:text-blue-900 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                        title="Chỉnh sửa"
                      >
                        <PencilIcon class="w-4 h-4" />
                      </button>
                      
                      <button
                        v-if="canDelete(transaction)"
                        @click="$emit('delete', transaction)"
                        class="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
                        title="Xóa"
                      >
                        <TrashIcon class="w-4 h-4" />
                      </button>

                      <!-- Quick Actions for Pending -->
                      <div v-if="transaction.status === 'PENDING' && canApprove(transaction)" class="flex space-x-1">
                        <button
                          @click="$emit('approve', transaction)"
                          class="text-green-600 hover:text-green-900 p-1 rounded-lg hover:bg-green-50 transition-colors"
                          title="Phê duyệt"
                        >
                          <CheckIcon class="w-4 h-4" />
                        </button>
                        
                        <button
                          @click="$emit('reject', transaction)"
                          class="text-red-600 hover:text-red-900 p-1 rounded-lg hover:bg-red-50 transition-colors"
                          title="Từ chối"
                        >
                          <XMarkIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
  TRANSACTION_TYPE_ICONS
} from '../constants/transaction-types'

// Hero Icons
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  DocumentIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  transactions: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  currentUser: {
    type: Object,
    default: () => null
  }
})

defineEmits(['view', 'edit', 'delete', 'approve', 'reject'])

const iconComponents = {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
}

// Methods
const getTypeConfig = (type) => {
  return TRANSACTION_TYPE_COLORS[type] || TRANSACTION_TYPE_COLORS.IMPORT
}

const getTypeIcon = (type) => {
  const iconName = TRANSACTION_TYPE_ICONS[type]
  return iconComponents[iconName] || ArrowDownOnSquareIcon
}

const formatNumber = (number) => {
  if (number == null) return '0'
  return new Intl.NumberFormat('vi-VN').format(number)
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  try {
    return new Date(dateString).toLocaleDateString('vi-VN')
  } catch {
    return dateString
  }
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return ''
  }
}

const canEdit = (transaction) => {
  if (!props.currentUser) return false
  
  return (
    (transaction.createdBy?.id === props.currentUser.id && transaction.status === 'PENDING') ||
    ['ADMIN', 'MANAGER'].includes(props.currentUser.role)
  )
}

const canDelete = (transaction) => {
  if (!props.currentUser) return false
  
  return (
    (transaction.createdBy?.id === props.currentUser.id && transaction.status === 'PENDING') ||
    props.currentUser.role === 'ADMIN'
  )
}

const canApprove = (transaction) => {
  if (!props.currentUser) return false
  
  return (
    ['ADMIN', 'MANAGER'].includes(props.currentUser.role) &&
    transaction.status === 'PENDING' &&
    transaction.createdBy?.id !== props.currentUser.id
  )
}
</script>
