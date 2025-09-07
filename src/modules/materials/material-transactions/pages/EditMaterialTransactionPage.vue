<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="max-w-6xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
      <!-- Loading State -->
      <div v-if="loading && !transaction" class="text-center py-12">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-emerald-500 transition ease-in-out duration-150">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Đang tải thông tin giao dịch...
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <ExclamationTriangleIcon class="w-8 h-8 text-red-600" />
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Không thể tải thông tin giao dịch</h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <div class="flex justify-center space-x-3">
          <button
            @click="loadTransaction"
            class="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
          >
            Thử lại
          </button>
          <router-link
            to="/materials/transactions"
            class="px-4 py-2 bg-gray-600 text-white text-sm font-medium rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            Quay lại danh sách
          </router-link>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-else-if="transaction">
        <!-- Header -->
        <div class="mb-6 sm:mb-8">
          <div class="flex items-center space-x-3 mb-4">
            <button
              @click="$router.go(-1)"
              class="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon class="w-5 h-5" />
            </button>
            
            <div :class="[
              'w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg',
              typeConfig.bg
            ]">
              <component
                :is="typeIconComponent"
                :class="['w-4 h-4 sm:w-5 sm:h-5', typeConfig.icon]"
              />
            </div>
            
            <div>
              <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                Chỉnh sửa giao dịch #{{ transaction.id }}
              </h1>
              <div class="flex items-center space-x-3 mt-1">
                <TransactionTypeBadge :type="transaction.transactionType" />
                <StatusBadge :status="transaction.status" />
              </div>
            </div>
          </div>

          <!-- Permission Check -->
          <div v-if="!canEdit" class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <ExclamationTriangleIcon class="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 class="text-sm font-medium text-yellow-800">Không thể chỉnh sửa</h3>
                <p class="text-sm text-yellow-700 mt-1">
                  Bạn không có quyền chỉnh sửa giao dịch này hoặc giao dịch đã được phê duyệt.
                </p>
                <div class="mt-3">
                  <router-link
                    :to="`/materials/transactions/${transaction.id}`"
                    class="text-sm font-medium text-yellow-800 underline hover:text-yellow-900"
                  >
                    Xem chi tiết giao dịch
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Progress Steps -->
          <div v-else class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <span class="text-sm font-medium text-emerald-600">Chỉnh sửa thông tin</span>
                </div>
                
                <div class="w-16 h-0.5 bg-gray-300"></div>
                
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <span class="text-sm text-gray-500">Xác nhận</span>
                </div>
                
                <div class="w-16 h-0.5 bg-gray-300"></div>
                
                <div class="flex items-center space-x-2">
                  <div class="w-8 h-8 bg-gray-300 text-gray-600 rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <span class="text-sm text-gray-500">Hoàn thành</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Form -->
        <div v-if="canEdit" class="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div class="p-6">
            <TransactionForm
              :transaction="transaction"
              :material-batches="materialBatches"
              :warehouses="warehouses"
              :loading="transactionStore.loading"
              @submit="handleFormSubmit"
              @cancel="handleCancel"
            />
          </div>
        </div>

        <!-- Edit Restrictions Info -->
        <div v-if="canEdit && transaction.status !== 'PENDING'" class="mt-6 bg-amber-50 rounded-lg border border-amber-200 p-4">
          <div class="flex items-start space-x-3">
            <InformationCircleIcon class="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h3 class="text-sm font-medium text-amber-800 mb-2">Lưu ý khi chỉnh sửa</h3>
              <div class="text-sm text-amber-700 space-y-1">
                <p>• Chỉ có thể chỉnh sửa giao dịch ở trạng thái "Chờ duyệt"</p>
                <p>• Giao dịch đã được phê duyệt hoặc từ chối sẽ không thể chỉnh sửa</p>
                <p>• Việc chỉnh sửa có thể ảnh hưởng đến số lượng tồn kho</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <TransitionRoot as="template" :show="showSuccessModal">
      <Dialog as="div" class="relative z-50" @close="showSuccessModal = false">
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div class="text-center">
                  <div class="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckIcon class="h-6 w-6 text-green-600" />
                  </div>
                  <div class="mt-3">
                    <DialogTitle as="h3" class="text-lg font-semibold leading-6 text-gray-900">
                      Cập nhật thành công!
                    </DialogTitle>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">
                        Giao dịch #{{ transaction.id }} đã được cập nhật thành công.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div class="mt-5 sm:mt-6 space-y-3">
                  <button
                    @click="viewTransaction"
                    class="inline-flex w-full justify-center rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
                  >
                    Xem giao dịch
                  </button>
                  <button
                    @click="backToList"
                    class="inline-flex w-full justify-center rounded-lg bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                  >
                    Quay lại danh sách
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { useMaterialTransactionStore } from '../store/materialTransactionStore'
import { useMaterialBatchStore } from '../../material-batches/store/materialBatchStore'
import TransactionForm from '../components/TransactionForm.vue'
import TransactionTypeBadge from '../components/TransactionTypeBadge.vue'
import StatusBadge from '../components/StatusBadge.vue'
import {
  TRANSACTION_TYPE_COLORS,
  TRANSACTION_TYPE_ICONS,
  TRANSACTION_TYPES
} from '../constants/transaction-types'

// Hero Icons
import {
  ArrowLeftIcon,
  CheckIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const transactionStore = useMaterialTransactionStore()
const materialBatchStore = useMaterialBatchStore()

// State
const showSuccessModal = ref(false)
const materialBatches = ref([])
const warehouses = ref([
  { id: 1, name: 'Kho A', address: '123 Đường ABC' },
  { id: 2, name: 'Kho B', address: '456 Đường DEF' }
])

// Mock current user - replace with actual auth
const currentUser = ref({
  id: 1,
  fullName: 'Admin User',
  role: 'ADMIN'
})

const iconComponents = {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
}

// Computed
const transaction = computed(() => transactionStore.selectedTransaction)
const loading = computed(() => transactionStore.loading)
const error = computed(() => transactionStore.error)

const typeConfig = computed(() => {
  if (!transaction.value) return TRANSACTION_TYPE_COLORS[TRANSACTION_TYPES.IMPORT]
  return TRANSACTION_TYPE_COLORS[transaction.value.transactionType] || 
         TRANSACTION_TYPE_COLORS[TRANSACTION_TYPES.IMPORT]
})

const typeIconComponent = computed(() => {
  if (!transaction.value) return ArrowDownOnSquareIcon
  const iconName = TRANSACTION_TYPE_ICONS[transaction.value.transactionType]
  return iconComponents[iconName] || ArrowDownOnSquareIcon
})

const canEdit = computed(() => {
  if (!transaction.value || !currentUser.value) return false
  
  return (
    (transaction.value.createdBy?.id === currentUser.value.id && transaction.value.status === 'PENDING') ||
    ['ADMIN', 'MANAGER'].includes(currentUser.value.role)
  )
})

// Methods
const loadData = async () => {
  try {
    await Promise.all([
      loadTransaction(),
      materialBatchStore.fetchMaterialBatches()
    ])
    materialBatches.value = materialBatchStore.materialBatches
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

const loadTransaction = async () => {
  const transactionId = route.params.id
  if (transactionId) {
    try {
      await transactionStore.fetchTransactionById(transactionId)
    } catch (error) {
      console.error('Error loading transaction:', error)
    }
  }
}

const handleFormSubmit = async (formData) => {
  try {
    await transactionStore.updateTransaction(transaction.value.id, formData)
    showSuccessModal.value = true
  } catch (error) {
    console.error('Error updating transaction:', error)
  }
}

const handleCancel = () => {
  router.push(`/materials/transactions/${transaction.value.id}`)
}

const viewTransaction = () => {
  showSuccessModal.value = false
  router.push(`/materials/transactions/${transaction.value.id}`)
}

const backToList = () => {
  showSuccessModal.value = false
  router.push('/materials/transactions')
}

// Lifecycle
onMounted(() => {
  loadData()
})
</script>
