import { defineStore } from 'pinia'
import * as supplierService from '../services/supplier.service'
import { useToast } from '@/config/toast'

export const useSupplierStore = defineStore('supplier', {
  state: () => ({
    suppliers: [],
    currentSupplier: null,
    loading: false,
    error: null,
    pagination: {
      total: 0,
      start: 0,
      limit: 10
    },
    filters: {
      keywords: '',
      isActive: null,
      countryOfOrigin: '',
      gmpExpiryFromDate: null,
      gmpExpiryToDate: null,
      sortField: 'id',
      sortType: 'desc'
    }
  }),

  getters: {
    activeSuppliers: (state) => state.suppliers.filter(supplier => supplier.isActive),
    inactiveSuppliers: (state) => state.suppliers.filter(supplier => !supplier.isActive),
    totalPages: (state) => Math.ceil(state.pagination.total / state.pagination.limit),
    currentPage: (state) => Math.floor(state.pagination.start / state.pagination.limit) + 1
  },

  actions: {
    async fetchSuppliers(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        const searchParams = {
          start: this.pagination.start,
          limit: this.pagination.limit,
          ...this.filters,
          ...params
        }

        // Remove empty values
        Object.keys(searchParams).forEach(key => {
          if (searchParams[key] === '' || searchParams[key] === null || searchParams[key] === undefined) {
            delete searchParams[key]
          }
        })

        const response = await supplierService.getSuppliers(searchParams)
        
        if (response.data.success) {
          this.suppliers = response.data.data.items
          this.pagination.total = response.data.data.total
        } else {
          throw new Error(response.data.error || 'Không thể tải danh sách nhà cung cấp')
        }
      } catch (error) {
        this.error = error.message
        useToast().showError('Lỗi khi tải danh sách nhà cung cấp: ' + error.message)
      } finally {
        this.loading = false
      }
    },

    async fetchSupplierById(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await supplierService.getSupplierById(id)
        
        // API trả về SupplierDto trực tiếp, không có wrapper success
        this.currentSupplier = response.data
      } catch (error) {
        this.error = error.message
        useToast().showError('Lỗi khi tải thông tin nhà cung cấp: ' + error.message)
      } finally {
        this.loading = false
      }
    },

    async createSupplier(supplierData) {
      this.loading = true
      this.error = null
      
      try {
        const response = await supplierService.createSupplier(supplierData)
        
        // API trả về SupplierDto trực tiếp, không có wrapper success  
        useToast().showSuccess('Tạo nhà cung cấp thành công')
        await this.fetchSuppliers() // Refresh list
        return response.data
      } catch (error) {
        this.error = error.message
        useToast().showError('Lỗi khi tạo nhà cung cấp: ' + error.message)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateSupplier(id, supplierData) {
      this.loading = true
      this.error = null
      
      try {
        // Backend expect data with id field, PUT /suppliers (not /suppliers/{id})
        const response = await supplierService.updateSupplier(id, { ...supplierData, id: parseInt(id) })
        
        // API trả về SupplierDto trực tiếp, không có wrapper success
        useToast().showSuccess('Cập nhật nhà cung cấp thành công')
        await this.fetchSuppliers() // Refresh list
        return response.data
      } catch (error) {
        this.error = error.message
        useToast().showError('Lỗi khi cập nhật nhà cung cấp: ' + error.message)
        throw error
      } finally {
        this.loading = false
      }
    },

    async toggleSupplierStatus(id) {
      this.loading = true
      this.error = null
      
      try {
        const response = await supplierService.toggleSupplierStatus(id)
        
        // API trả về message string, không có wrapper success
        useToast().showSuccess('Thay đổi trạng thái nhà cung cấp thành công')
        await this.fetchSuppliers() // Refresh list
      } catch (error) {
        this.error = error.message
        useToast().showError('Lỗi khi thay đổi trạng thái: ' + error.message)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchActiveSuppliers() {
      this.loading = true
      this.error = null
      
      try {
        const response = await supplierService.getActiveSuppliers()
        
        // API trả về Array<SupplierDto> trực tiếp, không có wrapper success
        return response.data
      } catch (error) {
        this.error = error.message
        useToast().showError('Lỗi khi tải danh sách nhà cung cấp hoạt động: ' + error.message)
        return []
      } finally {
        this.loading = false
      }
    },

    async fetchExpiringGmpSuppliers(days = 30) {
      this.loading = true
      this.error = null
      
      try {
        const response = await supplierService.getExpiringGmpSuppliers(days)
        
        // API trả về Array<SupplierDto> trực tiếp, không có wrapper success
        return response.data
      } catch (error) {
        this.error = error.message
        useToast().showError('Lỗi khi tải danh sách nhà cung cấp sắp hết hạn GMP: ' + error.message)
        return []
      } finally {
        this.loading = false
      }
    },

    // Pagination actions
    setPage(page) {
      this.pagination.start = (page - 1) * this.pagination.limit
      this.fetchSuppliers()
    },

    setLimit(limit) {
      this.pagination.limit = limit
      this.pagination.start = 0
      this.fetchSuppliers()
    },

    // Filter actions
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
      this.pagination.start = 0 // Reset to first page
      this.fetchSuppliers()
    },

    clearFilters() {
      this.filters = {
        keywords: '',
        isActive: null,
        countryOfOrigin: '',
        gmpExpiryFromDate: null,
        gmpExpiryToDate: null,
        sortField: 'id',
        sortType: 'desc'
      }
      this.pagination.start = 0
      this.fetchSuppliers()
    },

    clearCurrentSupplier() {
      this.currentSupplier = null
    },

    clearError() {
      this.error = null
    }
  }
})
