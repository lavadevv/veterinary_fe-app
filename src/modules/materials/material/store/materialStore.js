import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as materialService from '../services/material.service'
import { useToast } from '@/config/toast'
import { PAGINATION_DEFAULTS } from '../constants/material.constants'

export const useMaterialStore = defineStore('material', () => {
  const { showSuccess, showError, showInfo, showWarning } = useToast()
  
  // State
  const materials = ref([])
  const selectedMaterial = ref(null)
  const totalMaterials = ref(0)
  const loading = ref(false)
  const error = ref(null)
  
  // Filters and Pagination
  const filters = ref({
    start: PAGINATION_DEFAULTS.start,
    limit: PAGINATION_DEFAULTS.limit,
    keywords: '',
    materialType: null,
    materialForm: null,
    supplierId: null,
    requiresColdStorage: null,
    isActive: null,
    lowStock: null,
    minFixedPrice: null,
    maxFixedPrice: null,
    sortField: 'id',
    sortType: 'desc'
  })

  // Computed
  const totalPages = computed(() => Math.ceil(totalMaterials.value / filters.value.limit))
  const currentPage = computed(() => Math.floor(filters.value.start / filters.value.limit) + 1)
  const hasFilters = computed(() => {
    const { start, limit, sortField, sortType, ...filterValues } = filters.value
    return Object.values(filterValues).some(value => 
      value !== null && value !== undefined && value !== ''
    )
  })

  // Actions
  const fetchMaterials = async () => {
    try {
      loading.value = true
      error.value = null
      
      const cleanFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([key, value]) => 
          value !== null && value !== undefined && value !== ''
        )
      )
      
      const response = await materialService.getMaterials(cleanFilters)
      
      if (response.data.success) {
        materials.value = response.data.data.items
        totalMaterials.value = response.data.data.total
      } else {
        throw new Error(response.data.error || 'Lỗi không xác định')
      }
    } catch (err) {
      error.value = err.message || 'Có lỗi xảy ra khi tải danh sách vật liệu'
      showError(error.value)
    } finally {
      loading.value = false
    }
  }

  const fetchMaterialById = async (id) => {
    try {
      loading.value = true
      console.log('fetchMaterialById called with id:', id)
      const response = await materialService.getMaterialById(id)
      console.log('getMaterialById response:', response)
      console.log('Response data:', response?.data)
      console.log('Response status:', response?.status)
      
      // Kiểm tra response structure
      if (response && response.data && response.status === 200) {
        console.log('Response validation passed')
        // Nếu có success field và là true
        if (response.data.success === true) {
          console.log('Success case: true, data:', response.data.data)
          selectedMaterial.value = response.data.data
          return response.data.data
        }
        // Nếu không có success field nhưng có data trực tiếp
        else if (response.data.success === undefined && response.data.id) {
          console.log('Direct data case, material:', response.data)
          selectedMaterial.value = response.data
          return response.data
        }
        // Nếu có success field và là false
        else if (response.data.success === false) {
          console.error('API returned error:', response.data)
          
          let errorMessage = 'Không tìm thấy vật liệu'
          if (response.data.error) {
            if (response.data.error.message) {
              errorMessage = response.data.error.message
            } else if (typeof response.data.error === 'string') {
              errorMessage = response.data.error
            }
            
            // Xử lý một số lỗi backend phổ biến
            if (errorMessage.includes('no Session')) {
              errorMessage = 'Lỗi kết nối cơ sở dữ liệu. Vui lòng thử lại sau.'
            } else if (errorMessage.includes('not found')) {
              errorMessage = 'Không tìm thấy vật liệu với ID này.'
            }
          }
          
          throw new Error(errorMessage)
        }
        else {
          console.log('Unknown response structure:', response.data)
          throw new Error('Cấu trúc response không hợp lệ')
        }
      } else {
        console.log('Invalid response or status:', { response, status: response?.status })
        throw new Error('Lỗi không xác định từ server')
      }
    } catch (err) {
      console.error('fetchMaterialById error:', err)
      
      // Xử lý lỗi network hoặc timeout
      let errorMessage = err.message
      if (err.code === 'NETWORK_ERROR' || err.code === 'ECONNREFUSED') {
        errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.'
      } else if (err.code === 'TIMEOUT') {
        errorMessage = 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.'
      }
      
      error.value = errorMessage
      
      // Toast thông báo với emoji và context phù hợp
      if (errorMessage.includes('kết nối cơ sở dữ liệu')) {
        showError(`🔌 Lỗi hệ thống: ${errorMessage}`)
      } else if (errorMessage.includes('không tìm thấy')) {
        showWarning(`🔍 ${errorMessage}`)
      } else if (errorMessage.includes('không thể kết nối')) {
        showError(`🌐 Lỗi mạng: ${errorMessage}`)
      } else if (errorMessage.includes('quá thời gian')) {
        showError(`⏱️ ${errorMessage}`)
      } else {
        showError(`⚠️ ${errorMessage}`)
      }
      
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  const createMaterial = async (materialData) => {
    try {
      loading.value = true
      const response = await materialService.createMaterial(materialData)
      
      if (response.data.success) {
        showSuccess('Tạo vật liệu thành công!')
        await fetchMaterials() // Refresh list
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Lỗi tạo vật liệu')
      }
    } catch (err) {
      error.value = err.message
      showError(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMaterial = async (id, materialData) => {
    try {
      loading.value = true
      const response = await materialService.updateMaterial(id, materialData)
      
      if (response.data.success) {
        showSuccess('Cập nhật vật liệu thành công!')
        await fetchMaterials() // Refresh list
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Lỗi cập nhật vật liệu')
      }
    } catch (err) {
      error.value = err.message
      showError(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMaterial = async (id) => {
    try {
      loading.value = true
      await materialService.deleteMaterial(id)
      showSuccess('Xóa vật liệu thành công!')
      await fetchMaterials() // Refresh list
    } catch (err) {
      error.value = err.message || 'Lỗi xóa vật liệu'
      showError(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMaterials = async (ids) => {
    try {
      loading.value = true
      await materialService.deleteMaterials(ids)
      showSuccess(`Xóa ${ids.length} vật liệu thành công!`)
      await fetchMaterials() // Refresh list
    } catch (err) {
      error.value = err.message || 'Lỗi xóa vật liệu'
      showError(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const toggleMaterialStatus = async (id) => {
    try {
      loading.value = true
      await materialService.toggleMaterialStatus(id)
      showSuccess('Cập nhật trạng thái thành công!')
      await fetchMaterials() // Refresh list
    } catch (err) {
      error.value = err.message || 'Lỗi cập nhật trạng thái'
      showError(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMaterialStock = async (id, newStock) => {
    try {
      loading.value = true
      await materialService.updateMaterialStock(id, newStock)
      showSuccess('Cập nhật tồn kho thành công!')
      await fetchMaterials() // Refresh list
    } catch (err) {
      error.value = err.message || 'Lỗi cập nhật tồn kho'
      showError(error.value)
      throw err
    } finally {
      loading.value = false
    }
  }

  // Filter actions
  const updateFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const resetFilters = () => {
    filters.value = {
      start: PAGINATION_DEFAULTS.start,
      limit: PAGINATION_DEFAULTS.limit,
      keywords: '',
      materialType: null,
      materialForm: null,
      supplierId: null,
      requiresColdStorage: null,
      isActive: null,
      lowStock: null,
      minFixedPrice: null,
      maxFixedPrice: null,
      sortField: 'id',
      sortType: 'desc'
    }
  }

  const setPage = (page) => {
    filters.value.start = (page - 1) * filters.value.limit
  }

  const setPageSize = (size) => {
    filters.value.limit = size
    filters.value.start = 0 // Reset to first page
  }

  const clearSelectedMaterial = () => {
    selectedMaterial.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    materials,
    selectedMaterial,
    totalMaterials,
    loading,
    error,
    filters,
    
    // Computed
    totalPages,
    currentPage,
    hasFilters,
    
    // Actions
    fetchMaterials,
    fetchMaterialById,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    deleteMaterials,
    toggleMaterialStatus,
    updateMaterialStock,
    
    // Filter actions
    updateFilters,
    resetFilters,
    setPage,
    setPageSize,
    clearSelectedMaterial,
    clearError
  }
})
