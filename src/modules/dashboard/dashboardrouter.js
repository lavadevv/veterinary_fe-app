import AppLayout from '@/layouts/AppLayout.vue'
import DashboardPage from './pages/DashboardPage.vue'
import { ROLES } from '@/modules/auth/constants/roles'

export default [
  {
    path: '/dashboard',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: DashboardPage,
        meta: {
          title: 'Dashboard',
          requiresAuth: true,
          permissions: [
            ROLES.ADMIN, 
            ROLES.WAREHOUSE_MANAGER, 
            ROLES.PRODUCTION_MANAGER,
            ROLES.STAFF
          ]
        },
      }
    ],
  },
]
