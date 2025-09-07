import AppLayout from '@/layouts/AppLayout.vue'
import LocationListPage from './page/LocationListPage.vue'
import { ROLES } from '@/modules/auth/constants/roles'

export default [
  {
    path: '/materials/locations',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'LocationList',
        component: LocationListPage,
        meta: {
          title: 'Quản lý vị trí kho',
          requiresAuth: true,
          permissions: [ROLES.ADMIN, ROLES.WAREHOUSE_MANAGER, ROLES.PRODUCTION_MANAGER]
        },
      }
    ],
  },
]
