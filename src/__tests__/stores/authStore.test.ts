import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '../../stores/authStore'
import * as fc from 'fast-check'

/**
 * Validates: Requirements 5.1, 5.2
 */
describe('authStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  // 5.2.1 PBT: después de setAuth(token, username, nombre), el store refleja exactamente esos tres valores
  it('PBT: después de setAuth(token, username, nombre), el store refleja exactamente esos tres valores', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        fc.string({ minLength: 1 }),
        (token, username, nombre) => {
          setActivePinia(createPinia())
          localStorage.clear()

          const store = useAuthStore()
          store.setAuth(token, username, nombre)

          expect(store.token).toBe(token)
          expect(store.username).toBe(username)
          expect(store.nombre).toBe(nombre)
        }
      )
    )
  })

  // 5.2.2 Después de logout(), token, username y nombre son null
  it('después de logout(), token, username y nombre son null', () => {
    const store = useAuthStore()
    store.setAuth('abc123', 'admin', 'Administrador')
    store.logout()

    expect(store.token).toBeNull()
    expect(store.username).toBeNull()
    expect(store.nombre).toBeNull()
  })
})
