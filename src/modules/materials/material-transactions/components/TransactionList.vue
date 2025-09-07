<template>
  <div class="space-y-4">
    <!-- Empty State -->
    <div v-if="!transactions || transactions.length === 0" class="text-center py-12">
      <div class="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
        <DocumentIcon class="w-8 h-8 text-gray-400" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">
        {{ loading ? 'Đang tải...' : 'Không có giao dịch nào' }}
      </h3>
      <p class="text-gray-500 max-w-sm mx-auto">
        {{ loading ? 'Vui lòng đợi trong giây lát' : 'Chưa có giao dịch nào được tạo hoặc không có giao dịch nào khớp với bộ lọc.' }}
      </p>
    </div>

    <!-- Grid View -->
    <div v-else-if="viewMode === 'grid'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <TransactionCard
        v-for="transaction in transactions"
        :key="transaction.id"
        :transaction="transaction"
        :can-edit="canEditTransaction(transaction)"
        :can-delete="canDeleteTransaction(transaction)"
        :can-approve="canApproveTransaction(transaction)"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @approve="$emit('approve', $event)"
        @reject="$emit('reject', $event)"
        class="transition-all duration-200 hover:scale-[1.02]"
      />
    </div>

    <!-- Table View -->
    <TransactionTable
      v-else
      :transactions="transactions"
      :loading="loading"
      :current-user="currentUser"
      @view="$emit('view', $event)"
      @edit="$emit('edit', $event)"
      @delete="$emit('delete', $event)"
      @approve="$emit('approve', $event)"
      @reject="$emit('reject', $event)"
    />

    <!-- Loading State -->
    <div v-if="loading && transactions && transactions.length > 0" class="text-center py-4">
      <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-white bg-emerald-500 transition ease-in-out duration-150">
        <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        Đang cập nhật...
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TransactionCard from './TransactionCard.vue'
import TransactionTable from './TransactionTable.vue'
import { DocumentIcon } from '@heroicons/vue/24/outline'

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
  },
  viewMode: {
    type: String,
    default: 'grid',
    validator: (value) => ['grid', 'table'].includes(value)
  }
})

defineEmits(['view', 'edit', 'delete', 'approve', 'reject'])

// Permission checks
const canEditTransaction = (transaction) => {
  if (!props.currentUser) return false
  
  // Can edit if:
  // 1. User is the creator and transaction is pending
  // 2. User has admin/manager role
  return (
    (transaction.createdBy?.id === props.currentUser.id && transaction.status === 'PENDING') ||
    ['ADMIN', 'MANAGER'].includes(props.currentUser.role)
  )
}

const canDeleteTransaction = (transaction) => {
  if (!props.currentUser) return false
  
  // Can delete if:
  // 1. User is the creator and transaction is pending
  // 2. User has admin role
  return (
    (transaction.createdBy?.id === props.currentUser.id && transaction.status === 'PENDING') ||
    props.currentUser.role === 'ADMIN'
  )
}

const canApproveTransaction = (transaction) => {
  if (!props.currentUser) return false
  
  // Can approve if:
  // 1. User has appropriate role (manager/admin)
  // 2. Transaction is pending
  // 3. User is not the creator (self-approval prevention)
  return (
    ['ADMIN', 'MANAGER'].includes(props.currentUser.role) &&
    transaction.status === 'PENDING' &&
    transaction.createdBy?.id !== props.currentUser.id
  )
}
</script>
