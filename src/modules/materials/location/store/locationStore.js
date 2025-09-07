import { defineStore } from 'pinia'
import {
  getLocations,
  getLocationById,
  getLocationByCode,
  getLocationsByWarehouse,
  getAvailableLocationsByWarehouse,
  getLocationCapacity,
  createLocation,
  updateLocation,
  deleteLocation,
  deleteLocations,
  updateLocationCapacity,
  toggleLocationAvailability,
  updateLocationStatus,
  exportLocations
} from '../services/location.service'
import { getAllWarehouses } from '../../warehouse/services/warehouse.service'
import { useToast } from '@/config/toast'

export const useLocationStore = defineStore('location', {
  state: () => ({
    locations: [],
    currentLocation: null,
    pagination: {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      totalPages: 0
    },
    filters: {
      keywords: '',
      warehouseId: null,
      isAvailable: null,
      minCapacity: null,
      maxCapacity: null,
      sortField: 'createdDate',
      sortType: 'desc'
    },
    loading: false,
    error: null,
    warehouses: [], // Danh sách warehouses để select
    isFilterOpen: false
  }),

  getters: {
    // Filtered locations
    filteredLocations: (state) => {
      if (!Array.isArray(state.locations)) return []
      let filtered = [...state.locations]
      
      if (state.filters.keywords) {
        const keywords = state.filters.keywords.toLowerCase()
        filtered = filtered.filter(location => 
          location.locationCode?.toLowerCase().includes(keywords) ||
          location.positionDetail?.toLowerCase().includes(keywords) ||
          location.shelf?.toLowerCase().includes(keywords) ||
          location.floor?.toLowerCase().includes(keywords)
        )
      }

      if (state.filters.warehouseId) {
        filtered = filtered.filter(location => 
          location.warehouseId === state.filters.warehouseId
        )
      }

      if (state.filters.isAvailable !== null) {
        filtered = filtered.filter(location => 
          location.isAvailable === state.filters.isAvailable
        )
      }

      if (state.filters.minCapacity !== null) {
        filtered = filtered.filter(location => 
          location.maxCapacity >= state.filters.minCapacity
        )
      }

      if (state.filters.maxCapacity !== null) {
        filtered = filtered.filter(location => 
          location.maxCapacity <= state.filters.maxCapacity
        )
      }

      return filtered
    },

    // Available locations
    availableLocations: (state) => {
      if (!Array.isArray(state.locations)) return []
      return state.locations.filter(location => location.isAvailable)
    },

    // Locations by warehouse
    locationsByWarehouse: (state) => (warehouseId) => {
      if (!Array.isArray(state.locations)) return []
      return state.locations.filter(location => location.warehouseId === warehouseId)
    },

    // Capacity statistics
    capacityStats: (state) => {
      if (!Array.isArray(state.locations)) return { total: 0, available: 0, totalCapacity: 0, usedCapacity: 0, utilizationRate: 0 }
      
      const total = state.locations.length
      const available = state.locations.filter(l => l.isAvailable).length
      const totalCapacity = state.locations.reduce((sum, l) => sum + (l.maxCapacity || 0), 0)
      const usedCapacity = state.locations.reduce((sum, l) => sum + (l.currentCapacity || 0), 0)
      
      return {
        total,
        available,
        unavailable: total - available,
        totalCapacity,
        usedCapacity,
        freeCapacity: totalCapacity - usedCapacity,
        utilizationRate: totalCapacity > 0 ? (usedCapacity / totalCapacity) * 100 : 0
      }
    }
  },

  actions: {
    // Fetch locations with filters and pagination
    async fetchLocations(params = {}) {
      this.loading = true
      this.error = null
      
      try {
        console.log('📍 Fetching locations with params:', params)
        
        const searchParams = {
          start: ((params.page || this.pagination.currentPage) - 1) * (params.limit || this.pagination.pageSize),
          limit: params.limit || this.pagination.pageSize,
          ...this.filters,
          ...params
        }

        // Remove null/undefined values
        Object.keys(searchParams).forEach(key => {
          if (searchParams[key] === null || searchParams[key] === undefined || searchParams[key] === '') {
            delete searchParams[key]
          }
        })

        console.log('📍 Processed search params:', searchParams)
        
        const response = await getLocations(searchParams)
        console.log('📍 Raw API response:', response)
        console.log('📍 Response data structure:', JSON.stringify(response.data, null, 2))
        console.log('📍 Response.data.data:', response.data.data)
        console.log('📍 Response.data.items:', response.data.items)
        
        // Transform data to match frontend expectations
        const itemsArray = response.data.data?.items || response.data.items || []
        console.log('📍 Items array to transform:', itemsArray)
        
        const transformedLocations = itemsArray.map(location => ({
          ...location,
          warehouse: location.warehouseDto // Map warehouseDto to warehouse
        }))
        
        console.log('📍 Transformed locations:', transformedLocations)
        console.log('📍 Total locations count:', response.data.data?.total || response.data.total || 0)
        
        this.locations = transformedLocations
        this.pagination = {
          total: response.data.data?.total || response.data.total || 0,
          currentPage: params.page || this.pagination.currentPage,
          pageSize: params.limit || this.pagination.pageSize,
          totalPages: Math.ceil((response.data.data?.total || response.data.total || 0) / (params.limit || this.pagination.pageSize))
        }
        
        return response.data
      } catch (error) {
        console.error('❌ Error fetching locations:', error)
        this.error = error.response?.data?.message || 'Lỗi khi tải danh sách vị trí kho'
        const { showError } = useToast()
        showError(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Fetch single location
    async fetchLocationById(id) {
      this.loading = true
      this.error = null
      
      try {
        console.log('📍 Fetching location by ID:', id)
        
        const response = await getLocationById(id)
        console.log('📍 Raw location response:', response)
        
        // Transform data to match frontend expectations
        const transformedLocation = {
          ...response.data,
          warehouse: response.data.warehouseDto
        }
        
        console.log('📍 Transformed location:', transformedLocation)
        
        this.currentLocation = transformedLocation
        return transformedLocation
      } catch (error) {
        console.error('❌ Error fetching location by ID:', error)
        this.error = error.response?.data?.message || 'Lỗi khi tải thông tin vị trí kho'
        const { showError } = useToast()
        showError(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Fetch location by code
    async fetchLocationByCode(code) {
      try {
        const response = await getLocationByCode(code)
        return response.data
      } catch (error) {
        const { showError } = useToast()
        showError(error.response?.data?.message || 'Lỗi khi tìm vị trí kho')
        throw error
      }
    },

    // Fetch locations by warehouse
    async fetchLocationsByWarehouse(warehouseId) {
      try {
        const response = await getLocationsByWarehouse(warehouseId)
        return response.data
      } catch (error) {
        const { showError } = useToast()
        showError(error.response?.data?.message || 'Lỗi khi tải vị trí kho theo warehouse')
        throw error
      }
    },

    // Fetch available locations by warehouse
    async fetchAvailableLocationsByWarehouse(warehouseId) {
      try {
        const response = await getAvailableLocationsByWarehouse(warehouseId)
        return response.data
      } catch (error) {
        const { showError } = useToast()
        showError(error.response?.data?.message || 'Lỗi khi tải vị trí kho khả dụng')
        throw error
      }
    },

    // Create new location
    async createLocation(locationData) {
      this.loading = true
      this.error = null
      
      try {
        console.log('📍 Creating location with data:', locationData)
        
        const response = await createLocation(locationData)
        console.log('📍 Create location response:', response)
        
        // Add to store if successful
        this.locations.unshift(response.data)
        this.pagination.total += 1
        
        console.log('📍 Location created successfully:', response.data)
        
        const { showSuccess } = useToast()
        showSuccess('Tạo vị trí kho thành công!')
        
        return response.data
      } catch (error) {
        console.error('❌ Error creating location:', error)
        this.error = error.response?.data?.message || 'Lỗi khi tạo vị trí kho'
        const { showError } = useToast()
        showError(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update location
    async updateLocation(id, locationData) {
      this.loading = true
      this.error = null
      
      try {
        console.log('📍 Updating location ID:', id, 'with data:', locationData)
        
        const response = await updateLocation(id, locationData)
        console.log('📍 Update location response:', response)
        
        // Update in store
        const index = this.locations.findIndex(location => location.id === id)
        if (index !== -1) {
          this.locations[index] = response.data
          console.log('📍 Updated location in store at index:', index)
        }
        
        if (this.currentLocation?.id === id) {
          this.currentLocation = response.data
          console.log('📍 Updated current location')
        }
        
        console.log('📍 Location updated successfully:', response.data)
        
        const { showSuccess } = useToast()
        showSuccess('Cập nhật vị trí kho thành công!')
        
        return response.data
      } catch (error) {
        console.error('❌ Error updating location:', error)
        this.error = error.response?.data?.message || 'Lỗi khi cập nhật vị trí kho'
        const { showError } = useToast()
        showError(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Delete single location
    async deleteLocation(id) {
      this.loading = true
      this.error = null
      
      try {
        await deleteLocation(id)
        
        // Remove from store
        this.locations = this.locations.filter(location => location.id !== id)
        this.pagination.total -= 1
        
        if (this.currentLocation?.id === id) {
          this.currentLocation = null
        }
        
        const { showSuccess } = useToast()
        showSuccess('Xóa vị trí kho thành công!')
        
      } catch (error) {
        this.error = error.response?.data?.message || 'Lỗi khi xóa vị trí kho'
        const { showError } = useToast()
        showError(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Delete multiple locations
    async deleteMultipleLocations(ids) {
      this.loading = true
      this.error = null
      
      try {
        await deleteLocations(ids)
        
        // Remove from store
        this.locations = this.locations.filter(location => !ids.includes(location.id))
        this.pagination.total -= ids.length
        
        const { showSuccess } = useToast()
        showSuccess(`Xóa ${ids.length} vị trí kho thành công!`)
        
      } catch (error) {
        this.error = error.response?.data?.message || 'Lỗi khi xóa vị trí kho'
        const { showError } = useToast()
        showError(this.error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update location capacity
    async updateCapacity(id, capacity) {
      try {
        const response = await updateLocationCapacity(id, capacity)
        
        // Update in store
        const index = this.locations.findIndex(location => location.id === id)
        if (index !== -1) {
          this.locations[index].currentCapacity = capacity
        }
        
        const { showSuccess } = useToast()
        showSuccess('Cập nhật sức chứa thành công!')
        
        return response.data
      } catch (error) {
        const { showError } = useToast()
        showError(error.response?.data?.message || 'Lỗi khi cập nhật sức chứa')
        throw error
      }
    },

    // Toggle location availability
    async toggleAvailability(id) {
      try {
        const response = await toggleLocationAvailability(id)
        
        // Update in store
        const index = this.locations.findIndex(location => location.id === id)
        if (index !== -1) {
          this.locations[index].isAvailable = response.data.isAvailable
        }
        
        const { showSuccess } = useToast()
        showSuccess('Cập nhật trạng thái thành công!')
        
        return response.data
      } catch (error) {
        const { showError } = useToast()
        showError(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái')
        throw error
      }
    },

    // Update location status
    async updateStatus(id, isAvailable) {
      try {
        const response = await updateLocationStatus(id, isAvailable)
        
        // Update in store
        const index = this.locations.findIndex(location => location.id === id)
        if (index !== -1) {
          this.locations[index].isAvailable = isAvailable
        }
        
        const { showSuccess } = useToast()
        showSuccess('Cập nhật trạng thái thành công!')
        
        return response.data
      } catch (error) {
        const { showError } = useToast()
        showError(error.response?.data?.message || 'Lỗi khi cập nhật trạng thái')
        throw error
      }
    },

    // Export locations
    async exportData(format = 'excel', params = {}) {
      this.loading = true
      
      try {
        const searchParams = {
          ...this.filters,
          ...params
        }

        const response = await exportLocations(format, searchParams)
        
        // Create download link
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `locations_${new Date().toISOString().split('T')[0]}.${format === 'excel' ? 'xlsx' : 'csv'}`)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
        
        const { showSuccess } = useToast()
        showSuccess('Xuất dữ liệu thành công!')
        
      } catch (error) {
        const { showError } = useToast()
        showError(error.response?.data?.message || 'Lỗi khi xuất dữ liệu')
        throw error
      } finally {
        this.loading = false
      }
    },

    // Update filters
    updateFilters(newFilters) {
      this.filters = { ...this.filters, ...newFilters }
    },

    // Reset filters
    resetFilters() {
      this.filters = {
        keywords: '',
        warehouseId: null,
        isAvailable: null,
        minCapacity: null,
        maxCapacity: null,
        sortField: 'createdDate',
        sortType: 'desc'
      }
    },

    // Clear current location
    clearCurrentLocation() {
      this.currentLocation = null
    },

    // Toggle filter panel
    toggleFilter() {
      this.isFilterOpen = !this.isFilterOpen
    },

    // Set pagination
    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
    },

    // Load warehouses for select options
    async loadWarehouses() {
      try {
        const response = await getAllWarehouses()
        this.warehouses = response.data || []
      } catch (error) {
        console.error('Failed to load warehouses:', error)
        useToast().error('Không thể tải danh sách kho')
        this.warehouses = []
      }
    }
  }
})
