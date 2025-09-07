/**
 * =====================================================
 * MATERIAL TRANSACTION MODULE INDEX
 * =====================================================
 * 
 * Export tất cả các components, pages, store và utilities
 * của module Material Transaction
 */

// Pages
export { default as MaterialTransactionPage } from './pages/MaterialTransactionPage.vue'
export { default as MaterialTransactionDetailPage } from './pages/MaterialTransactionDetailPage.vue'
export { default as CreateMaterialTransactionPage } from './pages/CreateMaterialTransactionPage.vue'
export { default as EditMaterialTransactionPage } from './pages/EditMaterialTransactionPage.vue'

// Components
export { default as TransactionCard } from './components/TransactionCard.vue'
export { default as TransactionList } from './components/TransactionList.vue'
export { default as TransactionTable } from './components/TransactionTable.vue'
export { default as TransactionForm } from './components/TransactionForm.vue'
export { default as TransactionDetailModal } from './components/TransactionDetailModal.vue'
export { default as TransactionTypeBadge } from './components/TransactionTypeBadge.vue'
export { default as StatusBadge } from './components/StatusBadge.vue'
export { default as FilterPanel } from './components/FilterPanel.vue'
export { default as TransactionStats } from './components/TransactionStats.vue'
export { default as RejectModal } from './components/RejectModal.vue'

// Store
export { useMaterialTransactionStore } from './store/materialTransactionStore'

// Services
export * as materialTransactionService from './services/material-transaction.service'

// Constants
export * from './constants/transaction-types'

// Routes
export { default } from './material-transaction.router'

// Module metadata
export const moduleInfo = {
  name: 'material-transactions',
  version: '1.0.0',
  description: 'Module quản lý giao dịch vật liệu',
  author: 'Veterinary Management System',
  dependencies: [
    '@headlessui/vue',
    'pinia',
    'vue-router',
    'lodash-es'
  ]
}

// Components
export { default as TransactionCard } from './components/TransactionCard.vue'
export { default as TransactionList } from './components/TransactionList.vue'
export { default as TransactionTable } from './components/TransactionTable.vue'
export { default as TransactionForm } from './components/TransactionForm.vue'
export { default as TransactionDetailModal } from './components/TransactionDetailModal.vue'
export { default as TransactionTypeBadge } from './components/TransactionTypeBadge.vue'
export { default as StatusBadge } from './components/StatusBadge.vue'
export { default as FilterPanel } from './components/FilterPanel.vue'
export { default as TransactionStats } from './components/TransactionStats.vue'
export { default as RejectModal } from './components/RejectModal.vue'

// Constants
export * from './constants/transaction-types'

// Services
export * from './services/material-transaction.service'
