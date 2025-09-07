import { createRouter, createWebHistory } from 'vue-router'
import  auditRouter  from '@/modules/audit/audit.router';
import { authRoutes} from '@/modules/auth/authRoutes';
import userRoutes from '@/modules/user/userRoutes';
import locationRoutes from '@/modules/materials/location/locationRoutes';
import dashboardRoutes from '@/modules/dashboard/dashboardrouter';
import warehouseRoutes from '@/modules/materials/warehouse/warehouseRoutes';
import supplierRoutes from '@/modules/materials/suppliers/supplierRoutes';
import materialRouter from '@/modules/materials/material/material.router';
import materialBatchRouter from '@/modules/materials/material-batches/material-batch.router';
// xong
import materialTransactionRoutes from '@/modules/materials/material-transactions/material-transaction.router';
import AppLayout from '@/layouts/AppLayout.vue';

const routes = [
  ...auditRouter,
  ...authRoutes,
  ...userRoutes,
  ...dashboardRoutes,
  ...warehouseRoutes,
  ...locationRoutes,
  ...supplierRoutes,
  ...materialRouter,
  ...materialTransactionRoutes,
  ...materialBatchRouter,
  // Other module routes can be added here

  // Main application routes
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/',
    component: AppLayout,
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: () => import('@/modules/auth/page/Profile.vue'),
        meta: {
          requiresAuth: true,
          title: 'Hồ sơ'
        }
      },
      {
        path: 'profile/edit',
        name: 'UpdateProfile',
        component: () => import('@/modules/auth/page/UpdateProfile.vue'),
        meta: {
          requiresAuth: true,
          title: 'Cập nhật hồ sơ'
        }
      }
    ]
  },

  // Nếu muốn thêm route 404 hoặc unauthorized
  {
    path: '/unauthorized',
    name: 'Unauthorized',
    component: () => import('@/modules/auth/page/Unauthorized.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/modules/auth/page/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
})
// setupAuthGuards(router)

export default router