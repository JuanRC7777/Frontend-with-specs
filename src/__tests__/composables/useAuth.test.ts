import { describe, it, expect, vi, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

const mockPush = vi.fn()
const mockSetAuth = vi.fn()
const mockLogout = vi.fn()

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    token: 'abc123',
    username: 'admin',
    setAuth: mockSetAuth,
    logout: mockLogout,
  })),
}))

vi.mock('../../services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}))

import { useAuth } from '../../composables/useAuth'
import { authService } from '../../services/authService'

describe('useAuth', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('login guarda token en store cuando las credenciales son válidas', async () => {
    ;(authService.login as any).mockResolvedValue({
      token: 'abc123',
      username: 'admin',
      nombre: 'Administrador',
    })

    const { login } = useAuth()
    await login({ username: 'admin', password: '123' })

    expect(authService.login).toHaveBeenCalledWith({ username: 'admin', password: '123' })
    expect(mockSetAuth).toHaveBeenCalledWith('abc123', 'admin', 'Administrador')
    expect(mockPush).toHaveBeenCalledWith('/pos')
  })

  it('login expone error cuando las credenciales son inválidas', async () => {
    ;(authService.login as any).mockRejectedValue(new Error('Credenciales inválidas'))

    const { login } = useAuth()
    await expect(login({ username: 'admin', password: 'wrong' })).rejects.toThrow()
  })

  it('logout limpia el token del store', () => {
    const { logout } = useAuth()
    logout()

    expect(mockLogout).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/login')
  })
})