import AppLayout from '@/layouts/AppLayout.vue'
import UserListPage from './page/UserListPage.vue'
import { ROLES } from '@/modules/auth/constants/roles'

export default [
  {
    path: '/users',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'UserList',
        component: UserListPage,
        meta: {
          title: 'Quản lý người dùng',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        },
      }
    ],
  },
]