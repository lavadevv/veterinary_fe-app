import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as materialBatchService from '../services/material-batch.service'
import { useToast } from '@/config/toast'

export const useMaterialBatchStore = defineStore('materialBatch', () => {
  const { showSuccess, showError, showInfo, showWarning } = useToast()
  
  // State
  const materialBatches = ref([])
  const selectedMaterialBatch = ref(null)
  const totalMaterialBatches = ref(0)
  const loading = ref(false)
  const error = ref(null)
  
  // Filters and Pagination
  const filters = ref({
    start: 0,
    limit: 10,
    keywords: '',
    materialId: null,
    locationId: null,
    batchNumber: '',
    internalCode: '',
    testStatus: null,
    usageStatus: null,
    lowStock: null,
    nearExpiry: null,
    expired: null,
    minQuantity: null,
    maxQuantity: null,
    minManufactureDate: null,
    maxManufactureDate: null,
    minExpiryDate: null,
    maxExpiryDate: null,
    sortField: 'id',
    sortType: 'desc'
  })

  // Computed
  const totalPages = computed(() => Math.ceil(totalMaterialBatches.value / filters.value.limit))
  const currentPage = computed(() => Math.floor(filters.value.start / filters.value.limit) + 1)
  const hasFilters = computed(() => {
    const { start, limit, sortField, sortType, ...filterValues } = filters.value
    return Object.values(filterValues).some(value => 
      value !== null && value !== undefined && value !== ''
    )
  })

  // Actions
  const fetchMaterialBatches = async () => {
    try {
      loading.value = true
      error.value = null
      
      const cleanFilters = Object.fromEntries(
        Object.entries(filters.value).filter(([_, value]) => 
          value !== null && value !== undefined && value !== ''
        )
      )
      
      console.log('Fetching material batches with filters:', cleanFilters)
      const response = await materialBatchService.getMaterialBatches(cleanFilters)
      console.log('API Response:', response)
      
      // Handle Axios response structure: response.data contains the actual API response
      if (response.data && response.data.success) {
        const apiData = response.data.data
        if (apiData && apiData.items && Array.isArray(apiData.items)) {
          materialBatches.value = apiData.items
          totalMaterialBatches.value = apiData.total || apiData.items.length
          console.log('Loaded batches:', materialBatches.value.length)
        } else {
          materialBatches.value = []
          totalMaterialBatches.value = 0
          console.log('No items found in response')
        }
      } else {
        throw new Error(response.data?.error || 'Invalid response format')
      }
    } catch (err) {
      console.error('Store error:', err)
      error.value = err.message
      showError('Failed to load material batches: ' + err.message)
      materialBatches.value = []
      totalMaterialBatches.value = 0
    } finally {
      loading.value = false
    }
  }

  const fetchMaterialBatchById = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialBatchService.getBatchById(id)
      
      // API trả về data trực tiếp, không có wrapper
      if (response.data) {
        selectedMaterialBatch.value = response.data
        return response.data
      } else {
        throw new Error('Material batch not found - no data returned')
      }
    } catch (err) {
      error.value = err.message
      showError('Failed to load material batch: ' + err.message)
      selectedMaterialBatch.value = null
      return null
    } finally {
      loading.value = false
    }
  }

  const createMaterialBatch = async (materialBatchData) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialBatchService.createBatch(materialBatchData)
      
      if (response.data && response.data.success) {
        showSuccess('Material batch created successfully')
        await fetchMaterialBatches() // Refresh the list
        return response.data.data
      } else {
        throw new Error(response.data?.error || 'Failed to create material batch')
      }
    } catch (err) {
      error.value = err.message
      showError('Failed to create material batch: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMaterialBatch = async (id, materialBatchData) => {
    try {
      loading.value = true
      error.value = null
      
      console.log('updateMaterialBatch called with:', { id, materialBatchData })
      const response = await materialBatchService.updateBatch(id, materialBatchData)
      console.log('Update response:', response)
      
      // Handle different response structures
      let updatedData = null
      
      if (response.data?.success === true && response.data?.data) {
        // Structure: {success: true, data: {...}}
        updatedData = response.data.data
      } else if (response.data?.success === false) {
        // Handle error response: {success: false, error: {...}}
        console.log('API returned error:', response.data)
        let errorMessage = 'Update failed'
        
        if (response.data.error) {
          if (response.data.error.message) {
            errorMessage = response.data.error.message
          }
          
          // Handle validation errors array
          if (response.data.error.errors && Array.isArray(response.data.error.errors)) {
            const validationErrors = response.data.error.errors.map(err => err.message).join(', ')
            errorMessage = `${response.data.error.message}: ${validationErrors}`
          }
        }
        
        throw new Error(errorMessage)
      } else if (response.data && typeof response.data === 'object' && response.data.id) {
        // Direct data: {id: 1, ...}
        updatedData = response.data
      } else {
        console.error('Unexpected response structure:', response.data)
        throw new Error('Failed to update material batch - unexpected response structure')
      }
      
      showSuccess('Material batch updated successfully')
      
      // Update the selected material batch if it's the one being updated
      if (selectedMaterialBatch.value && selectedMaterialBatch.value.id === id) {
        selectedMaterialBatch.value = updatedData
      }
      
      // Update the batch in the list
      const index = materialBatches.value.findIndex(batch => batch.id === id)
      if (index !== -1) {
        materialBatches.value[index] = updatedData
      }
      
      return updatedData
    } catch (err) {
      console.error('Error in updateMaterialBatch:', err)
      
      let errorMessage = 'Unknown error occurred'
      
      // Handle different error types
      if (err instanceof Error) {
        errorMessage = err.message
      } else if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.response?.data?.error) {
        errorMessage = typeof err.response.data.error === 'string' ? err.response.data.error : 'API error occurred'
      } else if (typeof err === 'string') {
        errorMessage = err
      }
      
      error.value = errorMessage
      showError('Failed to update material batch: ' + errorMessage)
      throw new Error(errorMessage)
    } finally {
      loading.value = false
    }
  }

  const deleteMaterialBatch = async (id) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialBatchService.deleteBatch(id)
      
      if (response.success) {
        showSuccess('Material batch deleted successfully')
        
        // Remove from the list
        materialBatches.value = materialBatches.value.filter(batch => batch.id !== id)
        totalMaterialBatches.value = Math.max(0, totalMaterialBatches.value - 1)
        
        // Clear selected if it was the deleted one
        if (selectedMaterialBatch.value && selectedMaterialBatch.value.id === id) {
          selectedMaterialBatch.value = null
        }
        
        return true
      } else {
        throw new Error(response.message || 'Failed to delete material batch')
      }
    } catch (err) {
      error.value = err.message
      showError('Failed to delete material batch: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteMaterialBatches = async (ids) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialBatchService.deleteMultipleBatches(ids)
      
      if (response.success) {
        showSuccess(`${ids.length} material batch(es) deleted successfully`)
        await fetchMaterialBatches() // Refresh the list
        return true
      } else {
        throw new Error(response.message || 'Failed to delete material batches')
      }
    } catch (err) {
      error.value = err.message
      showError('Failed to delete material batches: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMaterialBatchQuantity = async (id, quantity) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialBatchService.updateBatchQuantity(id, quantity)
      
      if (response.success && response.data) {
        showSuccess('Material batch quantity updated successfully')
        
        // Update in list and selected
        if (selectedMaterialBatch.value && selectedMaterialBatch.value.id === id) {
          selectedMaterialBatch.value = response.data
        }
        
        const index = materialBatches.value.findIndex(batch => batch.id === id)
        if (index !== -1) {
          materialBatches.value[index] = response.data
        }
        
        return response.data
      } else {
        throw new Error(response.message || 'Failed to update quantity')
      }
    } catch (err) {
      error.value = err.message
      showError('Failed to update quantity: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMaterialBatchTestStatus = async (id, testStatus) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialBatchService.updateBatchTestStatus(id, testStatus)
      
      if (response.success && response.data) {
        showSuccess('Test status updated successfully')
        
        // Update in list and selected
        if (selectedMaterialBatch.value && selectedMaterialBatch.value.id === id) {
          selectedMaterialBatch.value = response.data
        }
        
        const index = materialBatches.value.findIndex(batch => batch.id === id)
        if (index !== -1) {
          materialBatches.value[index] = response.data
        }
        
        return response.data
      } else {
        throw new Error(response.message || 'Failed to update test status')
      }
    } catch (err) {
      error.value = err.message
      showError('Failed to update test status: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateMaterialBatchUsageStatus = async (id, usageStatus) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialBatchService.updateBatchUsageStatus(id, usageStatus)
      
      if (response.success && response.data) {
        showSuccess('Usage status updated successfully')
        
        // Update in list and selected
        if (selectedMaterialBatch.value && selectedMaterialBatch.value.id === id) {
          selectedMaterialBatch.value = response.data
        }
        
        const index = materialBatches.value.findIndex(batch => batch.id === id)
        if (index !== -1) {
          materialBatches.value[index] = response.data
        }
        
        return response.data
      } else {
        throw new Error(response.message || 'Failed to update usage status')
      }
    } catch (err) {
      error.value = err.message
      showError('Failed to update usage status: ' + err.message)
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchMaterialBatchesByMaterial = async (materialId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialBatchService.getBatchByMaterial(materialId)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch material batches')
      }
    } catch (err) {
      error.value = err.message
      showError('Failed to load material batches: ' + err.message)
      return []
    } finally {
      loading.value = false
    }
  }

  const fetchMaterialBatchesByLocation = async (locationId) => {
    try {
      loading.value = true
      error.value = null
      
      const response = await materialBatchService.getBatchByLocation(locationId)
      
      if (response.success && response.data) {
        return response.data
      } else {
        throw new Error(response.message || 'Failed to fetch material batches')
      }
    } catch (err) {
      error.value = err.message
      showError('Failed to load material batches: ' + err.message)
      return []
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
      start: 0,
      limit: 10,
      keywords: '',
      materialId: null,
      locationId: null,
      batchNumber: '',
      internalCode: '',
      testStatus: null,
      usageStatus: null,
      lowStock: null,
      nearExpiry: null,
      expired: null,
      minQuantity: null,
      maxQuantity: null,
      minManufactureDate: null,
      maxManufactureDate: null,
      minExpiryDate: null,
      maxExpiryDate: null,
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

  const setSorting = (field, type = 'asc') => {
    filters.value.sortField = field
    filters.value.sortType = type
  }

  // Clear actions
  const clearError = () => {
    error.value = null
  }

  const clearSelectedMaterialBatch = () => {
    selectedMaterialBatch.value = null
  }

  const clearMaterialBatches = () => {
    materialBatches.value = []
    totalMaterialBatches.value = 0
  }

  return {
    // State
    materialBatches,
    selectedMaterialBatch,
    totalMaterialBatches,
    loading,
    error,
    filters,
    
    // Computed
    totalPages,
    currentPage,
    hasFilters,
    
    // Actions
    fetchMaterialBatches,
    fetchMaterialBatchById,
    createMaterialBatch,
    updateMaterialBatch,
    deleteMaterialBatch,
    deleteMaterialBatches,
    updateMaterialBatchQuantity,
    updateMaterialBatchTestStatus,
    updateMaterialBatchUsageStatus,
    fetchMaterialBatchesByMaterial,
    fetchMaterialBatchesByLocation,
    
    // Filter actions
    updateFilters,
    resetFilters,
    setPage,
    setPageSize,
    setSorting,
    
    // Clear actions
    clearError,
    clearSelectedMaterialBatch,
    clearMaterialBatches
  }
})
