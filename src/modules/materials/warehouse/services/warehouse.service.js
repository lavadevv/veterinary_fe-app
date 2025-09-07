import api from "@/services/axios";

/**
 * Lấy danh sách warehouses với pagination/filter
 * @param {Object} params - Parameters for filtering
 * @param {number} params.start - Start index for pagination
 * @param {number} params.limit - Number of records per page
 * @param {string} params.keywords - Search by warehouseName or warehouseCode
 * @param {string} params.warehouseType - Filter by warehouse type
 * @param {boolean} params.isActive - Filter by active status
 * @param {string} params.sortField - Field to sort by
 * @param {string} params.sortType - Sort order (ASC/DESC)
 */
export const getWarehouses = (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return api.get(`/warehouse${queryString ? `?${queryString}` : ''}`)
}

// Lấy thông tin 1 warehouse theo ID
export const getWarehouseById = (id) => api.get(`/warehouse/${id}`);

// Lấy thông tin 1 warehouse theo code
export const getWarehouseByCode = (code) => api.get(`/warehouse/code/${code}`);

// Lấy danh sách warehouses theo type
export const getWarehouseByType = (type) => api.get(`/warehouse/type/${type}`);

// Lấy danh sách warehouses đang hoạt động
export const getActiveWarehouses = () => api.get("/warehouse/active");

/**
 * Lấy tất cả warehouses (không phân trang)
 * @returns {Promise} Response data containing array of all warehouses
 * @example
 * // Returns array of warehouse objects:
 * [
 *   {
 *     "id": 4,
 *     "warehouseCode": "WAREHOUSE01",
 *     "warehouseName": "Kho Thành Phẩm Hà Nội",
 *     "warehouseType": "Thành phẩm",
 *     "address": "Số 12, đường Quốc Oai, Hà Nội",
 *     "managerName": "Nguyễn Văn Cường",
 *     "temperatureRange": "10°C - 12°C",
 *     "humidityRange": "65% - 70%",
 *     "specialConditions": "Kho cần giữ kín, tránh ánh nắng trực tiếp",
 *     "isActive": true
 *   }
 * ]
 */
export const getAllWarehouses = () => api.get("/warehouse/all");

// Tạo warehouse mới
export const createWarehouse = (data) => api.post("/warehouse", data);

// Cập nhật thông tin warehouse
export const updateWarehouse = (id, data) => api.put(`/warehouse/${id}`, data);

// Bật/tắt trạng thái warehouse
export const toggleWarehouseStatus = (id) => api.put(`/warehouse/${id}/toggle-status`);
