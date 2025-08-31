export const ROLES = {
  // Quản trị viên hệ thống
  ADMIN: 'ADMIN',
  
  // Quản lý kho - quản lý nguyên liệu, vật liệu, nhập xuất tồn
  WAREHOUSE_MANAGER: 'WAREHOUSE_MANAGER',
  
  // Quản lý sản xuất - tạo lệnh sản xuất, quản lý dây chuyền
  PRODUCTION_MANAGER: 'PRODUCTION_MANAGER',
  
  // Nhân viên QC - kiểm nghiệm nguyên liệu và thành phẩm
  QC_STAFF: 'QC_STAFF',
  
  // Công nhân vận hành - thực hiện sản xuất, ghi nhận hồ sơ lô
  OPERATOR: 'OPERATOR',
  
  // Nhân viên bảo trì - quản lý máy móc, sửa chữa thiết bị
  MAINTENANCE_STAFF: 'MAINTENANCE_STAFF',
  
  // Quản lý hồ sơ - công bố sản phẩm, giấy tờ pháp lý
  REGULATORY_AFFAIRS: 'REGULATORY_AFFAIRS',
  
  // Nhân viên bán hàng - xuất kho thành phẩm
  SALES_STAFF: 'SALES_STAFF',
  
  // Kế toán - quản lý giá cost, tính lợi nhuận
  ACCOUNTANT: 'ACCOUNTANT',
  
  // Người xem - chỉ có quyền xem báo cáo
  VIEWER: 'VIEWER'
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Giám Đốc',
  [ROLES.WAREHOUSE_MANAGER]: 'Quản lý kho',
  [ROLES.PRODUCTION_MANAGER]: 'Quản lý sản xuất',
  [ROLES.QC_STAFF]: 'Nhân viên QC',
  [ROLES.OPERATOR]: 'Công nhân vận hành',
  [ROLES.MAINTENANCE_STAFF]: 'Nhân viên bảo trì',
  [ROLES.REGULATORY_AFFAIRS]: 'Quản lý hồ sơ',
  [ROLES.SALES_STAFF]: 'Nhân viên bán hàng',
  [ROLES.ACCOUNTANT]: 'Kế toán',
  [ROLES.VIEWER]: 'Người xem'
}