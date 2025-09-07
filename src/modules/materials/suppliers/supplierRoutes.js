import AppLayout from '@/layouts/AppLayout.vue'
import SupplierListPage from './page/SupplierListPage.vue'
import SupplierDetailPage from './page/SupplierDetailPage.vue'
import SupplierFormPage from './page/SupplierFormPage.vue'
import { ROLES } from '@/modules/auth/constants/roles'

export default [
  {
    path: '/materials/suppliers',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'SupplierList',
        component: SupplierListPage,
        meta: {
          title: 'Quản lý nhà cung cấp',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        },
      },
      {
        path: 'create',
        name: 'SupplierCreate',
        component: SupplierFormPage,
        meta: {
          title: 'Thêm nhà cung cấp',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER]
        },
      },
      {
        path: ':id/edit',
        name: 'SupplierEdit',
        component: SupplierFormPage,
        props: true,
        meta: {
          title: 'Sửa nhà cung cấp',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER]
        },
      },
      {
        path: ':id',
        name: 'SupplierDetail',
        component: SupplierDetailPage,
        props: true,
        meta: {
          title: 'Chi tiết nhà cung cấp',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        },
      }
    ],
  },
]
