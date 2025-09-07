import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { 
  getWarehouses, 
  getWarehouseById, 
  createWarehouse, 
  updateWarehouse, 
  toggleWarehouseStatus,
  getActiveWarehouses 
} from '../services/warehouse.service'

export const useWarehouseStore = defineStore('warehouse', () => {
  // State
  const warehouses = ref([])
  const currentWarehouse = ref(null)
  const loading = ref(false)
  const selectedWarehouses = ref([])
  
  // Pagination state
  const pagination = ref({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} trên ${total} kho`
  })
  
  // Filter state
  const filters = ref({
    keywords: '',
    warehouseType: '',
    isActive: null,
    sortField: 'id',
    sortType: 'DESC'
  })

  // Warehouse type options
  const warehouseTypes = ref([
    { value: 'Kho nguyên liệu', label: 'Kho nguyên liệu' },
    { value: 'Kho bao bì', label: 'Kho bao bì' },
    { value: 'Thành phẩm', label: 'Kho thành phẩm' },
    { value: 'Kho phụ liệu', label: 'Kho phụ liệu' },
    { value: 'Kho tạm', label: 'Kho tạm' }
  ])

  // Getters
  const isLoading = computed(() => loading.value)
  const warehouseCount = computed(() => warehouses.value.length)
  const hasSelectedWarehouses = computed(() => selectedWarehouses.value.length > 0)
  const activeWarehouseCount = computed(() => 
    warehouses.value?.filter(warehouse => warehouse.isActive)?.length || 0
  )
  const inactiveWarehouseCount = computed(() => 
    warehouses.value?.filter(warehouse => !warehouse.isActive)?.length || 0
  )

  // Actions
  const fetchWarehouses = async (params = {}) => {
    loading.value = true
    try {
      const queryParams = {
        start: (pagination.value.current - 1) || 0, // Convert to 0-based page index
        limit: pagination.value.pageSize,
        ...filters.value,
        ...params
      }

      // Remove empty values
      Object.keys(queryParams).forEach(key => {
        if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
          delete queryParams[key]
        }
      })

      const response = await getWarehouses(queryParams)
      
      if (response.data.success) {
        warehouses.value = response.data.data.items || []
        pagination.value.total = response.data.data.total || 0
      }
    } catch (error) {
      console.error('Error fetching warehouses:', error)
      warehouses.value = []
    } finally {
      loading.value = false
    }
  }

  const fetchWarehouse = async (id) => {
    loading.value = true
    try {
      const response = await getWarehouseById(id)
      if (response.data.success) {
        currentWarehouse.value = response.data.data
        return response.data.data
      }
    } catch (error) {
      console.error('Error fetching warehouse:', error)
    } finally {
      loading.value = false
    }
  }

  const createNewWarehouse = async (warehouseData) => {
    loading.value = true
    try {
      const response = await createWarehouse(warehouseData)
      if (response.data.success) {
        await fetchWarehouses()
        return response.data
      }
    } catch (error) {
      console.error('Error creating warehouse:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const updateExistingWarehouse = async (id, warehouseData) => {
    loading.value = true
    try {
      const response = await updateWarehouse(id, warehouseData)
      if (response.data.success) {
        await fetchWarehouses()
        return response.data
      }
    } catch (error) {
      console.error('Error updating warehouse:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const toggleWarehouseActivation = async (id) => {
    loading.value = true
    try {
      const response = await toggleWarehouseStatus(id)
      if (response.data.success) {
        await fetchWarehouses()
        return response.data
      }
    } catch (error) {
      console.error('Error toggling warehouse status:', error)
      throw error
    } finally {
      loading.value = false
    }
  }

  const fetchActiveWarehouses = async () => {
    try {
      const response = await getActiveWarehouses()
      if (response.data.success) {
        return response.data.data
      }
      return []
    } catch (error) {
      console.error('Error fetching active warehouses:', error)
      return []
    }
  }

  // Filter and pagination actions
  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const setPagination = (newPagination) => {
    pagination.value = { ...pagination.value, ...newPagination }
  }

  const resetFilters = () => {
    filters.value = {
      keywords: '',
      warehouseType: '',
      isActive: null,
      sortField: 'id',
      sortType: 'DESC'
    }
    pagination.value.current = 1
  }

  // Selection actions
  const selectWarehouse = (warehouse) => {
    const index = selectedWarehouses.value.findIndex(item => item.id === warehouse.id)
    if (index === -1) {
      selectedWarehouses.value.push(warehouse)
    }
  }

  const unselectWarehouse = (warehouse) => {
    const index = selectedWarehouses.value.findIndex(item => item.id === warehouse.id)
    if (index !== -1) {
      selectedWarehouses.value.splice(index, 1)
    }
  }

  const selectAllWarehouses = () => {
    selectedWarehouses.value = [...warehouses.value]
  }

  const clearSelection = () => {
    selectedWarehouses.value = []
  }

  const refreshWarehouses = async () => {
    await fetchWarehouses()
  }

  const clearCurrentWarehouse = () => {
    currentWarehouse.value = null
  }

  return {
    // State
    warehouses,
    currentWarehouse,
    loading,
    pagination,
    filters,
    selectedWarehouses,
    warehouseTypes,
    
    // Getters
    isLoading,
    warehouseCount,
    hasSelectedWarehouses,
    activeWarehouseCount,
    inactiveWarehouseCount,
    
    // Actions
    fetchWarehouses,
    fetchWarehouse,
    createNewWarehouse,
    updateExistingWarehouse,
    toggleWarehouseActivation,
    fetchActiveWarehouses,
    setFilters,
    setPagination,
    resetFilters,
    selectWarehouse,
    unselectWarehouse,
    selectAllWarehouses,
    clearSelection,
    refreshWarehouses,
    clearCurrentWarehouse
  }
})
