/**
 * Material Type Enum - Loại vật liệu
 */
export const MATERIAL_TYPES = {
  NGUYEN_LIEU: { value: 'NGUYEN_LIEU', label: 'Nguyên liệu' },
  PHU_LIEU: { value: 'PHU_LIEU', label: 'Phụ liệu' },
  BAO_BI: { value: 'BAO_BI', label: 'Bao bì' },
  VAT_TU_TIEU_HAO: { value: 'VAT_TU_TIEU_HAO', label: 'Vật tư tiêu hao' },
  DUNG_MOI: { value: 'DUNG_MOI', label: 'Dung môi' },
  KHAC: { value: 'KHAC', label: 'Khác' }
}

/**
 * Material Form Enum - Dạng vật liệu
 */
export const MATERIAL_FORMS = {
  BOT: { value: 'BOT', label: 'Bột' },
  LONG: { value: 'LONG', label: 'Lỏng' },
  HAT: { value: 'HAT', label: 'Hạt' },
  VIEN: { value: 'VIEN', label: 'Viên' },
  BAO_PHIM: { value: 'BAO_PHIM', label: 'Bao phim' },
  KHAC: { value: 'KHAC', label: 'Khác' }
}

/**
 * Sort Options - Tùy chọn sắp xếp
 */
export const SORT_OPTIONS = [
  { value: 'materialName', label: 'Tên vật liệu' },
  { value: 'materialCode', label: 'Mã vật liệu' },
  { value: 'materialType', label: 'Loại vật liệu' },
  { value: 'currentStock', label: 'Tồn kho' },
  { value: 'fixedPrice', label: 'Giá' },
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
  limitOptions: [5, 10, 20, 50]
}

/**
 * Utility functions
 */
export const getMaterialTypeLabel = (value) => {
  return Object.values(MATERIAL_TYPES).find(type => type.value === value)?.label || value
}

export const getMaterialFormLabel = (value) => {
  return Object.values(MATERIAL_FORMS).find(form => form.value === value)?.label || value
}

export const getMaterialTypesOptions = () => {
  return Object.values(MATERIAL_TYPES)
}

export const getMaterialFormsOptions = () => {
  return Object.values(MATERIAL_FORMS)
}
