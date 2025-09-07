import AppLayout from '@/layouts/AppLayout.vue'
import MaterialPage from './pages/MaterialPage.vue'
import MaterialDetailPage from './pages/MaterialDetailPage.vue'
import MaterialFormPage from './pages/MaterialFormPage.vue'
import { ROLES } from '@/modules/auth/constants/roles'

export default [
  {
    path: '/materials/material',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'MaterialList',
        component: MaterialPage,
        meta: {
          title: 'Quản lý Vật liệu',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      },
      {
        path: 'create',
        name: 'MaterialCreate',
        component: MaterialFormPage,
        meta: {
          title: 'Thêm Vật liệu Mới',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      },
      {
        path: ':id',
        name: 'MaterialDetail',
        component: MaterialDetailPage,
        meta: {
          title: 'Chi tiết Vật liệu',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      },
      {
        path: ':id/edit',
        name: 'MaterialEdit',
        component: MaterialFormPage,
        meta: {
          title: 'Chỉnh sửa Vật liệu',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      }
    ]
  }
]
