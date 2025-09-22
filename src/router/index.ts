import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('../views/Home.vue') },
  { path: '/login', name: 'login', component: () => import('../views/Login.vue') },
  { path: '/student', component: () => import('../views/student/StudentLayout.vue'), meta: { requiresAuth: true, role: 'student' }, children: [
      { path: '', name: 'student.menu', component: () => import('../views/student/StudentMenu.vue') },
      { path: 'cart', name: 'student.cart', component: () => import('../views/student/StudentCart.vue') },
      { path: 'orders', name: 'student.orders', component: () => import('../views/student/StudentOrders.vue') },
    ]
  },
  { path: '/staff', component: () => import('../views/staff/StaffLayout.vue'), meta: { requiresAuth: true, role: 'staff' }, children: [
      { path: '', name: 'staff.dashboard', component: () => import('../views/staff/StaffDashboard.vue') },
      { path: 'menu', name: 'staff.menu', component: () => import('../views/staff/ManageMenu.vue') },
      { path: 'orders', name: 'staff.orders', component: () => import('../views/staff/StaffOrders.vue') },
      { path: 'history', name: 'staff.history', component: () => import('../views/staff/OrderHistory.vue') },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (to.meta.requiresAuth) {
    if (!auth.isAuthenticated) {
      return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (to.meta.role && auth.userRole !== to.meta.role) {
      return auth.userRole === 'staff' ? { name: 'staff.dashboard' } : { name: 'student.menu' }
    }
  }
})

export default router

