<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Sidebar Overlay -->
    <div v-if="showSidebar && isMobile" class="fixed inset-0 z-40 bg-black bg-opacity-50" @click="showSidebar = false"></div>

    <!-- Main container with sidebar layout -->
    <div class="flex h-screen">
      <!-- Sidebar -->
      <div :class="[
        'bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out',
        isMobile ? (showSidebar ? 'fixed inset-y-0 left-0 z-50 w-80' : 'hidden') : 'w-80'
      ]">
        <!-- Sidebar Header -->
        <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <div>
              <h1 class="text-lg font-semibold text-gray-900">Giao Dịch Vật Liệu</h1>
              <p class="text-sm text-gray-500 mt-1">Quản lý nhập xuất, chuyển kho</p>
            </div>
            <button 
              v-if="isMobile"
              @click="showSidebar = false"
              class="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 touch-manipulation"
            >
              <XMarkIcon class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
          <router-link
            :to="{ name: 'MaterialTransactionCreate' }"
            class="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors touch-manipulation"
          >
            <PlusIcon class="-ml-1 mr-2 h-4 sm:h-5 w-4 sm:w-5" />
            Tạo Giao Dịch Mới
          </router-link>
        </div>

        <!-- Sidebar Filter Panel -->
        <div class="flex-1 overflow-y-auto px-4 sm:px-6 py-4">
          <div class="space-y-6">
            <!-- Transaction Type Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Loại giao dịch</label>
              <div class="space-y-2">
                <label v-for="(label, type) in transactionTypeOptions" :key="type" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="type"
                    v-model="filters.transactionTypes"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-700">{{ label }}</span>
                </label>
              </div>
            </div>

            <!-- Status Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Trạng thái</label>
              <div class="space-y-2">
                <label v-for="(label, status) in transactionStatusOptions" :key="status" class="flex items-center">
                  <input
                    type="checkbox"
                    :value="status"
                    v-model="filters.statuses"
                    class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                  >
                  <span class="ml-2 text-sm text-gray-700">{{ label }}</span>
                </label>
              </div>
            </div>

            <!-- Date Range Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Khoảng thời gian</label>
              <div class="space-y-3">
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Từ ngày</label>
                  <input
                    type="date"
                    v-model="filters.dateFrom"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                  >
                </div>
                <div>
                  <label class="block text-xs text-gray-500 mb-1">Đến ngày</label>
                  <input
                    type="date"
                    v-model="filters.dateTo"
                    class="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
                  >
                </div>
              </div>
            </div>

            <!-- Warehouse Filter -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-3">Kho</label>
              <select
                v-model="filters.warehouseId"
                class="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 text-sm"
              >
                <option value="">Tất cả kho</option>
                <option v-for="warehouse in (warehouses || [])" :key="warehouse.id" :value="warehouse.id">
                  {{ warehouse.warehouseName || warehouse.name }}
                </option>
              </select>
            </div>

            <!-- Filter Actions -->
            <div class="pt-4 border-t border-gray-200">
              <div class="flex space-x-2">
                <button
                  @click="applyFilters"
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Áp dụng
                </button>
                <button
                  @click="resetFilters"
                  class="flex-1 inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  Đặt lại
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Stats -->
        <div class="px-4 sm:px-6 py-4 border-t border-gray-200">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center">
              <div class="text-xl sm:text-2xl font-bold text-emerald-600">{{ stats.totalTransactions }}</div>
              <div class="text-xs text-gray-500">Tổng giao dịch</div>
            </div>
            <div class="text-center">
              <div class="text-xl sm:text-2xl font-bold text-blue-600">{{ stats.pendingTransactions }}</div>
              <div class="text-xs text-gray-500">Chờ duyệt</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Mobile Header Bar -->
        <div v-if="isMobile" class="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between lg:hidden">
          <div class="flex items-center space-x-3">
            <button
              @click="showSidebar = true"
              class="p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100 touch-manipulation"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            <h1 class="text-lg font-semibold text-gray-900">Giao Dịch</h1>
          </div>
          <router-link
            :to="{ name: 'MaterialTransactionCreate' }"
            class="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 touch-manipulation"
          >
            <PlusIcon class="w-4 h-4 mr-1" />
            Tạo mới
          </router-link>
        </div>
        <!-- Top Header Bar -->
        <div class="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
          <div class="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <div class="flex items-center space-x-4">
              <h2 class="text-lg sm:text-xl font-semibold text-gray-900">
                Danh Sách Giao Dịch
              </h2>
              <div class="flex items-center space-x-2">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {{ pagination.totalItems }} giao dịch
                </span>
                <span v-if="hasActiveFilters" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                  Đã lọc
                </span>
              </div>
            </div>
            
            <!-- View Toggle - Hide table option on mobile -->
            <div class="flex items-center space-x-2">
              <div class="bg-gray-100 rounded-lg p-1 flex">
                <button
                  v-if="!isMobile"
                  @click="viewMode = 'table'"
                  :class="[
                    'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                    viewMode === 'table' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900'
                  ]"
                >
                  <TableCellsIcon class="w-4 h-4 mr-1 inline" />
                  <span class="hidden sm:inline">Bảng</span>
                </button>
                <button
                  @click="viewMode = 'cards'"
                  :class="[
                    'px-3 py-1 text-sm font-medium rounded-md transition-colors',
                    viewMode === 'cards' 
                      ? 'bg-white text-gray-900 shadow-sm' 
                      : 'text-gray-500 hover:text-gray-900'
                  ]"
                >
                  <Squares2X2Icon class="w-4 h-4 mr-1 inline" />
                  <span class="hidden sm:inline">{{ isMobile ? 'Danh sách' : 'Thẻ' }}</span>
                  <span class="sm:hidden">Danh sách</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-auto">
          <div class="p-4 sm:p-6">
            <!-- Loading State -->
            <div v-if="loading" class="flex items-center justify-center py-12">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span class="ml-3 text-gray-600">Đang tải dữ liệu...</span>
            </div>

            <!-- Empty State -->
            <div v-else-if="!transactions || transactions.length === 0" class="text-center py-12">
              <DocumentChartBarIcon class="mx-auto h-12 w-12 text-gray-400" />
              <h3 class="mt-2 text-sm font-medium text-gray-900">Không có giao dịch</h3>
              <p class="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo giao dịch mới.</p>
              <div class="mt-6">
                <router-link
                  :to="{ name: 'MaterialTransactionCreate' }"
                  class="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                >
                  <PlusIcon class="-ml-1 mr-2 h-5 w-5" />
                  Tạo giao dịch mới
                </router-link>
              </div>
            </div>

            <!-- Transaction Table View -->
            <div v-else-if="viewMode === 'table'" class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giao dịch
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Vật liệu
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số lượng
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kho
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày
                    </th>
                    <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Thao tác
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="transaction in (transactions || [])" 
                    :key="transaction.id" 
                    class="hover:bg-gray-50 cursor-pointer"
                    @click="handleViewTransaction(transaction)"
                  >
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <component
                          :is="getTransactionIcon(transaction.transactionType)"
                          :class="[
                            'flex-shrink-0 h-5 w-5 mr-3',
                            getTransactionTypeColor(transaction.transactionType).icon
                          ]"
                        />
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ getTransactionTypeLabel(transaction.transactionType) }}
                          </div>
                          <div class="text-sm text-gray-500">
                            #{{ transaction.id }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ transaction.materialBatchDto?.materialDto?.materialName || 'N/A' }}
                      </div>
                      <div class="text-sm text-gray-500">
                        Lô: {{ transaction.materialBatchDto?.batchNumber || 'N/A' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ formatNumber(transaction.quantity) }} {{ transaction.materialBatchDto?.materialDto?.unitOfMeasure || '' }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">
                        {{ getLocationDisplay(transaction) }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <TransactionStatusBadge :status="getTransactionStatus(transaction)" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(transaction.transactionDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div class="flex items-center justify-end space-x-2">
                        <button
                          @click="handleViewTransaction(transaction)"
                          class="text-emerald-600 hover:text-emerald-900"
                        >
                          <EyeIcon class="w-4 h-4" />
                        </button>
                        <router-link
                          :to="{ name: 'MaterialTransactionEdit', params: { id: transaction.id } }"
                          class="text-indigo-600 hover:text-indigo-900"
                        >
                          <PencilIcon class="w-4 h-4" />
                        </router-link>
                        <button
                          @click="handleDeleteTransaction(transaction)"
                          class="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Transaction Cards View -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <div
                v-for="transaction in (transactions || [])"
                :key="transaction.id"
                class="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200 cursor-pointer"
                @click="handleViewTransaction(transaction)"
              >
                <div class="p-4 sm:p-6">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <component
                        :is="getTransactionIcon(transaction.transactionType)"
                        :class="[
                          'h-5 w-5 sm:h-6 sm:w-6',
                          getTransactionTypeColor(transaction.transactionType).icon
                        ]"
                      />
                      <span class="ml-2 text-xs sm:text-sm font-medium text-gray-900 truncate">
                        {{ getTransactionTypeLabel(transaction.transactionType) }}
                      </span>
                    </div>
                    <TransactionStatusBadge :status="getTransactionStatus(transaction)" />
                  </div>
                  
                  <div class="mt-3 sm:mt-4">
                    <h3 class="text-sm sm:text-lg font-medium text-gray-900 line-clamp-2">
                      {{ transaction.materialBatchDto?.materialDto?.materialName || 'N/A' }}
                    </h3>
                    <p class="text-xs sm:text-sm text-gray-500 truncate">
                      Lô: {{ transaction.materialBatchDto?.batchNumber || 'N/A' }}
                    </p>
                  </div>

                  <div class="mt-3 sm:mt-4 space-y-1 sm:space-y-2">
                    <div class="flex justify-between text-xs sm:text-sm">
                      <span class="text-gray-500">Số lượng:</span>
                      <span class="font-medium truncate ml-2">{{ formatNumber(transaction.quantity) }} {{ transaction.materialBatchDto?.materialDto?.unitOfMeasure || '' }}</span>
                    </div>
                    <div class="flex justify-between text-xs sm:text-sm">
                      <span class="text-gray-500">Vị trí:</span>
                      <span class="font-medium truncate ml-2">{{ getLocationDisplay(transaction) }}</span>
                    </div>
                    <div class="flex justify-between text-xs sm:text-sm">
                      <span class="text-gray-500">Ngày:</span>
                      <span class="font-medium">{{ formatDate(transaction.transactionDate) }}</span>
                    </div>
                  </div>

                  <div class="mt-4 sm:mt-6 flex justify-end space-x-1 sm:space-x-2">
                    <button
                      @click.stop="handleViewTransaction(transaction)"
                      class="inline-flex items-center px-2 sm:px-3 py-1 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 touch-manipulation"
                    >
                      <EyeIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span class="hidden sm:inline">Xem</span>
                    </button>
                    <router-link
                      :to="{ name: 'MaterialTransactionEdit', params: { id: transaction.id } }"
                      @click.stop=""
                      class="inline-flex items-center px-2 sm:px-3 py-1 border border-gray-300 shadow-sm text-xs sm:text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors touch-manipulation"
                    >
                      <PencilIcon class="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                      <span class="hidden sm:inline">Sửa</span>
                    </router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="pagination.totalPages > 1" class="mt-8 flex items-center justify-between">
              <div class="flex-1 flex justify-between sm:hidden">
                <button
                  @click="changePage(pagination.currentPage - 1)"
                  :disabled="pagination.currentPage <= 1"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Trước
                </button>
                <button
                  @click="changePage(pagination.currentPage + 1)"
                  :disabled="pagination.currentPage >= pagination.totalPages"
                  class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                >
                  Tiếp
                </button>
              </div>
              <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p class="text-sm text-gray-700">
                    Hiển thị
                    <span class="font-medium">{{ ((pagination.currentPage - 1) * pagination.pageSize) + 1 }}</span>
                    đến
                    <span class="font-medium">{{ Math.min(pagination.currentPage * pagination.pageSize, pagination.totalItems) }}</span>
                    trong tổng số
                    <span class="font-medium">{{ pagination.totalItems }}</span>
                    kết quả
                  </p>
                </div>
                <div>
                  <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      @click="changePage(pagination.currentPage - 1)"
                      :disabled="pagination.currentPage <= 1"
                      class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronLeftIcon class="h-5 w-5" />
                    </button>
                    <button
                      v-for="page in getVisiblePages()"
                      :key="page"
                      @click="changePage(page)"
                      :class="[
                        page === pagination.currentPage
                          ? 'z-10 bg-emerald-50 border-emerald-500 text-emerald-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50',
                        'relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                      ]"
                    >
                      {{ page }}
                    </button>
                    <button
                      @click="changePage(pagination.currentPage + 1)"
                      :disabled="pagination.currentPage >= pagination.totalPages"
                      class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                    >
                      <ChevronRightIcon class="h-5 w-5" />
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Transaction Detail Modal -->
    <TransactionDetailModal
      :transaction="selectedTransaction"
      :show="showDetailModal"
      @close="showDetailModal = false"
      @edit="handleEditFromDetail"
      @delete="handleDeleteTransaction"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useMaterialTransactionStore } from '../store/materialTransactionStore'
import { useMaterialBatchStore } from '../../material-batches/store/materialBatchStore'
import { useWarehouseStore } from '../../warehouse/store/warehouseStore'

// Components
import TransactionDetailModal from '../components/TransactionDetailModal.vue'
import TransactionStatusBadge from '../components/StatusBadge.vue'

// Icons
import {
  PlusIcon,
  DocumentChartBarIcon,
  XMarkIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  TableCellsIcon,
  Squares2X2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
} from '@heroicons/vue/24/outline'

// Constants
import {
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_STATUS_LABELS,
  TRANSACTION_TYPE_COLORS,
  TRANSACTION_TYPE_ICONS,
  TRANSACTION_TYPES,
  TRANSACTION_STATUSES
} from '../constants/transaction-types'

// Composables
const router = useRouter()

// Stores
const materialTransactionStore = useMaterialTransactionStore()
const materialBatchStore = useMaterialBatchStore()
const warehouseStore = useWarehouseStore()

const {
  transactions,
  loading,
  totalPages,
  currentPage,
  totalTransactions,
  submitLoading
} = storeToRefs(materialTransactionStore)

const { materialBatches } = storeToRefs(materialBatchStore)
const { warehouses } = storeToRefs(warehouseStore)

// Reactive data
const viewMode = ref('table')
const showDetailModal = ref(false)
const selectedTransaction = ref(null)
const isMobile = ref(false)
const showSidebar = ref(false)

const filters = ref({
  transactionTypes: [],
  statuses: [],
  dateFrom: '',
  dateTo: '',
  warehouseId: ''
})

// Computed
const transactionTypeOptions = TRANSACTION_TYPE_LABELS
const transactionStatusOptions = TRANSACTION_STATUS_LABELS

// Create pagination object for template compatibility
const pagination = computed(() => ({
  currentPage: currentPage.value || 1,
  totalPages: totalPages.value || 1,
  totalItems: totalTransactions.value || 0,
  pageSize: 10 // Default page size, should match store
}))

const stats = computed(() => ({
  totalTransactions: totalTransactions.value || 0,
  pendingTransactions: transactions.value?.filter(t => !t.approvedByDto).length || 0
}))

const hasActiveFilters = computed(() => {
  return filters.value.transactionTypes.length > 0 ||
         filters.value.statuses.length > 0 ||
         filters.value.dateFrom ||
         filters.value.dateTo ||
         filters.value.warehouseId
})

const iconComponents = {
  ArrowDownOnSquareIcon,
  ArrowUpOnSquareIcon,
  ArrowsRightLeftIcon,
  PencilSquareIcon
}

// Methods
const getTransactionTypeLabel = (type) => {
  return TRANSACTION_TYPE_LABELS[type] || type
}

const getTransactionTypeColor = (type) => {
  return TRANSACTION_TYPE_COLORS[type] || TRANSACTION_TYPE_COLORS[TRANSACTION_TYPES.IMPORT]
}

const getTransactionIcon = (type) => {
  const iconName = TRANSACTION_TYPE_ICONS[type]
  return iconComponents[iconName] || ArrowDownOnSquareIcon
}

const formatNumber = (number) => {
  if (number == null) return '0'
  return new Intl.NumberFormat('vi-VN').format(number)
}

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

const getLocationDisplay = (transaction) => {
  if (!transaction) return 'N/A'
  
  // For different transaction types, show appropriate location info
  if (transaction.transactionType === 'NHAP_KHO' && transaction.toLocationDto) {
    const warehouse = transaction.toLocationDto.warehouseDto
    return `${warehouse?.warehouseName || 'N/A'} (${transaction.toLocationDto.locationCode || 'N/A'})`
  } else if (transaction.transactionType === 'XUAT_KHO' && transaction.fromLocationDto) {
    const warehouse = transaction.fromLocationDto.warehouseDto
    return `${warehouse?.warehouseName || 'N/A'} (${transaction.fromLocationDto.locationCode || 'N/A'})`
  } else if (transaction.transactionType === 'DIEU_CHINH') {
    const fromWarehouse = transaction.fromLocationDto?.warehouseDto
    const toWarehouse = transaction.toLocationDto?.warehouseDto
    return `${fromWarehouse?.warehouseName || 'N/A'} → ${toWarehouse?.warehouseName || 'N/A'}`
  }
  
  return 'N/A'
}

const getTransactionStatus = (transaction) => {
  // Since backend doesn't return status field, we'll default to COMPLETED for now
  // You can add logic here based on other fields like approved status, etc.
  if (transaction.approvedByDto) {
    return 'COMPLETED'
  } else {
    return 'PENDING'
  }
}

const applyFilters = async () => {
  const filterParams = {}
  
  if (filters.value.transactionTypes.length > 0) {
    filterParams.transactionType = filters.value.transactionTypes
  }
  
  if (filters.value.statuses.length > 0) {
    filterParams.status = filters.value.statuses
  }
  
  if (filters.value.dateFrom) {
    filterParams.dateFrom = filters.value.dateFrom
  }
  
  if (filters.value.dateTo) {
    filterParams.dateTo = filters.value.dateTo
  }
  
  if (filters.value.warehouseId) {
    filterParams.warehouseId = filters.value.warehouseId
  }
  
  await materialTransactionStore.fetchTransactions(filterParams)
}

const resetFilters = async () => {
  filters.value = {
    transactionTypes: [],
    statuses: [],
    dateFrom: '',
    dateTo: '',
    warehouseId: ''
  }
  await materialTransactionStore.fetchTransactions()
}

const changePage = async (page) => {
  await materialTransactionStore.fetchTransactions({}, page)
}

const getVisiblePages = () => {
  const current = pagination.value.currentPage
  const total = pagination.value.totalPages
  const delta = 2
  const range = []
  
  for (let i = Math.max(2, current - delta); i <= Math.min(total - 1, current + delta); i++) {
    range.push(i)
  }
  
  if (current - delta > 2) {
    range.unshift('...')
  }
  if (current + delta < total - 1) {
    range.push('...')
  }
  
  range.unshift(1)
  if (total > 1) {
    range.push(total)
  }
  
  return range.filter((item, index, arr) => arr.indexOf(item) === index)
}

// Event handlers
const handleViewTransaction = (transaction) => {
  // Navigate to detail page instead of modal
  router.push({ name: 'MaterialTransactionDetail', params: { id: transaction.id } })
}

const handleViewModal = (transaction) => {
  selectedTransaction.value = transaction
  showDetailModal.value = true
}

const handleEditFromDetail = (transaction) => {
  showDetailModal.value = false
  // Navigate to edit page
  router.push({ name: 'MaterialTransactionEdit', params: { id: transaction.id } })
}

const handleDeleteTransaction = async (transaction) => {
  if (confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
    await materialTransactionStore.deleteTransaction(transaction.id)
  }
}

// Lifecycle
onMounted(async () => {
  // Check mobile on mount
  checkMobile()
  window.addEventListener('resize', handleResize)
  
  await Promise.all([
    materialTransactionStore.fetchTransactions(),
    materialBatchStore.fetchMaterialBatches(),
    warehouseStore.fetchWarehouses()
  ])
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// Mobile detection
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768
  // Force card view on mobile
  if (isMobile.value && viewMode.value === 'table') {
    viewMode.value = 'card'
  }
}

const handleResize = () => {
  checkMobile()
}
</script>

<style scoped>
/* ===== RESPONSIVE DESIGN ===== */

/* Large Screens - Default styles work well */
@media (max-width: 1440px) {
  .filters-panel {
    width: 280px;
  }
}

/* Medium Screens - Tablet */
@media (max-width: 1024px) {
  .p-6 {
    padding: 1rem !important;
  }
  
  .gap-6 {
    gap: 1rem !important;
  }
  
  .filters-panel {
    width: 100%;
    position: static;
    transform: none;
    box-shadow: none;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 1rem;
  }
  
  .filters-panel.open {
    display: block;
  }
  
  .filters-panel.closed {
    display: none;
  }
  
  /* Table responsive */
  .overflow-hidden.shadow {
    overflow-x: auto;
  }
  
  table {
    min-width: 800px;
  }
}

/* Small Screens - Mobile */
@media (max-width: 768px) {
  /* Header adjustments */
  .flex.justify-between.items-center {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }
  
  .flex.space-x-4 {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .space-x-4 > * {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
  
  /* Search and filter row */
  .grid.grid-cols-12.gap-4 {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .col-span-8, .col-span-4 {
    grid-column: span 1;
  }
  
  /* View mode buttons */
  .view-mode-buttons {
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .view-mode-buttons button {
    flex: 1;
    max-width: 120px;
  }
  
  /* Hide table view on mobile, show cards only */
  .table-view {
    display: none !important;
  }
  
  /* Force card view on mobile */
  .card-view {
    display: block !important;
  }
  
  /* Card adjustments */
  .card-view .grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .card-view .bg-white.rounded-lg {
    padding: 1rem;
  }
  
  /* Filter panel mobile */
  .filters-panel {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100vh;
    z-index: 50;
    background: white;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .filters-panel.closed {
    display: none;
  }
  
  .filters-panel.open {
    display: block;
  }
  
  /* Add close button for mobile filters */
  .filters-panel::before {
    content: "✕ Đóng bộ lọc";
    display: block;
    text-align: right;
    padding: 1rem 0;
    border-bottom: 1px solid #e5e7eb;
    margin-bottom: 1rem;
    cursor: pointer;
    font-weight: 600;
    color: #374151;
  }
  
  /* Pagination */
  .pagination {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .pagination .flex {
    width: 100%;
    justify-content: space-between;
  }
  
  /* Action buttons in cards */
  .card-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .card-actions button {
    width: 100%;
    justify-content: center;
  }
}

/* Extra Small Screens */
@media (max-width: 480px) {
  .p-6 {
    padding: 0.75rem !important;
  }
  
  .gap-6 {
    gap: 0.75rem !important;
  }
  
  /* Compact header */
  .text-2xl {
    font-size: 1.25rem !important;
  }
  
  .text-xl {
    font-size: 1.125rem !important;
  }
  
  /* Smaller buttons */
  button {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
  
  /* Card padding */
  .card-view .bg-white.rounded-lg {
    padding: 0.75rem;
  }
  
  /* Filter panel */
  .filters-panel {
    padding: 0.75rem;
  }
  
  /* Search input */
  input[type="text"], select {
    font-size: 16px; /* Prevent zoom on iOS */
  }
  
  /* Badge adjustments */
  .badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
  }
  
  /* Date display */
  .text-sm {
    font-size: 0.75rem;
  }
}

/* Landscape mobile */
@media (max-width: 768px) and (orientation: landscape) {
  .filters-panel {
    width: 50%;
    right: auto;
  }
  
  .card-view .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Touch improvements */
@media (hover: none) and (pointer: coarse) {
  button, .clickable {
    min-height: 44px; /* iOS recommended touch target */
  }
  
  .hover\:bg-gray-50:hover {
    background-color: initial;
  }
  
  .hover\:bg-blue-50:hover {
    background-color: initial;
  }
}

/* Print styles */
@media print {
  .filters-panel,
  .view-mode-buttons,
  .pagination,
  button {
    display: none !important;
  }
  
  .card-view .bg-white.rounded-lg {
    border: 1px solid #000;
    margin-bottom: 1rem;
    break-inside: avoid;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .bg-white {
    background-color: #1f2937;
    color: white;
  }
  
  .text-gray-900 {
    color: #f9fafb;
  }
  
  .text-gray-600 {
    color: #d1d5db;
  }
  
  .border-gray-300 {
    border-color: #4b5563;
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .bg-blue-600 {
    background-color: #000080;
  }
  
  .text-blue-600 {
    color: #000080;
  }
  
  .border-gray-300 {
    border-color: #000000;
    border-width: 2px;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Force card view helper class */
.mobile-force-cards .table-view {
  display: none !important;
}

.mobile-force-cards .card-view {
  display: block !important;
}
</style>
