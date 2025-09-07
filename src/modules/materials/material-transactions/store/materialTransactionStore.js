import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as materialTransactionService from '../services/material-transaction.service'
import { useToast } from '@/config/toast'

export const useMaterialTransactionStore = defineStore('materialTransaction', () => {
  const { showSuccess, showError, showInfo, showWarning } = useToast()
  
  // State
  const transactions = ref([])
  const selectedTransaction = ref(null)
  const totalTransactions = ref(0)
  const loading = ref(false)
  const error = ref(null)
  
  // Filters and Pagination
  const filters = ref({
    start: 0,
    limit: 10,
    search: '',
    transactionType: null,
    status: null,
    warehouseId: null,
    materialBatchId: null,
    startDate: null,
    endDate: null,
    sortBy: 'transactionDate',
    sortOrder: 'desc'
  })

  // Computed
  const totalPages = computed(() => Math.ceil(totalTransactions.value / filters.value.limit))
  const currentPage = computed(() => Math.floor(filters.value.start / filters.value.limit) + 1)
  const hasFilters = computed(() => {
    const { start, limit, sortBy, sortOrder, ...filterValues } = filters.value
    return Object.values(filterValues).some(value => 
      value !== null && value !== undefined && value !== ''
    )
  })

  // Statistics computed
  const transactionsByType = computed(() => {
    if (!Array.isArray(transactions.value)) return {}
    return transactions.value.reduce((acc, transaction) => {
      const type = transaction.transactionType
      acc[type] = (acc[type] || 0) + 1
      return acc
    }, {})
  })

  const transactionsByStatus = computed(() => {
    if (!Array.isArray(transactions.value)) return {}
    return transactions.value.reduce((acc, transaction) => {
      const status = transaction.status
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})
  })

  const pendingTransactions = computed(() => {
    if (!Array.isArray(transactions.value)) return 0
    return transactions.value.filter(t => t.status === 'PENDING').length
  })

  const completedTransactions = computed(() => {
    if (!Array.isArray(transactions.value)) return 0
    return transactions.value.filter(t => t.status === 'COMPLETED').length
  })

  // Actions
  const fetchTransactions = async (resetPage = false) => {
    try {
      loading.value = true
      error.value = null
      
      if (resetPage) {
        filters.value.start = 0
      }

      const params = { ...filters.value }
      
      // Clean up null/undefined values
      Object.keys(params).forEach(key => {
        if (params[key] === null || params[key] === undefined || params[key] === '') {
          delete params[key]
        }
      })

      const response = await materialTransactionService.getTransactions(params)
      console.log(response);
      
      if (response.data) {
        // Kiểm tra format response từ API
        if (response.data.success && response.data.data && response.data.data.items) {
          // Format từ API thực: { success: true, data: { items: [], total: 0 } }
          transactions.value = response.data.data.items || []
          totalTransactions.value = response.data.data.total || 0
        } else if (response.data.data && Array.isArray(response.data.data)) {
          // Format từ API khác: { data: [], totalElements: 0 }
          transactions.value = response.data.data || []
          totalTransactions.value = response.data.totalElements || response.data.data.length || 0
        } else if (Array.isArray(response.data)) {
          // Format đơn giản: []
          transactions.value = response.data
          totalTransactions.value = response.data.length
        } else {
          // Fallback
          transactions.value = []
          totalTransactions.value = 0
        }
      } else {
        transactions.value = []
        totalTransactions.value = 0
      }
    } catch (err) {
      console.error('Error fetching transactions:', err)
      error.value = err.message || 'Có lỗi xảy ra khi tải dữ liệu'
      transactions.value = []
      totalTransactions.value = 0
      showError('Không thể tải danh sách giao dịch')
    } finally {
      loading.value = false
    }
  }

  const fetchTransactionById = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialTransactionService.getTransactionById(id)
      
      if (response.data) {
        selectedTransaction.value = response.data
        return response.data
      }
    } catch (err) {
      console.error('Error fetching transaction:', err)
      error.value = err.message || 'Có lỗi xảy ra khi tải thông tin giao dịch'
      showError('Không thể tải thông tin giao dịch')
      throw err
    } finally {
      loading.value = false
    }
  }

  const createTransaction = async (transactionData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialTransactionService.createTransaction(transactionData)
      
      if (response.data) {
        await fetchTransactions()
        showSuccess('Tạo giao dịch thành công')
        return response.data
      }
    } catch (err) {
      console.error('Error creating transaction:', err)
      error.value = err.message || 'Có lỗi xảy ra khi tạo giao dịch'
      
      // Extract specific error message from response
      const errorMessage = err.response?.data?.message || err.message || 'Không thể tạo giao dịch'
      showError(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateTransaction = async (id, transactionData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialTransactionService.updateTransaction(id, transactionData)
      
      if (response.data) {
        await fetchTransactions()
        selectedTransaction.value = response.data
        showSuccess('Cập nhật giao dịch thành công')
        return response.data
      }
    } catch (err) {
      console.error('Error updating transaction:', err)
      error.value = err.message || 'Có lỗi xảy ra khi cập nhật giao dịch'
      
      const errorMessage = err.response?.data?.message || err.message || 'Không thể cập nhật giao dịch'
      showError(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteTransaction = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      await materialTransactionService.deleteTransaction(id)
      await fetchTransactions()
      
      if (selectedTransaction.value?.id === id) {
        selectedTransaction.value = null
      }
      
      showSuccess('Xóa giao dịch thành công')
    } catch (err) {
      console.error('Error deleting transaction:', err)
      error.value = err.message || 'Có lỗi xảy ra khi xóa giao dịch'
      
      const errorMessage = err.response?.data?.message || err.message || 'Không thể xóa giao dịch'
      showError(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const approveTransaction = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialTransactionService.approveTransaction(id)
      
      if (response.data) {
        await fetchTransactions()
        if (selectedTransaction.value?.id === id) {
          selectedTransaction.value = response.data
        }
        showSuccess('Phê duyệt giao dịch thành công')
        return response.data
      }
    } catch (err) {
      console.error('Error approving transaction:', err)
      error.value = err.message || 'Có lỗi xảy ra khi phê duyệt giao dịch'
      
      const errorMessage = err.response?.data?.message || err.message || 'Không thể phê duyệt giao dịch'
      showError(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const rejectTransaction = async (id, reason) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialTransactionService.rejectTransaction(id, reason)
      
      if (response.data) {
        await fetchTransactions()
        if (selectedTransaction.value?.id === id) {
          selectedTransaction.value = response.data
        }
        showSuccess('Từ chối giao dịch thành công')
        return response.data
      }
    } catch (err) {
      console.error('Error rejecting transaction:', err)
      error.value = err.message || 'Có lỗi xảy ra khi từ chối giao dịch'
      
      const errorMessage = err.response?.data?.message || err.message || 'Không thể từ chối giao dịch'
      showError(errorMessage)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchTransactionsByBatch = async (batchId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialTransactionService.getTransactionsByBatch(batchId)
      
      return response.data || []
    } catch (err) {
      console.error('Error fetching transactions by batch:', err)
      error.value = err.message || 'Có lỗi xảy ra khi tải giao dịch theo lô'
      showError('Không thể tải giao dịch theo lô')
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchTransactionsByDateRange = async (startDate, endDate) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialTransactionService.getTransactionsByDateRange({
        startDate,
        endDate
      })
      
      return response.data || []
    } catch (err) {
      console.error('Error fetching transactions by date range:', err)
      error.value = err.message || 'Có lỗi xảy ra khi tải giao dịch theo khoảng thời gian'
      showError('Không thể tải giao dịch theo khoảng thời gian')
      return []
    } finally {
      loading.value = false
    }
  }

  // Filter actions
  const setFilter = (key, value) => {
    filters.value[key] = value
  }

  const clearFilters = () => {
    filters.value = {
      start: 0,
      limit: 10,
      search: '',
      transactionType: null,
      status: null,
      warehouseId: null,
      materialBatchId: null,
      startDate: null,
      endDate: null,
      sortBy: 'transactionDate',
      sortOrder: 'desc'
    }
  }

  const setPage = (page) => {
    filters.value.start = (page - 1) * filters.value.limit
  }

  const setPageSize = (size) => {
    filters.value.limit = size
    filters.value.start = 0
  }

  // Reset state
  const resetState = () => {
    transactions.value = []
    selectedTransaction.value = null
    totalTransactions.value = 0
    loading.value = false
    error.value = null
    clearFilters()
  }

  return {
    // State
    transactions,
    selectedTransaction,
    totalTransactions,
    loading,
    error,
    filters,
    
    // Computed
    totalPages,
    currentPage,
    hasFilters,
    transactionsByType,
    transactionsByStatus,
    pendingTransactions,
    completedTransactions,
    
    // Actions
    fetchTransactions,
    fetchTransactionById,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    approveTransaction,
    rejectTransaction,
    fetchTransactionsByBatch,
    fetchTransactionsByDateRange,
    
    // Filter actions
    setFilter,
    clearFilters,
    setPage,
    setPageSize,
    resetState
  }
})
