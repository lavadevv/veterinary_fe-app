// Menu configuration with Heroicons
import {
  HomeIcon,
  DocumentMagnifyingGlassIcon,
  UsersIcon,
  CubeIcon,
  TagIcon,
  TruckIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  Cog6ToothIcon
} from '@heroicons/vue/24/outline'

export const menuItems = [
  {
    title: 'Dashboard',
    icon: HomeIcon,
    route: '/dashboard',
    active: true
  },
  {
    title: 'Quản lý hoạt động',
    icon: DocumentMagnifyingGlassIcon,
    route: '/audit',
  },
  {
    title: 'Quản lý Người Dùng',
    icon: UsersIcon,
    route: '/users'
  },
  {
    title: 'Quản lý Nguyên Vật Liệu',
    icon: CubeIcon,
    route: '/materials',
    children: [
      { title: 'Quản lý Kho', route: '/materials/warehouses' },
      { title: 'Vị trí', route: '/materials/locations' },
      { title: 'Quản lý Vật Liệu', route: '/materials/material' },
      { title: 'Quản lý lô Vật Liệu', route: '/materials/material-batches' },
      { title: 'Quản lý giao dịch Vật Liệu', route: '/materials/material-transactions' },
      { title: 'Nhà cung cấp', route: '/materials/suppliers' },
      { title: 'Cảnh báo', route: '/materials/stock-alerts' },
    ]
  },
  {
    title: 'Quản lý Sản phẩm',
    icon: TagIcon,
    route: '/products',
    children: [
      { title: 'Danh sách Sản phẩm', route: '/products/list' },
      { title: 'Phân loại Sản phẩm', route: '/products/categories' },
      { title: 'Quy cách Sản phẩm', route: '/products/specifications' }
    ]
  },
  {
    title: 'Quản lý Kho Vận',
    icon: TruckIcon,
    route: '/logistics',
    children: [
      { title: 'Đơn vận chuyển', route: '/logistics/shipments' },
      { title: 'Theo dõi hàng hóa', route: '/logistics/tracking' },
      { title: 'Nhà vận chuyển', route: '/logistics/carriers' }
    ]
  },
  {
    title: 'Quản lý Chất lượng',
    icon: BuildingStorefrontIcon,
    route: '/quality',
    children: [
      { title: 'Đơn hàng', route: '/quality/orders' },
      { title: 'Khách hàng', route: '/quality/customers' },
      { title: 'Báo giá', route: '/quality/quotes' },
      { title: 'Hóa đơn', route: '/quality/invoices' }
    ]
  },
  {
    title: 'Báo cáo & Phân tích',
    icon: ChartBarIcon,
    route: '/reports',
    children: [
      { title: 'Báo cáo Doanh thu', route: '/reports/revenue' },
      { title: 'Báo cáo Tồn kho', route: '/reports/inventory' },
      { title: 'Phân tích Xu hướng', route: '/reports/trends' },
      { title: 'Báo cáo tùy chỉnh', route: '/reports/custom' }
    ]
  },
  {
    title: 'Cài đặt Hệ thống',
    icon: Cog6ToothIcon,
    route: '/settings',
    children: [
      { title: 'Cài đặt chung', route: '/settings/general' },
      { title: 'Quyền truy cập', route: '/settings/permissions' },
      { title: 'Cấu hình API', route: '/settings/api' },
      { title: 'Sao lưu & Khôi phục', route: '/settings/backup' }
    ]
  }
]
