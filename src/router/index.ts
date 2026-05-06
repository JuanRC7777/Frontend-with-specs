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
          path: '',
          redirect: '/pos',
        },
      ],
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.token) {
    next({ path: '/login' })
  } else if (to.path === '/login' && authStore.token) {
    next({ path: '/pos' })
  } else {
    next()
  }
})

export default router