import api from "@/services/axios";

/**
 * =====================================================
 * SUPPLIER SERVICE - API ENDPOINTS
 * =====================================================
 * 
 * Module quản lý các API calls liên quan đến nhà cung cấp
 * Tất cả endpoints đều sử dụng base URL: /suppliers
 * 
 * @author [Do Phuc Lam]
 * @version 1.0.0
 * @since 2025-09-06
 */

/**
 * Lấy danh sách nhà cung cấp với phân trang và filter
 * 
 * @param {Object} params - Các tham số filter và phân trang
 * @param {number} params.start - Vị trí bắt đầu (pagination)
 * @param {number} params.limit - Số lượng records trả về
 * @param {string} params.keywords - Từ khóa tìm kiếm (supplierName, supplierCode, manufacturerName)
 * @param {boolean} params.isActive - Trạng thái hoạt động (true/false)
 * @param {string} params.countryOfOrigin - Quốc gia xuất xứ
 * @param {string} params.gmpExpiryFromDate - Ngày bắt đầu hết hạn GMP (YYYY-MM-DD)
 * @param {string} params.gmpExpiryToDate - Ngày kết thúc hết hạn GMP (YYYY-MM-DD)
 * @param {string} params.sortField - Field để sort (id, supplierCode, supplierName, etc.)
 * @param {string} params.sortType - Kiểu sort (asc/desc)
 * 
 * @returns {Promise} Response với format: { success: true, data: { total: number, items: Array } }
 * 
 * @example
 * // Lấy 10 suppliers đầu tiên
 * getSuppliers({ start: 0, limit: 10 })
 * 
 * // Tìm kiếm suppliers theo keyword
 * getSuppliers({ keywords: "Dược phẩm", start: 0, limit: 10 })
 * 
 * // Lọc suppliers đang hoạt động
 * getSuppliers({ isActive: true, start: 0, limit: 10 })
 */
export const getSuppliers = (params = {}) => {
  const queryString = new URLSearchParams(params).toString()
  return api.get(`/suppliers${queryString ? `?${queryString}` : ''}`)
}

/**
 * Lấy thông tin chi tiết nhà cung cấp theo ID
 * 
 * @param {number|string} id - ID của nhà cung cấp
 * @returns {Promise} Response trả về SupplierDto trực tiếp (không có wrapper)
 * 
 * @example
 * getSupplierById(123)
 */
export const getSupplierById = (id) => api.get(`/suppliers/${id}`);

/**
 * Lấy thông tin nhà cung cấp theo mã code
 * 
 * @param {string} code - Mã nhà cung cấp (supplierCode)
 * @returns {Promise} Response trả về SupplierDto
 * 
 * @example
 * getSupplierByCode("SUPP-20250906-001")
 */
export const getSupplierByCode = (code) => api.get(`/suppliers/code/${code}`);

/**
 * Lấy danh sách nhà cung cấp theo quốc gia
 * 
 * @param {string} country - Tên quốc gia
 * @returns {Promise} Response trả về Array<SupplierDto>
 * 
 * @example
 * getSuppliersByCountry("Việt Nam")
 */
export const getSuppliersByCountry = (country) => api.get(`/suppliers/country/${country}`);

/**
 * Lấy danh sách các nhà cung cấp đang hoạt động
 * 
 * @returns {Promise} Response trả về Array<SupplierDto> với isActive = true
 * 
 * @example
 * getActiveSuppliers()
 */
export const getActiveSuppliers = () => api.get("/suppliers/active");

/**
 * Lấy danh sách nhà cung cấp có chứng chỉ GMP đã hết hạn
 * 
 * @returns {Promise} Response trả về Array<SupplierDto> với gmpExpiryDate < current date
 * 
 * @example
 * getExpiredGmpSuppliers()
 */
export const getExpiredGmpSuppliers = () => api.get("/suppliers/gmp/expired");

/**
 * Lấy danh sách nhà cung cấp có chứng chỉ GMP sắp hết hạn
 * 
 * @param {number} days - Số ngày trước khi hết hạn (mặc định 30 ngày)
 * @returns {Promise} Response trả về Array<SupplierDto> với gmpExpiryDate trong [now, now + days]
 * 
 * @example
 * // Lấy suppliers có GMP hết hạn trong 30 ngày
 * getExpiringGmpSuppliers(30)
 * 
 * // Lấy suppliers có GMP hết hạn trong 7 ngày
 * getExpiringGmpSuppliers(7)
 */
export const getExpiringGmpSuppliers = (days) => api.get(`/suppliers/gmp/expiring/${days}`);

/**
 * =====================================================
 * CRUD OPERATIONS
 * =====================================================
 */

/**
 * Tạo mới nhà cung cấp
 * 
 * @param {Object} data - Dữ liệu nhà cung cấp mới
 * @param {string} data.supplierCode - Mã nhà cung cấp (required, max 50 chars)
 * @param {string} data.supplierName - Tên nhà cung cấp (required, max 255 chars)
 * @param {string} [data.manufacturerName] - Tên nhà sản xuất (max 255 chars)
 * @param {string} [data.distributorName] - Tên nhà phân phối (max 255 chars)
 * @param {string} [data.address] - Địa chỉ
 * @param {string} [data.registrationNumber] - Số đăng ký kinh doanh (max 100 chars)
 * @param {string} [data.phone] - Số điện thoại (pattern: ^[0-9+\-\s()]+$, max 20 chars)
 * @param {string} [data.email] - Email (valid email format, max 100 chars)
 * @param {string} [data.contactPerson] - Tên người liên hệ (max 255 chars)
 * @param {string} [data.gmpCertificate] - Chứng chỉ GMP (max 100 chars)
 * @param {string} [data.gmpExpiryDate] - Ngày hết hạn GMP (YYYY-MM-DD, future date)
 * @param {string} [data.countryOfOrigin] - Quốc gia xuất xứ (max 100 chars)
 * @param {string} [data.notes] - Ghi chú
 * 
 * @returns {Promise} Response trả về SupplierDto đã tạo
 * 
 * @example
 * createSupplier({
 *   supplierCode: "SUPP-001",
 *   supplierName: "Công ty ABC",
 *   email: "contact@abc.com",
 *   phone: "+84123456789"
 * })
 */
export const createSupplier = (data) => api.post("/suppliers", data);

/**
 * Cập nhật thông tin nhà cung cấp
 * 
 * @param {number|string} id - ID của nhà cung cấp cần cập nhật  
 * @param {Object} data - Dữ liệu cập nhật (same format as createSupplier + id field)
 * @param {number} data.id - ID nhà cung cấp (required, min 1)
 * @param {boolean} data.isActive - Trạng thái hoạt động (required for update)
 * 
 * @returns {Promise} Response trả về SupplierDto đã cập nhật
 * 
 * @example
 * updateSupplier(123, {
 *   id: 123,
 *   supplierCode: "SUPP-001", 
 *   supplierName: "Công ty ABC Updated",
 *   isActive: true
 * })
 */
export const updateSupplier = (id, data) => api.put(`/suppliers`, data);

/**
 * Tạo nhiều nhà cung cấp cùng lúc (bulk create)
 * 
 * @param {Array<Object>} data - Mảng các object nhà cung cấp
 * @returns {Promise} Response trả về Array<SupplierDto> đã tạo
 * 
 * @example
 * bulkCreateSuppliers([
 *   { supplierCode: "SUPP-001", supplierName: "Công ty A" },
 *   { supplierCode: "SUPP-002", supplierName: "Công ty B" }
 * ])
 */
export const bulkCreateSuppliers = (data) => api.post("/suppliers/bulk", data);

/**
 * Chuyển đổi trạng thái hoạt động của nhà cung cấp (active <-> inactive)
 * 
 * @param {number|string} id - ID của nhà cung cấp
 * @returns {Promise} Response trả về message thành công
 * 
 * @example
 * toggleSupplierStatus(123)
 */
export const toggleSupplierStatus = (id) => api.put(`/suppliers/${id}/toggle-status`);
