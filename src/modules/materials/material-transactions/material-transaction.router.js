import AppLayout from '@/layouts/AppLayout.vue'
import MaterialTransactionPage from './pages/MaterialTransactionPage_new.vue'
import MaterialTransactionDetailPage from './pages/MaterialTransactionDetailPage.vue'
import TransactionFormPage from './pages/TransactionFormPage.vue'
import { ROLES } from '@/modules/auth/constants/roles'

export default [
  {
    path: '/materials/material-transactions',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'MaterialTransactionList',
        component: MaterialTransactionPage,
        meta: {
          title: 'Quản lý Giao dịch Vật liệu',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      },
      {
        path: 'create',
        name: 'MaterialTransactionCreate',
        component: TransactionFormPage,
        meta: {
          title: 'Tạo Giao dịch Vật liệu Mới',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      },
      {
        path: ':id',
        name: 'MaterialTransactionDetail',
        component: MaterialTransactionDetailPage,
        meta: {
          title: 'Chi tiết Giao dịch Vật liệu',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      },
      {
        path: ':id/edit',
        name: 'MaterialTransactionEdit',
        component: TransactionFormPage,
        meta: {
          title: 'Chỉnh sửa Giao dịch Vật liệu',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        }
      }
    ]
  }
]
