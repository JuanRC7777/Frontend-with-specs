import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import { authService } from '../services/authService'
import type { LoginRequest } from '../types/auth.types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()

  const isAuthenticated = computed(() => !!authStore.token)
  const username = computed(() => authStore.username)

  async function login(data: LoginRequest) {
    const response = await authService.login(data)
    authStore.setAuth(response.token, response.username)
    router.push('/pos')
  }

  function logout() {
    authStore.logout()
    router.push('/login')
  }

  return { login, logout, isAuthenticated, username }
}