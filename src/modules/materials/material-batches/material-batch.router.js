import AppLayout from '@/layouts/AppLayout.vue'
import MaterialBatchPage from './pages/MaterialBatchPage.vue'
import MaterialBatchDetailPage from './pages/MaterialBatchDetailPage.vue'
import CreateMaterialBatchPage from './pages/CreateMaterialBatchPage.vue'
import EditMaterialBatchPage from './pages/EditMaterialBatchPage.vue'
import { ROLES } from '@/modules/auth/constants/roles'

export default [
  {
    path: '/materials/material-batches',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'MaterialBatchList',
        component: MaterialBatchPage,
        meta: {
          title: 'Quản lý Lô Vật liệu',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      },
      {
        path: 'create',
        name: 'MaterialBatchCreate',
        component: CreateMaterialBatchPage,
        meta: {
          title: 'Thêm Lô Vật liệu Mới',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      },
      {
        path: ':id',
        name: 'MaterialBatchDetail',
        component: MaterialBatchDetailPage,
        meta: {
          title: 'Chi tiết Lô Vật liệu',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      },
      {
        path: ':id/edit',
        name: 'MaterialBatchEdit',
        component: EditMaterialBatchPage,
        meta: {
          title: 'Chỉnh sửa Lô Vật liệu',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      }
    ]
  }
]
