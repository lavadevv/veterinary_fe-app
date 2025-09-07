<template>
  <TransitionRoot as="template" :show="show">
    <Dialog as="div" class="relative z-50" @close="$emit('close')">
      <TransitionChild
        as="template"
        enter="ease-out duration-300"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="ease-in duration-200"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 z-10 overflow-y-auto">
        <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <TransitionChild
            as="template"
            enter="ease-out duration-300"
            enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enter-to="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leave-from="opacity-100 translate-y-0 sm:scale-100"
            leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-4xl sm:p-6">
              <!-- Loading State -->
              <div v-if="loading || !transaction" class="flex items-center justify-center py-12">
                <div class="text-center">
                  <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p class="mt-2 text-sm text-gray-500">Đang tải...</p>
                </div>
              </div>

              <!-- Transaction Details -->
              <div v-else>
                <!-- Header -->
                <div class="flex items-start justify-between mb-6">
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
                    <div>
                      <DialogTitle class="text-lg font-semibold text-gray-900">
                        Chi tiết giao dịch #{{ transaction.id }}
                      </DialogTitle>
                      <p class="text-sm text-gray-500 mt-1">
                        {{ formatDate(transaction.transactionDate) }}
                      </p>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    class="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    @click="$emit('close')"
                  >
                    <span class="sr-only">Close</span>
                    <XMarkIcon class="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                <!-- Status và Action buttons -->
                <div class="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                  <div class="flex items-center space-x-4">
                    <StatusBadge :status="transaction.status" />
                    <TransactionTypeBadge :type="transaction.transactionType" />
                  </div>
                  
                  <div class="flex space-x-2" v-if="canEdit || canApprove || canReject">
                    <button
                      v-if="canEdit"
                      type="button"
                      class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      @click="$emit('edit', transaction)"
                    >
                      <PencilSquareIcon class="h-4 w-4 mr-1" />
                      Chỉnh sửa
                    </button>
                    
                    <button
                      v-if="canApprove && transaction.status === 'PENDING'"
                      type="button"
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      @click="handleApprove"
                    >
                      <CheckIcon class="h-4 w-4 mr-1" />
                      Phê duyệt
                    </button>
                    
                    <button
                      v-if="canReject && transaction.status === 'PENDING'"
                      type="button"
                      class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      @click="showRejectModal = true"
                    >
                      <XMarkIcon class="h-4 w-4 mr-1" />
                      Từ chối
                    </button>
                  </div>
                </div>

                <!-- Transaction Information Grid -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <!-- Basic Info -->
                  <div class="space-y-4">
                    <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                      Thông tin cơ bản
                    </h3>
                    
                    <div class="space-y-3">
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Mã giao dịch</label>
                        <p class="mt-1 text-sm text-gray-900">{{ transaction.transactionCode || `#${transaction.id}` }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Loại giao dịch</label>
                        <p class="mt-1 text-sm text-gray-900">{{ typeConfig.label }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Số lượng</label>
                        <p class="mt-1 text-sm text-gray-900 font-semibold">{{ formatNumber(transaction.quantity) }} {{ transaction.materialBatch?.materialDto?.unit || 'đơn vị' }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Ngày giao dịch</label>
                        <p class="mt-1 text-sm text-gray-900">{{ formatDate(transaction.transactionDate) }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Người thực hiện</label>
                        <p class="mt-1 text-sm text-gray-900">{{ transaction.createdBy || 'N/A' }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Material & Batch Info -->
                  <div class="space-y-4">
                    <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
                      Thông tin vật liệu & lô hàng
                    </h3>
                    
                    <div class="space-y-3" v-if="transaction.materialBatch">
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Tên vật liệu</label>
                        <p class="mt-1 text-sm text-gray-900 font-medium">{{ transaction.materialBatch.materialDto?.materialName }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Mã vật liệu</label>
                        <p class="mt-1 text-sm text-gray-900">{{ transaction.materialBatch.materialDto?.materialCode }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Số lô</label>
                        <p class="mt-1 text-sm text-gray-900">{{ transaction.materialBatch.batchNumber }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Số lượng hiện tại trong lô</label>
                        <p class="mt-1 text-sm text-gray-900">{{ formatNumber(transaction.materialBatch.currentQuantity) }} {{ transaction.materialBatch.materialDto?.unit }}</p>
                      </div>
                      
                      <div>
                        <label class="block text-sm font-medium text-gray-500">Hạn sử dụng</label>
                        <p class="mt-1 text-sm text-gray-900">{{ formatDate(transaction.materialBatch.expiryDate) }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Footer Actions -->
                <div class="mt-8 flex justify-end space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    @click="$emit('close')"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </div>
    </Dialog>
  </TransitionRoot>

  <!-- Reject Modal -->
  <RejectModal
    :show="showRejectModal"
    :loading="loading"
    @confirm="handleReject"
    @cancel="showRejectModal = false"
  />
</template>

<script setup>
import { ref, computed } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import TransactionTypeBadge from './TransactionTypeBadge.vue'
import StatusBadge from './StatusBadge.vue'
import RejectModal from './RejectModal.vue'
import {
  XMarkIcon,
  CheckIcon,
  ArrowDownTrayIcon,
  ArrowUpTrayIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  transaction: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  canEdit: {
    type: Boolean,
    default: false
  },
  canApprove: {
    type: Boolean,
    default: false
  },
  canReject: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'edit', 'approve', 'reject'])

const showRejectModal = ref(false)

// Transaction type configuration
const typeConfig = computed(() => {
  if (!props.transaction) return { label: '', icon: '', bg: '', component: ArrowDownTrayIcon }
  
  const configs = {
    IMPORT: {
      label: 'Nhập kho',
      icon: 'text-green-600',
      bg: 'bg-green-100',
      component: ArrowDownTrayIcon
    },
    EXPORT: {
      label: 'Xuất kho',
      icon: 'text-red-600',
      bg: 'bg-red-100',
      component: ArrowUpTrayIcon
    },
    TRANSFER: {
      label: 'Chuyển kho',
      icon: 'text-blue-600',
      bg: 'bg-blue-100',
      component: ArrowsRightLeftIcon
    },
    ADJUSTMENT: {
      label: 'Điều chỉnh',
      icon: 'text-yellow-600',
      bg: 'bg-yellow-100',
      component: PencilSquareIcon
    }
  }
  
  return configs[props.transaction.transactionType] || configs.IMPORT
})

const typeIconComponent = computed(() => {
  return typeConfig.value.component || ArrowDownTrayIcon
})

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
  if (number == null) return '0'
  return new Intl.NumberFormat('vi-VN').format(number)
}

const handleApprove = () => {
  emit('approve', props.transaction)
}

const handleReject = (reason) => {
  showRejectModal.value = false
  emit('reject', props.transaction, reason)
}
</script>
