import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/authStore'

describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('después de setAuth, el store refleja exactamente esos valores', () => {
    const store = useAuthStore()
    store.setAuth('abc123', 'admin')

    expect(store.token).toBe('abc123')
    expect(store.username).toBe('admin')
  })

  it('después de logout, token y username son null', () => {
    const store = useAuthStore()
    store.setAuth('abc123', 'admin')
    store.logout()

    expect(store.token).toBeNull()
    expect(store.username).toBeNull()
  })
})