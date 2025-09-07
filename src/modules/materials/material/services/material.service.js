import api from "@/services/axios";

/**
 * Lấy tất cả vật liệu với phân trang và bộ lọc
 * @param {Object} params - Tham số query cho phân trang và lọc
 * @param {number} [params.start=0] - Số trang bắt đầu từ 0
 * @param {number} [params.limit=10] - Số lượng bản ghi trong một trang (5-50)
 * @param {string} [params.keywords] - Từ khóa tìm kiếm
 * @param {string} [params.materialType] - Loại vật liệu (NGUYEN_LIEU, PHU_LIEU, BAO_BI, VAT_TU_TIEU_HAO, DUNG_MOI, KHAC)
 * @param {string} [params.materialForm] - Dạng vật liệu (BOT, LONG, HAT, VIEN, BAO_PHIM, KHAC)
 * @param {number} [params.supplierId] - ID nhà cung cấp
 * @param {boolean} [params.requiresColdStorage] - Yêu cầu bảo quản lạnh
 * @param {boolean} [params.isActive] - Trạng thái hoạt động
 * @param {boolean} [params.lowStock] - Lọc vật liệu có tồn kho thấp
 * @param {number} [params.minFixedPrice] - Giá tối thiểu
 * @param {number} [params.maxFixedPrice] - Giá tối đa
 * @param {string} [params.sortField] - Trường sắp xếp
 * @param {string} [params.sortType] - Kiểu sắp xếp (asc/desc)
 * @returns {Promise} Response chứa danh sách vật liệu với phân trang
 */
export const getMaterials = (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return api.get(`/material${queryString ? `?${queryString}` : ''}`)
}

/**
 * Lấy tất cả vật liệu đang hoạt động
 * @returns {Promise} Response chứa danh sách vật liệu đang active
 */
export const getActiveMaterials = () => api.get("/material/active");

/**
 * Lấy thông tin vật liệu theo ID
 * @param {number} id - ID của vật liệu
 * @returns {Promise} Response chứa thông tin chi tiết vật liệu
 */
export const getMaterialById = (id) => {
  console.log('getMaterialById service called with id:', id)
  console.log('API request URL:', `/material/${id}`)
  return api.get(`/material/${id}`)
}

/**
 * Lấy thông tin vật liệu theo mã code
 * @param {string} code - Mã code của vật liệu
 * @returns {Promise} Response chứa thông tin vật liệu
 */
export const getMaterialByCode = (code) => api.get(`/material/code/${code}`);

/**
 * Lấy danh sách vật liệu theo nhà cung cấp
 * @param {number} supplierId - ID của nhà cung cấp
 * @returns {Promise} Response chứa danh sách vật liệu của nhà cung cấp
 */
export const getMaterialsBySupplier = (supplierId) => api.get(`/material/supplier/${supplierId}`);

/**
 * Lấy danh sách vật liệu có tồn kho thấp
 * @returns {Promise} Response chứa danh sách vật liệu có số lượng tồn kho thấp
 */
export const getLowStockMaterials = () => api.get("/material/low-stock");

/**
 * Lấy danh sách vật liệu yêu cầu bảo quản lạnh
 * @returns {Promise} Response chứa danh sách vật liệu cần bảo quản lạnh
 */
export const getColdStorageMaterials = () => api.get("/material/cold-storage");

/**
 * Tạo mới một vật liệu
 * @param {Object} data - Dữ liệu vật liệu cần tạo theo CreateMaterialRequest
 * @param {string} data.materialCode - Mã vật liệu (bắt buộc, max 50 ký tự)
 * @param {string} data.materialName - Tên vật liệu (bắt buộc, max 255 ký tự)
 * @param {string} [data.shortName] - Tên viết tắt (max 100 ký tự)
 * @param {string} data.materialType - Loại vật liệu (bắt buộc)
 * @param {string} [data.materialForm] - Dạng vật liệu
 * @param {string} [data.activeIngredient] - Thành phần hoạt chất (max 1000 ký tự)
 * @param {number} [data.purityPercentage] - Độ tinh khiết (0-100%)
 * @param {number} [data.iuPerGram] - IU/gram (>= 0)
 * @param {string} [data.color] - Màu sắc (max 50 ký tự)
 * @param {string} [data.odor] - Mùi (max 100 ký tự)
 * @param {number} [data.moistureContent] - Độ ẩm (0-100%)
 * @param {number} [data.viscosity] - Độ nhớt (>= 0)
 * @param {string} data.unitOfMeasure - Đơn vị đo (bắt buộc, max 20 ký tự)
 * @param {string} [data.standardApplied] - Tiêu chuẩn áp dụng (max 500 ký tự)
 * @param {number} data.supplierId - ID nhà cung cấp (bắt buộc, > 0)
 * @param {number} [data.minimumStockLevel] - Mức tồn kho tối thiểu (>= 0)
 * @param {number} [data.currentStock] - Tồn kho hiện tại (>= 0)
 * @param {number} [data.fixedPrice] - Giá cố định (>= 0)
 * @param {boolean} [data.requiresColdStorage] - Yêu cầu bảo quản lạnh
 * @param {string} [data.specialHandling] - Hướng dẫn xử lý đặc biệt (max 1000 ký tự)
 * @param {string} [data.notes] - Ghi chú (max 1000 ký tự)
 * @returns {Promise} Response chứa thông tin vật liệu vừa tạo
 */
export const createMaterial = (data) => api.post("/material", data);

/**
 * Cập nhật thông tin vật liệu
 * @param {number} id - ID của vật liệu cần cập nhật
 * @param {Object} data - Dữ liệu cần cập nhật theo UpdateMaterialRequest
 * @param {string} data.materialCode - Mã vật liệu (bắt buộc, max 50 ký tự)
 * @param {string} data.materialName - Tên vật liệu (bắt buộc, max 255 ký tự)
 * @param {string} [data.shortName] - Tên viết tắt (max 100 ký tự)
 * @param {string} data.materialType - Loại vật liệu (bắt buộc)
 * @param {string} [data.materialForm] - Dạng vật liệu
 * @param {string} [data.activeIngredient] - Thành phần hoạt chất (max 1000 ký tự)
 * @param {number} [data.purityPercentage] - Độ tinh khiết (0-100%)
 * @param {number} [data.iuPerGram] - IU/gram (>= 0)
 * @param {string} [data.color] - Màu sắc (max 50 ký tự)
 * @param {string} [data.odor] - Mùi (max 100 ký tự)
 * @param {number} [data.moistureContent] - Độ ẩm (0-100%)
 * @param {number} [data.viscosity] - Độ nhớt (>= 0)
 * @param {string} data.unitOfMeasure - Đơn vị đo (bắt buộc, max 20 ký tự)
 * @param {string} [data.standardApplied] - Tiêu chuẩn áp dụng (max 500 ký tự)
 * @param {number} data.supplierId - ID nhà cung cấp (bắt buộc, > 0)
 * @param {number} [data.minimumStockLevel] - Mức tồn kho tối thiểu (>= 0)
 * @param {number} [data.currentStock] - Tồn kho hiện tại (>= 0)
 * @param {number} [data.fixedPrice] - Giá cố định (>= 0)
 * @param {boolean} [data.requiresColdStorage] - Yêu cầu bảo quản lạnh
 * @param {string} [data.specialHandling] - Hướng dẫn xử lý đặc biệt (max 1000 ký tự)
 * @param {boolean} data.isActive - Trạng thái hoạt động (bắt buộc)
 * @param {string} [data.notes] - Ghi chú (max 1000 ký tự)
 * @returns {Promise} Response chứa thông tin vật liệu đã cập nhật
 */
export const updateMaterial = (id, data) => api.put(`/material/${id}`, data);

/**
 * Xóa vật liệu theo ID
 * @param {number} id - ID của vật liệu cần xóa
 * @returns {Promise} Response xác nhận xóa thành công
 */
export const deleteMaterial = (id) => api.delete(`/material/${id}`);

/**
 * Xóa nhiều vật liệu theo danh sách ID
 * @param {Array<number>} ids - Mảng các ID vật liệu cần xóa
 * @returns {Promise} Response chứa danh sách vật liệu đã xóa
 */
export const deleteMaterials = (ids) => api.delete("/material/batch", { data: ids });

/**
 * Thay đổi trạng thái hoạt động của vật liệu (active/inactive)
 * @param {number} id - ID của vật liệu cần thay đổi trạng thái
 * @returns {Promise} Response xác nhận thay đổi trạng thái thành công
 */
export const toggleMaterialStatus = (id) => api.patch(`/material/${id}/toggle-status`);

/**
 * Cập nhật số lượng tồn kho của vật liệu
 * @param {number} id - ID của vật liệu
 * @param {number} newStock - Số lượng tồn kho mới
 * @returns {Promise} Response xác nhận cập nhật tồn kho thành công
 */
export const updateMaterialStock = (id, newStock) => api.patch(`/material/${id}/update-stock`, null, { params: { newStock } });

// ============= ADDITIONAL UTILITY SERVICES =============

/**
 * Kiểm tra tính duy nhất của mã vật liệu
 * @param {string} materialCode - Mã vật liệu cần kiểm tra
 * @param {number} [excludeId] - ID vật liệu loại trừ khi update
 * @returns {Promise} Response xác nhận mã có khả dụng hay không
 */
export const checkMaterialCodeAvailability = (materialCode, excludeId = null) => {
  const params = { materialCode }
  if (excludeId) params.excludeId = excludeId
  return api.get("/material/check-code", { params })
};

/**
 * Lấy danh sách vật liệu với thông tin cơ bản (để dùng cho dropdown/select)
 * @param {Object} params - Tham số lọc
 * @param {boolean} [params.activeOnly=true] - Chỉ lấy vật liệu đang hoạt động
 * @param {string} [params.search] - Từ khóa tìm kiếm
 * @param {number} [params.limit=100] - Giới hạn số lượng
 * @returns {Promise} Response chứa danh sách vật liệu cơ bản
 */
export const getMaterialsBasic = (params = {}) => {
  const defaultParams = { activeOnly: true, limit: 100, ...params }
  return api.get("/material/basic", { params: defaultParams })
};

/**
 * Lấy thống kê tổng quan về vật liệu
 * @returns {Promise} Response chứa thống kê: tổng số, đang hoạt động, tồn kho thấp, bảo quản lạnh
 */
export const getMaterialStats = () => api.get("/material/stats");

/**
 * Xuất danh sách vật liệu ra file Excel
 * @param {Object} filters - Bộ lọc giống getMaterials
 * @returns {Promise} Response chứa file Excel
 */
export const exportMaterials = (filters = {}) => {
  return api.get("/material/export", { 
    params: filters,
    responseType: 'blob'
  })
};

/**
 * Nhập vật liệu từ file Excel
 * @param {File} file - File Excel chứa dữ liệu vật liệu
 * @param {boolean} [validateOnly=false] - Chỉ validate không import
 * @returns {Promise} Response kết quả import
 */
export const importMaterials = (file, validateOnly = false) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('validateOnly', validateOnly)
  
  return api.post("/material/import", formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

/**
 * Tải template Excel để import vật liệu
 * @returns {Promise} Response chứa file template Excel
 */
export const downloadImportTemplate = () => {
  return api.get("/material/import-template", {
    responseType: 'blob'
  })
};

/**
 * Lấy lịch sử thay đổi của một vật liệu
 * @param {number} id - ID của vật liệu
 * @param {Object} params - Tham số phân trang
 * @param {number} [params.page=0] - Số trang
 * @param {number} [params.size=20] - Kích thước trang
 * @returns {Promise} Response chứa lịch sử thay đổi
 */
export const getMaterialHistory = (id, params = {}) => {
  return api.get(`/material/${id}/history`, { params })
};

/**
 * Sao chép vật liệu (tạo bản copy)
 * @param {number} id - ID vật liệu gốc
 * @param {Object} overrides - Dữ liệu ghi đè (materialCode, materialName là bắt buộc)
 * @returns {Promise} Response chứa vật liệu mới được tạo
 */
export const duplicateMaterial = (id, overrides = {}) => {
  return api.post(`/material/${id}/duplicate`, overrides)
};

/**
 * Cập nhật hàng loạt thông tin vật liệu
 * @param {Object} updateData - Dữ liệu cập nhật
 * @param {Array<number>} updateData.ids - Danh sách ID vật liệu
 * @param {Object} updateData.data - Dữ liệu cần cập nhật
 * @returns {Promise} Response kết quả cập nhật hàng loạt
 */
export const bulkUpdateMaterials = (updateData) => {
  return api.patch("/material/bulk-update", updateData)
};

/**
 * Kiểm tra vật liệu có đang được sử dụng không (trước khi xóa)
 * @param {number} id - ID của vật liệu
 * @returns {Promise} Response thông tin sử dụng vật liệu
 */
export const checkMaterialUsage = (id) => {
  return api.get(`/material/${id}/usage`)
};
