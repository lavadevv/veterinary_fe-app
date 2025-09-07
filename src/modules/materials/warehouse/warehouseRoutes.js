import AppLayout from '@/layouts/AppLayout.vue'
import WarehouseListPage from './page/WarehouseListPage.vue'
import { ROLES } from '@/modules/auth/constants/roles'

export default [
  {
    path: '/materials/warehouses',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'WarehouseList',
        component: WarehouseListPage,
        meta: {
          title: 'Quản lý kho',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        },
      }
    ],
  },
]
