import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/',
      component: () => import('../App.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'productos',
          name: 'productos',
          component: () => import('../views/ProductosView.vue'),
        },
        {
          path: 'pos',
          name: 'pos',
          component: () => import('../views/PosView.vue'),
        },
        {
          path: 'ventas',
          name: 'ventas',
          component: () => import('../views/VentasView.vue'),
        },
        {
          path: 'configuracion',
          name: 'configuracion',
          component: () => import('../views/ConfiguracionView.vue'),
        },
        {
          path: '',
          redirect: '/pos',
        },
      ],
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.token) {
    return { path: '/login' }
  }
  if (to.path === '/login' && authStore.token) {
    return { path: '/pos' }
  }
})

export default router