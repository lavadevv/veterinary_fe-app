import AppLayout from '@/layouts/AppLayout.vue'
import AuditPage from './page/AuditPage.vue'
import UserAuditPage from './page/UserAuditPage.vue'

export default [
  {
    path: '/audit',
    component: AppLayout,
    children: [
      {
        path: '',
        name: 'AuditList',
        component: AuditPage,
        meta: {
          title: 'Audit Logs',
          requiresAuth: true,
        },
      },
      {
        path: 'user/:userId',
        name: 'UserAudit',
        component: UserAuditPage,
        meta: {
          title: 'User Audit Logs',
          requiresAuth: true,
        },
      },
    ],
  },
]
