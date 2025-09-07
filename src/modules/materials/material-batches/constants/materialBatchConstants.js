/**
 * Material Batch Constants
 * 
 * Contains all constants used in the material batch module including
 * enums, status values, pagination defaults, and validation rules.
 */

/**
 * Test Status Enum - Trạng thái kiểm tra
 */
export const TEST_STATUS = {
  CHUA_KIEM_NGHIEM: { value: 'CHUA_KIEM_NGHIEM', label: 'Chưa kiểm nghiệm', color: 'warning' },
  DANG_KIEM_NGHIEM: { value: 'DANG_KIEM_NGHIEM', label: 'Đang kiểm nghiệm', color: 'info' },
  DAT_TIEU_CHUAN: { value: 'DAT_TIEU_CHUAN', label: 'Đạt tiêu chuẩn', color: 'success' },
  DAT: { value: 'DAT', label: 'Đạt tiêu chuẩn', color: 'success' }, // API compatibility
  KHONG_DAT_TIEU_CHUAN: { value: 'KHONG_DAT_TIEU_CHUAN', label: 'Không đạt tiêu chuẩn', color: 'danger' },
  KHONG_DAT: { value: 'KHONG_DAT', label: 'Không đạt tiêu chuẩn', color: 'danger' }, // API compatibility
  CAN_KIEM_NGHIEM_LAI: { value: 'CAN_KIEM_NGHIEM_LAI', label: 'Cần kiểm nghiệm lại', color: 'warning' }
}

/**
 * Usage Status Enum - Trạng thái sử dụng
 */
export const USAGE_STATUS = {
  CHUA_SU_DUNG: { value: 'CHUA_SU_DUNG', label: 'Chưa sử dụng', color: 'secondary' },
  SAN_SANG_SU_DUNG: { value: 'SAN_SANG_SU_DUNG', label: 'Sẵn sàng sử dụng', color: 'success' },
  DANG_SU_DUNG: { value: 'DANG_SU_DUNG', label: 'Đang sử dụng', color: 'info' },
  DA_SU_DUNG_HET: { value: 'DA_SU_DUNG_HET', label: 'Đã sử dụng hết', color: 'secondary' },
  BI_LOI: { value: 'BI_LOI', label: 'Bị lỗi', color: 'danger' },
  HET_HAN: { value: 'HET_HAN', label: 'Hết hạn', color: 'danger' },
  BI_HUY: { value: 'BI_HUY', label: 'Bị hủy', color: 'secondary' },
  // Additional statuses for compatibility
  DA_HET: { value: 'DA_HET', label: 'Đã hết', color: 'secondary' },
  HONG: { value: 'HONG', label: 'Hỏng', color: 'danger' }
}

/**
 * Material Type Labels - Nhãn loại vật liệu
 */
export const MATERIAL_TYPE_LABELS = {
  NGUYEN_LIEU: 'Nguyên liệu',
  PHU_LIEU: 'Phụ liệu',
  BAO_BI: 'Bao bì',
  VAT_TU_TIEU_HAO: 'Vật tư tiêu hao',
  DUNG_MOI: 'Dung môi',
  KHAC: 'Khác'
}

/**
 * Material Form Labels - Nhãn dạng vật liệu
 */
export const MATERIAL_FORM_LABELS = {
  BOT: 'Bột',
  LONG: 'Lỏng', 
  HAT: 'Hạt',
  VIEN: 'Viên',
  BAO_PHIM: 'Bao phim',
  KHAC: 'Khác'
}

/**
 * Test Status Labels for display
 */
export const TEST_STATUS_LABELS = {
  CHUA_KIEM_NGHIEM: 'Chưa kiểm nghiệm',
  DANG_KIEM_NGHIEM: 'Đang kiểm nghiệm',
  DAT_TIEU_CHUAN: 'Đạt tiêu chuẩn',
  DAT: 'Đạt tiêu chuẩn', // API compatibility
  KHONG_DAT_TIEU_CHUAN: 'Không đạt tiêu chuẩn',
  KHONG_DAT: 'Không đạt tiêu chuẩn', // API compatibility
  CAN_KIEM_NGHIEM_LAI: 'Cần kiểm nghiệm lại'
}

/**
 * Usage Status Labels for display
 */
export const USAGE_STATUS_LABELS = {
  CHUA_SU_DUNG: 'Chưa sử dụng',
  SAN_SANG_SU_DUNG: 'Sẵn sàng sử dụng',
  DANG_SU_DUNG: 'Đang sử dụng',
  DA_SU_DUNG_HET: 'Đã sử dụng hết',
  BI_LOI: 'Bị lỗi',
  HET_HAN: 'Hết hạn',
  BI_HUY: 'Bị hủy',
  DA_HET: 'Đã hết',
  HONG: 'Hỏng'
}

/**
 * Batch Status Enum - Trạng thái lô
 */
export const BATCH_STATUS = {
  ACTIVE: { value: 'ACTIVE', label: 'Hoạt động', color: 'success' },
  INACTIVE: { value: 'INACTIVE', label: 'Không hoạt động', color: 'secondary' },
  EXPIRED: { value: 'EXPIRED', label: 'Hết hạn', color: 'danger' },
  NEAR_EXPIRY: { value: 'NEAR_EXPIRY', label: 'Sắp hết hạn', color: 'warning' }
}

/**
 * Sort Options - Tùy chọn sắp xếp
 */
export const SORT_OPTIONS = [
  { value: 'batchNumber', label: 'Số lô' },
  { value: 'internalCode', label: 'Mã nội bộ' },
  { value: 'materialName', label: 'Tên vật liệu' },
  { value: 'quantity', label: 'Số lượng' },
  { value: 'manufactureDate', label: 'Ngày sản xuất' },
  { value: 'expiryDate', label: 'Ngày hết hạn' },
  { value: 'testStatus', label: 'Trạng thái kiểm tra' },
  { value: 'usageStatus', label: 'Trạng thái sử dụng' },
  { value: 'id', label: 'Mới nhất' }
]

/**
 * Sort Types - Kiểu sắp xếp
 */
export const SORT_TYPES = {
  ASC: { value: 'asc', label: 'Tăng dần' },
  DESC: { value: 'desc', label: 'Giảm dần' }
}

/**
 * Default pagination settings
 */
export const PAGINATION_DEFAULTS = {
  start: 0,
  limit: 10,
  maxLimit: 100
}

/**
 * Date Range Presets for filtering
 */
export const DATE_RANGE_PRESETS = {
  TODAY: { value: 'today', label: 'Hôm nay' },
  YESTERDAY: { value: 'yesterday', label: 'Hôm qua' },
  THIS_WEEK: { value: 'thisWeek', label: 'Tuần này' },
  LAST_WEEK: { value: 'lastWeek', label: 'Tuần trước' },
  THIS_MONTH: { value: 'thisMonth', label: 'Tháng này' },
  LAST_MONTH: { value: 'lastMonth', label: 'Tháng trước' },
  THIS_QUARTER: { value: 'thisQuarter', label: 'Quý này' },
  THIS_YEAR: { value: 'thisYear', label: 'Năm này' },
  CUSTOM: { value: 'custom', label: 'Tùy chỉnh' }
}

/**
 * Expiry Alert Thresholds (in days)
 */
export const EXPIRY_ALERT_THRESHOLDS = {
  CRITICAL: 7,    // 7 days - Critical alert
  WARNING: 30,    // 30 days - Warning alert
  NOTICE: 90      // 90 days - Notice alert
}

/**
 * Stock Alert Thresholds
 */
export const STOCK_ALERT_THRESHOLDS = {
  LOW_STOCK_PERCENTAGE: 20,     // 20% of total quantity
  CRITICAL_STOCK_PERCENTAGE: 5  // 5% of total quantity
}

/**
 * Validation Rules
 */
export const VALIDATION_RULES = {
  BATCH_NUMBER: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[A-Z0-9\-_]+$/i // Alphanumeric, hyphens, underscores
  },
  INTERNAL_CODE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 50,
    PATTERN: /^[A-Z0-9\-_]+$/i
  },
  QUANTITY: {
    MIN: 0,
    MAX: 999999999,
    DECIMAL_PLACES: 3
  },
  PRICE: {
    MIN: 0,
    MAX: 999999999,
    DECIMAL_PLACES: 2
  },
  NOTES: {
    MAX_LENGTH: 1000
  }
}

/**
 * File Upload Constants
 */
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
}

/**
 * API Constants
 */
export const API_CONSTANTS = {
  BASE_URL: '/material-batches',
  ENDPOINTS: {
    LIST: '',
    CREATE: '',
    UPDATE: '/{id}',
    DELETE: '/{id}',
    DELETE_MULTIPLE: '/batch',
    GET_BY_ID: '/{id}',
    GET_BY_BATCH_NUMBER: '/batch-number/{batchNumber}',
    GET_BY_INTERNAL_CODE: '/internal-code/{internalCode}',
    GET_BY_MATERIAL: '/by-material/{materialId}',
    GET_BY_LOCATION: '/by-location/{locationId}',
    UPDATE_QUANTITY: '/{id}/quantity',
    UPDATE_TEST_STATUS: '/{id}/test-status',
    UPDATE_USAGE_STATUS: '/{id}/usage-status',
    FIFO_BATCHES: '/fifo/{materialId}',
    EXPIRY_ALERTS: '/expiry-alerts',
    STOCK_ALERTS: '/stock-alerts'
  }
}

/**
 * Table Column Configurations
 */
export const TABLE_COLUMNS = {
  DEFAULT: [
    'select',
    'batchNumber',
    'internalCode',
    'materialName',
    'quantity',
    'unit',
    'expiryDate',
    'testStatus',
    'usageStatus',
    'actions'
  ],
  COMPACT: [
    'select',
    'batchNumber',
    'materialName',
    'quantity',
    'expiryDate',
    'testStatus',
    'actions'
  ],
  DETAILED: [
    'select',
    'batchNumber',
    'internalCode',
    'materialName',
    'materialType',
    'quantity',
    'unit',
    'manufactureDate',
    'expiryDate',
    'location',
    'testStatus',
    'usageStatus',
    'lastUpdated',
    'actions'
  ]
}

/**
 * Default Filter Values
 */
export const DEFAULT_FILTERS = {
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