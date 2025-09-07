import api from '@/services/axios'

// Lấy danh sách locations với pagination/filter
export const getLocations = (params = {}) => {
  return api.get('/location', { params })
}

// Lấy thông tin 1 location theo ID
export const getLocationById = (id) => api.get(`/location/${id}`)

// Lấy thông tin 1 location theo code
export const getLocationByCode = (code) => api.get(`/location/code/${code}`)

// Lấy danh sách locations theo warehouse
export const getLocationsByWarehouse = (warehouseId) => api.get(`/location/warehouse/${warehouseId}`)

// Lấy danh sách locations khả dụng theo warehouse
export const getAvailableLocationsByWarehouse = (warehouseId) => 
  api.get(`/location/warehouse/${warehouseId}/available`)

// Lấy thông tin capacity của location
export const getLocationCapacity = (id) => api.get(`/location/${id}/capacity`)

// Tạo location mới
export const createLocation = (data) => api.post('/location', data)

// Cập nhật thông tin location
export const updateLocation = (id, data) => api.put('/location', { ...data, id })

// Xóa 1 location
export const deleteLocation = (id) => api.delete(`/location/${id}`)

// Xóa nhiều locations
export const deleteLocations = (ids) => api.delete('/location/all', { data: ids })

// Cập nhật capacity hiện tại
export const updateLocationCapacity = (id, capacity) => 
  api.put(`/location/${id}/capacity`, { capacity })

// Bật/tắt trạng thái khả dụng
export const toggleLocationAvailability = (id) => api.put(`/location/${id}/toggle-availability`)

// Cập nhật trạng thái location
export const updateLocationStatus = (id, isAvailable) => 
  api.patch(`/location/${id}/status`, { isAvailable })

// Export dữ liệu
export const exportLocations = (format, params = {}) => 
  api.get(`/location/export`, { params: { ...params, format }, responseType: 'blob' })
