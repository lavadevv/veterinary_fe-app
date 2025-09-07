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
      const response = await materialService.getMaterialById(id)
      
      if (response.data.success) {
        selectedMaterial.value = response.data.data
        return response.data.data
      } else {
        throw new Error(response.data.error || 'Không tìm thấy vật liệu')
      }
    } catch (err) {
      error.value = err.message
      showError(error.value)
      throw err
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
