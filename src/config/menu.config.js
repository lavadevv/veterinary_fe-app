export const menuItems = [
  {
    title: 'Dashboard',
    icon: '📊',
    route: '/dashboard',
    active: true
  },
  {
    title: 'Quản lý hoạt động',
    icon: '🔍',
    route: '/audit',
  },
  {
    title: 'Quản lý Người Dùng',
    icon: '👥',
    route: '/users'
  },
  {
    title: 'Quản lý Nguyên Vật Liệu',
    icon: '📦',
    route: '/materials',
    children: [
      { title: 'Quản lý Vật Liệu', route: '/materials/material' },
      { title: 'Vị trí', route: '/materials/locations' },
      { title: 'Quản lý lô Vật Liệu', route: '/materials/material-batches' },
      { title: 'Quản lý giao dịch Vật Liệu', route: '/materials/material-transactions' },
      { title: 'Nhà cung cấp', route: '/materials/suppliers' },
      { title: 'Cảnh báo', route: '/materials/stock-alerts' },
      { title: 'Nhà Kho', route: '/materials/warehouse' },
    ]
  },
  {
    title: 'Quản lý Sản phẩm',
    icon: '🏷️',
    route: '/products',
    children: [
      { title: 'Danh sách Sản phẩm', route: '/products/list' },
      { title: 'Phân loại Sản phẩm', route: '/products/categories' },
      { title: 'Quy cách Sản phẩm', route: '/products/specifications' }
    ]
  },
  // 👉 Các menu còn lại copy y nguyên từ code bạn
]
