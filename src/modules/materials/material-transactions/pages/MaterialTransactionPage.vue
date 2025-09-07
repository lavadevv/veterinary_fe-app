<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
    <div class="max-w-7xl mx-auto p-3 sm:p-4 lg:p-6 xl:p-8">
      <!-- Enhanced Header -->
      <div class="mb-6 sm:mb-8">
        <div class="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-start">
          <div class="flex-1 min-w-0">
            <div class="flex items-center space-x-3 mb-2">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <DocumentChartBarIcon class="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div>
                <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
                  Quản lý giao dịch vật liệu
                </h1>
                <p class="text-sm sm:text-base text-gray-600 mt-1">
                  Theo dõi và quản lý các giao dịch nhập, xuất, chuyển kho và điều chỉnh vật liệu
                </p>
              </div>
            </div>
            
            <!-- Stats Cards -->
            <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <DocumentChartBarIcon class="w-4 h-4 text-emerald-600" />
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Tổng giao dịch</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ totalTransactions }}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <ClockIcon class="w-4 h-4 text-yellow-600" />
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Chờ duyệt</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ pendingTransactions }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <CheckBadgeIcon class="w-4 h-4 text-green-600" />
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Hoàn thành</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ completedTransactions }}</p>
                  </div>
                </div>
              </div>

              <div class="bg-white rounded-lg border border-gray-200 p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ChartBarIcon class="w-4 h-4 text-blue-600" />
                  </div>
                  <div class="ml-3 min-w-0 flex-1">
                    <p class="text-xs text-gray-500 truncate">Loại giao dịch</p>
                    <p class="text-sm sm:text-base font-semibold text-gray-900">{{ Object.keys(transactionsByType).length }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action Button -->
          <div class="flex-shrink-0">
            <button
              @click="showCreateModal = true"
              class="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-medium rounded-lg shadow-lg hover:from-emerald-700 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
            >
              <PlusIcon class="w-4 h-4 mr-2" />
              <span class="hidden sm:inline">Tạo giao dịch mới</span>
              <span class="sm:hidden">Tạo mới</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Filters -->
      <div class="mb-6">
        <FilterPanel
          :filters="filters"
          :warehouses="warehouses"
          @update:filters="handleFiltersUpdate"
        />
      </div>

      <!-- Content -->
      <div class="mb-6">
        <!-- View Toggle -->
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Hiển thị:</span>
            <div class="flex rounded-lg overflow-hidden border border-gray-300">
              <button
                @click="viewMode = 'grid'"
                :class="[
                  'px-3 py-1.5 text-xs font-medium transition-colors',
                  viewMode === 'grid'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                ]"
              >
                <Squares2X2Icon class="w-4 h-4" />
              </button>
              <button
                @click="viewMode = 'table'"
                :class="[
                  'px-3 py-1.5 text-xs font-medium transition-colors border-l border-gray-300',
                  viewMode === 'table'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                ]"
              >
                <TableCellsIcon class="w-4 h-4" />
              </button>
            </div>
          </div>

          <!-- Page Size -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-700">Hiển thị:</span>
            <select
              :value="filters.limit"
              @change="handlePageSizeChange($event.target.value)"
              class="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
            <span class="text-sm text-gray-700">bản ghi</span>
          </div>
        </div>

        <!-- Transaction List -->
        <TransactionList
          :transactions="transactions"
          :loading="loading"
          :current-user="currentUser"
          :view-mode="viewMode"
          @view="handleViewTransaction"
          @edit="handleEditTransaction"
          @delete="handleDeleteTransaction"
          @approve="handleApproveTransaction"
          @reject="handleRejectTransaction"
        />

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="mt-6">
          <nav class="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg">
            <div class="flex flex-1 justify-between sm:hidden">
              <button
                @click="goToPage(transactionStore.currentPage - 1)"
                :disabled="transactionStore.currentPage <= 1"
                class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Trước
              </button>
              <button
                @click="goToPage(transactionStore.currentPage + 1)"
                :disabled="transactionStore.currentPage >= transactionStore.totalPages"
                class="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sau
              </button>
            </div>
            
            <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Hiển thị
                  <span class="font-medium">{{ (transactionStore.currentPage - 1) * transactionStore.filters.limit + 1 }}</span>
                  đến
                  <span class="font-medium">{{ Math.min(transactionStore.currentPage * transactionStore.filters.limit, transactionStore.totalTransactions) }}</span>
                  trong
                  <span class="font-medium">{{ transactionStore.totalTransactions }}</span>
                  kết quả
                </p>
              </div>
              
              <div>
                <nav class="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                  <button
                    @click="goToPage(transactionStore.currentPage - 1)"
                    :disabled="transactionStore.currentPage <= 1"
                    class="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeftIcon class="h-5 w-5" />
                  </button>
                  
                  <button
                    v-for="page in visiblePages"
                    :key="page"
                    @click="goToPage(page)"
                    :class="[
                      'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
                      page === transactionStore.currentPage
                        ? 'z-10 bg-emerald-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600'
                        : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                    ]"
                  >
                    {{ page }}
                  </button>
                  
                  <button
                    @click="goToPage(transactionStore.currentPage + 1)"
                    :disabled="transactionStore.currentPage >= transactionStore.totalPages"
                    class="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronRightIcon class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </div>

    <!-- Create Modal -->
    <TransitionRoot as="template" :show="showCreateModal">
      <Dialog as="div" class="relative z-50" @close="showCreateModal = false">
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
              <DialogPanel class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-6xl sm:p-6">
                <div class="mb-4">
                  <DialogTitle class="text-lg font-semibold text-gray-900">
                    {{ editingTransaction ? 'Chỉnh sửa giao dịch' : 'Tạo giao dịch mới' }}
                  </DialogTitle>
                </div>
                
                <TransactionForm
                  :transaction="editingTransaction"
                  :material-batches="materialBatches"
                  :warehouses="warehouses"
                  :loading="transactionStore.loading"
                  @submit="handleFormSubmit"
                  @cancel="closeCreateModal"
                />
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>

    <!-- Detail Modal -->
    <TransactionDetailModal
      :show="showDetailModal"
      :transaction="selectedTransaction"
      :loading="transactionStore.loading"
      :can-edit="canEditSelectedTransaction"
      :can-approve="canApproveSelectedTransaction"
      @close="showDetailModal = false"
      @edit="handleEditTransaction"
      @approve="handleApproveTransaction"
      @reject="handleRejectTransaction"
    />

    <!-- Delete Confirmation -->
    <ConfirmDialog
      :show="showDeleteConfirm"
      title="Xóa giao dịch"
      :message="`Bạn có chắc chắn muốn xóa giao dịch #${deletingTransaction?.id}? Hành động này không thể hoàn tác.`"
      confirm-text="Xóa"
      confirm-variant="danger"
      :loading="transactionStore.loading"
      @confirm="confirmDelete"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'

// Store
import { useMaterialTransactionStore } from '../store/materialTransactionStore'
import { useMaterialBatchStore } from '../../material-batches/store/materialBatchStore'
import { useWarehouseStore } from '../../warehouse/store/warehouseStore'

// Components
import FilterPanel from '../components/FilterPanel.vue'
import TransactionList from '../components/TransactionList.vue'
import TransactionForm from '../components/TransactionForm.vue'
import TransactionDetailModal from '../components/TransactionDetailModal.vue'
import ConfirmDialog from '@/components/ConfirmDialog.vue'

// Icons
import {
  PlusIcon,
  DocumentChartBarIcon,
  ClockIcon,
  CheckBadgeIcon,
  ChartBarIcon,
  Squares2X2Icon,
  TableCellsIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/vue/24/outline'

// Store instances
const transactionStore = useMaterialTransactionStore()
const materialBatchStore = useMaterialBatchStore()
const warehouseStore = useWarehouseStore()

// Store refs
const {
  transactions,
  totalTransactions,
  loading,
  pendingTransactions,
  completedTransactions,
  transactionsByType,
  filters,
  totalPages,
  currentPage
} = storeToRefs(transactionStore)

const { materialBatches } = storeToRefs(materialBatchStore)
const { warehouses } = storeToRefs(warehouseStore)

// State
const viewMode = ref('grid')
const showCreateModal = ref(false)
const showDetailModal = ref(false)
const showDeleteConfirm = ref(false)
const selectedTransaction = ref(null)
const editingTransaction = ref(null)
const deletingTransaction = ref(null)

const currentUser = ref({
  id: 1,
  fullName: 'Admin User',
  role: 'ADMIN'
})

// Computed
const visiblePages = computed(() => {
  const current = transactionStore.currentPage
  const total = transactionStore.totalPages
  const pages = []
  
  let start = Math.max(1, current - 2)
  let end = Math.min(total, current + 2)
  
  if (end - start < 4) {
    if (start === 1) {
      end = Math.min(start + 4, total)
    } else {
      start = Math.max(end - 4, 1)
    }
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const canEditSelectedTransaction = computed(() => {
  if (!selectedTransaction.value || !currentUser.value) return false
  
  return (
    (selectedTransaction.value.createdBy?.id === currentUser.value.id && selectedTransaction.value.status === 'PENDING') ||
    ['ADMIN', 'MANAGER'].includes(currentUser.value.role)
  )
})

const canApproveSelectedTransaction = computed(() => {
  if (!selectedTransaction.value || !currentUser.value) return false
  
  return (
    ['ADMIN', 'MANAGER'].includes(currentUser.value.role) &&
    selectedTransaction.value.status === 'PENDING' &&
    selectedTransaction.value.createdBy?.id !== currentUser.value.id
  )
})

// Methods
const loadData = async () => {
  await Promise.all([
    transactionStore.fetchTransactions(),
    loadMaterialBatches(),
    loadWarehouses()
  ])
}

const loadMaterialBatches = async () => {
  try {
    await materialBatchStore.fetchMaterialBatches()
  } catch (error) {
    console.error('Error loading material batches:', error)
  }
}

const loadWarehouses = async () => {
  try {
    await warehouseStore.fetchWarehouses()
  } catch (error) {
    console.error('Error loading warehouses:', error)
  }
}

const handleFiltersUpdate = async (newFilters) => {
  Object.assign(transactionStore.filters, newFilters)
  await transactionStore.fetchTransactions()
}

const handlePageSizeChange = async (newSize) => {
  transactionStore.setPageSize(Number(newSize))
  await transactionStore.fetchTransactions()
}

const goToPage = async (page) => {
  if (page >= 1 && page <= transactionStore.totalPages) {
    transactionStore.setPage(page)
    await transactionStore.fetchTransactions()
  }
}

const handleViewTransaction = async (transaction) => {
  try {
    selectedTransaction.value = await transactionStore.fetchTransactionById(transaction.id)
    showDetailModal.value = true
  } catch (error) {
    console.error('Error loading transaction details:', error)
  }
}

const handleEditTransaction = (transaction) => {
  editingTransaction.value = transaction
  showCreateModal.value = true
  showDetailModal.value = false
}

const handleDeleteTransaction = (transaction) => {
  deletingTransaction.value = transaction
  showDeleteConfirm.value = true
}

const handleApproveTransaction = async (transaction) => {
  try {
    await transactionStore.approveTransaction(transaction.id)
    if (selectedTransaction.value?.id === transaction.id) {
      selectedTransaction.value = transactionStore.selectedTransaction
    }
  } catch (error) {
    console.error('Error approving transaction:', error)
  }
}

const handleRejectTransaction = async (transaction, reason) => {
  try {
    await transactionStore.rejectTransaction(transaction.id, reason)
    if (selectedTransaction.value?.id === transaction.id) {
      selectedTransaction.value = transactionStore.selectedTransaction
    }
  } catch (error) {
    console.error('Error rejecting transaction:', error)
  }
}

const handleFormSubmit = async (formData) => {
  try {
    if (editingTransaction.value) {
      await transactionStore.updateTransaction(editingTransaction.value.id, formData)
    } else {
      await transactionStore.createTransaction(formData)
    }
    closeCreateModal()
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

const confirmDelete = async () => {
  try {
    await transactionStore.deleteTransaction(deletingTransaction.value.id)
    showDeleteConfirm.value = false
    deletingTransaction.value = null
  } catch (error) {
    console.error('Error deleting transaction:', error)
  }
}

const closeCreateModal = () => {
  showCreateModal.value = false
  editingTransaction.value = null
}

// Lifecycle
onMounted(() => {
  loadData()
})

// Watch for filter changes
watch(() => transactionStore.filters, () => {
  transactionStore.fetchTransactions()
}, { deep: true })
</script>
