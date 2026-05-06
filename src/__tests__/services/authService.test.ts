import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockPost } = vi.hoisted(() => ({
  mockPost: vi.fn(),
}))

vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    token: null,
    username: null,
    logout: vi.fn(),
    setAuth: vi.fn(),
  })),
}))

vi.mock('../../services/apiClient', () => ({
  default: {
    post: mockPost,
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
      response: { use: vi.fn(), eject: vi.fn(), clear: vi.fn() },
    },
  },
}))

import { authService } from '../../services/authService'

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('login retorna token cuando el backend responde 200', async () => {
    const mockResponse = {
      data: { token: 'abc123', username: 'admin', expiresIn: 3600 },
    }
    mockPost.mockResolvedValue(mockResponse)

    const result = await authService.login({ username: 'admin', password: '123' })
    expect(result).toEqual(mockResponse.data)
    expect(mockPost).toHaveBeenCalledWith('/api/auth/login', {
      username: 'admin',
      password: '123',
    })
  })

  it('login lanza error cuando el backend responde 401', async () => {
    const mockError = {
      response: { status: 401, data: { message: 'Credenciales inválidas' } },
    }
    mockPost.mockRejectedValue(mockError)

    await expect(
      authService.login({ username: 'admin', password: 'wrong' })
    ).rejects.toEqual(mockError)
  })
})