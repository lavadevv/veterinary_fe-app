<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile Header -->
    <TransactionMobileHeader 
      :transaction-id="transaction?.id"
      @go-back="goBack"
      @edit="editTransaction"
      @delete="deleteTransaction"
    />

    <!-- Desktop Header -->
    <TransactionDesktopHeader 
      :transaction-id="transaction?.id"
      @go-back="goBack"
      @edit="editTransaction"
      @delete="deleteTransaction"
    />

    <!-- Main Content Area -->
    <div class="flex-1 overflow-hidden">
      <!-- Loading State -->
      <div v-if="loading" class="flex items-center justify-center py-16">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p class="mt-4 text-gray-600">Đang tải thông tin giao dịch...</p>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="flex items-center justify-center py-16">
        <div class="text-center">
          <ExclamationTriangleIcon class="w-16 h-16 text-red-500 mx-auto" />
          <h3 class="mt-4 text-lg font-semibold text-gray-900">Có lỗi xảy ra</h3>
          <p class="mt-2 text-gray-600">{{ error }}</p>
          <button 
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700" 
            @click="loadTransactionDetail"
          >
            <ArrowPathIcon class="w-4 h-4 mr-2" />
            Thử lại
          </button>
        </div>
      </div>

      <!-- Transaction Detail Content -->
      <div v-else-if="transaction" class="lg:flex lg:h-full">
        <!-- Sidebar -->
        <TransactionSidebar 
          :transaction="transaction"
          @edit="editTransaction"
          @delete="deleteTransaction"
        />

        <!-- Main Content -->
        <div class="flex-1 overflow-y-auto">
          <div class="p-4 lg:p-6 space-y-6">
            <!-- Overview Section -->
            <TransactionOverview :transaction="transaction" />

            <!-- Material Details Section -->
            <MaterialDetails :transaction="transaction" />

            <!-- Quality Information -->
            <QualityInformation :transaction="transaction" />

            <!-- Documents -->
            <DocumentsSection :transaction="transaction" />

            <!-- Notes & Comments -->
            <NotesSection :transaction="transaction" />
          </div>
        </div>
      </div>

      <!-- No Data State -->
      <div v-else class="flex items-center justify-center py-16">
        <div class="text-center">
          <InboxIcon class="w-16 h-16 text-gray-400 mx-auto" />
          <h3 class="mt-4 text-lg font-semibold text-gray-900">Không tìm thấy giao dịch</h3>
          <p class="mt-2 text-gray-600">Giao dịch với ID này không tồn tại hoặc đã bị xóa.</p>
          <button 
            class="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700" 
            @click="goBack"
          >
            <ListBulletIcon class="w-4 h-4 mr-2" />
            Quay lại danh sách
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import materialTransactionService from '../services/material-transaction.service'
import { useToast } from '@/config/toast'

// Component imports
import TransactionMobileHeader from '../components/TransactionMobileHeader.vue'
import TransactionDesktopHeader from '../components/TransactionDesktopHeader.vue'
import TransactionSidebar from '../components/TransactionSidebar.vue'
import TransactionOverview from '../components/TransactionOverview.vue'
import MaterialDetails from '../components/MaterialDetails.vue'
import QualityInformation from '../components/QualityInformation.vue'
import DocumentsSection from '../components/DocumentsSection.vue'
import NotesSection from '../components/NotesSection.vue'

// Heroicons imports
import {
  ExclamationTriangleIcon,
  ArrowPathIcon,
  InboxIcon,
  ListBulletIcon
} from '@heroicons/vue/24/outline'

const route = useRoute()
const router = useRouter()
const { showSuccess, showError } = useToast()

// Reactive data
const transaction = ref(null)
const loading = ref(false)
const error = ref(null)

// Get transaction ID from route
const transactionId = route.params.id

// Methods
const goBack = () => {
  router.back()
}

const loadTransactionDetail = async () => {
  if (!transactionId) {
    error.value = 'ID giao dịch không hợp lệ'
    return
  }

  loading.value = true
  error.value = null

  try {
    const response = await materialTransactionService.getTransactionById(transactionId)
    transaction.value = response.data
  } catch (err) {
    console.error('Error loading transaction detail:', err)
    error.value = 'Không thể tải thông tin giao dịch'
    showError('Không thể tải thông tin giao dịch')
  } finally {
    loading.value = false
  }
}

const editTransaction = () => {
  router.push({
    name: 'MaterialTransactionEdit',
    params: { id: transactionId }
  })
}

const deleteTransaction = async () => {
  if (!confirm('Bạn có chắc chắn muốn xóa giao dịch này?')) {
    return
  }

  try {
    await materialTransactionService.deleteTransaction(transactionId)
    showSuccess('Xóa giao dịch thành công')
    router.push({ name: 'MaterialTransactionList' })
  } catch (err) {
    console.error('Error deleting transaction:', err)
    showError('Không thể xóa giao dịch')
  }
}

// Lifecycle
onMounted(() => {
  loadTransactionDetail()
})
</script>

<style scoped>
/* Custom scrollbar for webkit browsers */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f3f4f6;
}

::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 9999px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}

/* Smooth transitions */
* {
  transition: all 0.2s ease-in-out;
}

/* Touch improvements for mobile */
@media (hover: none) and (pointer: coarse) {
  button {
    min-height: 44px;
    min-width: 44px;
  }
}

/* High contrast support */
@media (prefers-contrast: high) {
  .border-gray-200 {
    border-color: #4b5563;
  }
  
  .text-gray-500 {
    color: #1f2937;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
