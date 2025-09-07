import api from "@/services/axios";

/**
 * =====================================================
 * MATERIAL TRANSACTION SERVICE
 * =====================================================
 * 
 * Dịch vụ quản lý các giao dịch vật liệu trong hệ thống quản lý thú y
 * Bao gồm các chức năng: tạo, đọc, cập nhật, xóa và phê duyệt giao dịch vật liệu
 * 
 * Các loại giao dịch hỗ trợ:
 * - IMPORT: Nhập kho
 * - EXPORT: Xuất kho  
 * - TRANSFER: Chuyển kho
 * - ADJUSTMENT: Điều chỉnh tồn kho
 * 
 * @author Veterinary Management System
 * @version 1.0.0
 */

// =====================================================
// READ OPERATIONS (GET)
// =====================================================

/**
 * Lấy danh sách tất cả giao dịch vật liệu với phân trang và bộ lọc
 * 
 * @description Endpoint tương ứng: GET /material-transactions
 * @param {Object} params - Tham số query cho việc phân trang và bộ lọc
 * @param {number} [params.start=0] - Vị trí bắt đầu (offset) cho phân trang
 * @param {number} [params.limit=10] - Số lượng bản ghi trả về tối đa
 * @param {string} [params.search] - Từ khóa tìm kiếm
 * @param {string} [params.transactionType] - Loại giao dịch để lọc
 * @param {string} [params.status] - Trạng thái giao dịch để lọc
 * @param {number} [params.warehouseId] - ID kho để lọc
 * @param {number} [params.materialBatchId] - ID batch để lọc
 * @param {string} [params.sortBy] - Trường để sắp xếp
 * @param {string} [params.sortOrder] - Thứ tự sắp xếp (asc/desc)
 * 
 * @returns {Promise<Object>} Promise resolve với object chứa:
 * - data: Array các MaterialTransactionDto
 * - totalElements: Tổng số bản ghi
 * - totalPages: Tổng số trang
 * - currentPage: Trang hiện tại
 * 
 * @example
 * // Lấy trang đầu tiên với 20 bản ghi
 * const response = await getTransactions({
 *   start: 0,
 *   limit: 20,
 *   transactionType: 'IMPORT',
 *   warehouseId: 1
 * });
 */
export const getTransactions = (params = {}) => {
  return api.get("/material-transactions", { params });
};

/**
 * Lấy thông tin chi tiết của một giao dịch vật liệu theo ID
 * 
 * @description Endpoint tương ứng: GET /material-transactions/{id}
 * @param {number|string} id - ID của giao dịch vật liệu
 * 
 * @returns {Promise<Object>} Promise resolve với MaterialTransactionDto chứa:
 * - id: ID giao dịch
 * - materialBatch: Thông tin lô hàng
 * - transactionType: Loại giao dịch
 * - quantity: Số lượng
 * - warehouse: Thông tin kho
 * - createdBy: Người tạo
 * - approvedBy: Người phê duyệt
 * - description: Mô tả
 * - transactionDate: Ngày giao dịch
 * - status: Trạng thái
 * 
 * @throws {Error} Throw error nếu không tìm thấy giao dịch
 * 
 * @example
 * const transaction = await getTransactionById(123);
 * console.log(transaction.transactionType); // 'IMPORT'
 */
export const getTransactionById = (id) => {
  return api.get(`/material-transactions/${id}`);
};

/**
 * Lấy danh sách giao dịch vật liệu theo batch/lô hàng cụ thể
 * 
 * @description Endpoint tương ứng: GET /material-transactions/batch/{materialBatchId}
 * @param {number|string} batchId - ID của lô hàng vật liệu (material batch)
 * 
 * @returns {Promise<Array>} Promise resolve với array các MaterialTransactionDto
 * 
 * @example
 * const transactions = await getTransactionsByBatch(456);
 * transactions.forEach(tx => console.log(tx.transactionType));
 */
export const getTransactionsByBatch = (batchId) => {
  return api.get(`/material-transactions/batch/${batchId}`);
};

/**
 * Lấy danh sách giao dịch vật liệu theo loại giao dịch
 * 
 * @description Endpoint tương ứng: GET /material-transactions/type/{transactionType}
 * @param {string} transactionType - Loại giao dịch (IMPORT|EXPORT|TRANSFER|ADJUSTMENT)
 * 
 * @returns {Promise<Array>} Promise resolve với array các MaterialTransactionDto
 * 
 * @example
 * const importTransactions = await getTransactionsByType('IMPORT');
 */
export const getTransactionsByType = (transactionType) => {
  return api.get(`/material-transactions/type/${transactionType}`);
};

/**
 * Lấy danh sách giao dịch vật liệu trong khoảng thời gian cụ thể
 * 
 * @description Endpoint tương ứng: GET /material-transactions/date-range
 * @param {Object} params - Tham số thời gian
 * @param {string} params.startDate - Ngày bắt đầu (ISO format: YYYY-MM-DDTHH:mm:ss)
 * @param {string} params.endDate - Ngày kết thúc (ISO format: YYYY-MM-DDTHH:mm:ss)
 * 
 * @returns {Promise<Array>} Promise resolve với array các MaterialTransactionDto
 * 
 * @example
 * const transactions = await getTransactionsByDateRange({
 *   startDate: '2024-01-01T00:00:00',
 *   endDate: '2024-01-31T23:59:59'
 * });
 */
export const getTransactionsByDateRange = (params) => {
  return api.get("/material-transactions/date-range", { params });
};

/**
 * Lấy danh sách giao dịch của một kho cụ thể trong khoảng thời gian
 * 
 * @description Endpoint tương ứng: GET /material-transactions/warehouse/{warehouseId}/date-range
 * @param {number|string} warehouseId - ID của kho
 * @param {Object} params - Tham số thời gian
 * @param {string} params.startDate - Ngày bắt đầu (ISO format)
 * @param {string} params.endDate - Ngày kết thúc (ISO format)
 * 
 * @returns {Promise<Array>} Promise resolve với array các MaterialTransactionDto
 * 
 * @example
 * const warehouseTransactions = await getTransactionsByWarehouseAndDate(1, {
 *   startDate: '2024-01-01T00:00:00',
 *   endDate: '2024-01-31T23:59:59'
 * });
 */
export const getTransactionsByWarehouseAndDate = (warehouseId, params) => {
  return api.get(`/material-transactions/warehouse/${warehouseId}/date-range`, { params });
};

/**
 * Lấy tổng số lượng theo batch và loại giao dịch
 * 
 * @description Endpoint tương ứng: GET /material-transactions/batch/{materialBatchId}/quantity/{transactionType}
 * @param {number|string} materialBatchId - ID của lô hàng vật liệu
 * @param {string} transactionType - Loại giao dịch
 * 
 * @returns {Promise<number>} Promise resolve với tổng số lượng (Double)
 * 
 * @example
 * const totalImported = await getTotalQuantityByBatchAndType(123, 'IMPORT');
 * console.log(`Đã nhập tổng cộng: ${totalImported} đơn vị`);
 */
export const getTotalQuantityByBatchAndType = (materialBatchId, transactionType) => {
  return api.get(`/material-transactions/batch/${materialBatchId}/quantity/${transactionType}`);
};

// =====================================================
// WRITE OPERATIONS (POST/PUT)
// =====================================================

/**
 * Tạo một giao dịch vật liệu mới
 * 
 * @description Endpoint tương ứng: POST /material-transactions
 * @param {Object} data - Dữ liệu giao dịch mới (CreateMaterialTransactionRequest)
 * @param {number} data.materialBatchId - ID của lô hàng vật liệu (bắt buộc)
 * @param {string} data.transactionType - Loại giao dịch (IMPORT|EXPORT|TRANSFER|ADJUSTMENT) (bắt buộc)
 * @param {number} data.quantity - Số lượng giao dịch (bắt buộc, > 0)
 * @param {number} data.warehouseId - ID của kho (bắt buộc)
 * @param {string} [data.description] - Mô tả giao dịch
 * @param {number} [data.destinationWarehouseId] - ID kho đích (dành cho TRANSFER)
 * @param {string} [data.reason] - Lý do giao dịch
 * @param {number} [data.createdById] - ID người tạo
 * 
 * @returns {Promise<Object>} Promise resolve với MaterialTransactionDto đã tạo
 * 
 * @throws {Error} Throw validation error nếu dữ liệu không hợp lệ
 * 
 * @example
 * const newTransaction = await createTransaction({
 *   materialBatchId: 123,
 *   transactionType: 'IMPORT',
 *   quantity: 100,
 *   warehouseId: 1,
 *   description: 'Nhập hàng từ nhà cung cấp ABC',
 *   createdById: 1
 * });
 */
export const createTransaction = (data) => {
  return api.post("/material-transactions", data);
};

/**
 * Cập nhật thông tin giao dịch vật liệu
 * 
 * @description Endpoint tương ứng: PUT /material-transactions/{id}
 * @param {number|string} id - ID của giao dịch cần cập nhật
 * @param {Object} data - Dữ liệu cập nhật (UpdateMaterialTransactionRequest)
 * @param {number} [data.quantity] - Số lượng giao dịch mới
 * @param {string} [data.description] - Mô tả mới
 * @param {string} [data.reason] - Lý do cập nhật
 * @param {number} [data.updatedById] - ID người cập nhật
 * 
 * @returns {Promise<Object>} Promise resolve với MaterialTransactionDto đã cập nhật
 * 
 * @throws {Error} Throw error nếu giao dịch không tồn tại hoặc không thể cập nhật
 * 
 * @example
 * const updatedTransaction = await updateTransaction(123, {
 *   quantity: 150,
 *   description: 'Cập nhật số lượng sau kiểm kê',
 *   updatedById: 1
 * });
 */
export const updateTransaction = (id, data) => {
  return api.put(`/material-transactions/${id}`, data);
};

/**
 * Phê duyệt giao dịch vật liệu
 * 
 * @description Endpoint tương ứng: PUT /material-transactions/{id}/approve
 * @param {number|string} id - ID của giao dịch cần phê duyệt
 * @param {number} approvedById - ID của người phê duyệt (truyền qua query param)
 * 
 * @returns {Promise<string>} Promise resolve với thông báo phê duyệt thành công
 * 
 * @throws {Error} Throw error nếu giao dịch không tồn tại hoặc đã được phê duyệt
 * 
 * @example
 * await approveTransaction(123, 1);
 * // Hoặc với params object
 * await approveTransaction(123, { approvedById: 1 });
 */
export const approveTransaction = (id, approvedByIdOrParams) => {
  // Xử lý tham số linh hoạt: có thể truyền trực tiếp ID hoặc object params
  const params = typeof approvedByIdOrParams === 'object' 
    ? approvedByIdOrParams 
    : { approvedById: approvedByIdOrParams };
    
  return api.put(`/material-transactions/${id}/approve`, null, { params });
};

// =====================================================
// DELETE OPERATIONS
// =====================================================

/**
 * Xóa một giao dịch vật liệu theo ID
 * 
 * @description Endpoint tương ứng: DELETE /material-transactions/{id}
 * @param {number|string} id - ID của giao dịch cần xóa
 * 
 * @returns {Promise<string>} Promise resolve với thông báo xóa thành công
 * 
 * @throws {Error} Throw error nếu giao dịch không tồn tại hoặc không thể xóa
 * 
 * @example
 * await deleteTransaction(123);
 */
export const deleteTransaction = (id) => {
  return api.delete(`/material-transactions/${id}`);
};

/**
 * Xóa nhiều giao dịch vật liệu theo danh sách ID
 * 
 * @description Endpoint tương ứng: DELETE /material-transactions/batch
 * @param {Array<number>} ids - Mảng chứa các ID của giao dịch cần xóa
 * 
 * @returns {Promise<Array>} Promise resolve với array các MaterialTransactionDto đã xóa
 * 
 * @throws {Error} Throw error nếu một hoặc nhiều giao dịch không thể xóa
 * 
 * @example
 * const deletedTransactions = await deleteMultipleTransactions([123, 456, 789]);
 * console.log(`Đã xóa ${deletedTransactions.length} giao dịch`);
 */
export const deleteMultipleTransactions = (ids) => {
  return api.delete("/material-transactions/batch", { data: ids });
};

// =====================================================
// UTILITY FUNCTIONS & CONSTANTS
// =====================================================

/**
 * Enum các loại giao dịch vật liệu
 */
export const TRANSACTION_TYPES = {
  IMPORT: 'IMPORT',
  EXPORT: 'EXPORT', 
  TRANSFER: 'TRANSFER',
  ADJUSTMENT: 'ADJUSTMENT'
};

/**
 * Enum các trạng thái giao dịch
 */
export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

/**
 * Mapping hiển thị loại giao dịch tiếng Việt
 */
export const TRANSACTION_TYPE_LABELS = {
  [TRANSACTION_TYPES.IMPORT]: 'Nhập kho',
  [TRANSACTION_TYPES.EXPORT]: 'Xuất kho',
  [TRANSACTION_TYPES.TRANSFER]: 'Chuyển kho',
  [TRANSACTION_TYPES.ADJUSTMENT]: 'Điều chỉnh'
};

/**
 * Mapping hiển thị trạng thái tiếng Việt
 */
export const TRANSACTION_STATUS_LABELS = {
  [TRANSACTION_STATUS.PENDING]: 'Chờ phê duyệt',
  [TRANSACTION_STATUS.APPROVED]: 'Đã phê duyệt',
  [TRANSACTION_STATUS.REJECTED]: 'Từ chối',
  [TRANSACTION_STATUS.CANCELLED]: 'Đã hủy'
};

/**
 * Default export object chứa tất cả functions
 */
export default {
  // Read operations
  getTransactions,
  getTransactionById,
  getTransactionsByBatch,
  getTransactionsByType,
  getTransactionsByDateRange,
  getTransactionsByWarehouseAndDate,
  getTotalQuantityByBatchAndType,
  
  // Write operations
  createTransaction,
  updateTransaction,
  approveTransaction,
  
  // Delete operations
  deleteTransaction,
  deleteMultipleTransactions,
  
  // Constants
  TRANSACTION_TYPES,
  TRANSACTION_STATUS,
  TRANSACTION_TYPE_LABELS,
  TRANSACTION_STATUS_LABELS
};
