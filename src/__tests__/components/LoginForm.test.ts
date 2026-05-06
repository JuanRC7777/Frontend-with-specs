import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import LoginForm from '../../components/auth/LoginForm.vue'
import { setActivePinia, createPinia } from 'pinia'

const mockLogin = vi.fn()
const mockPush = vi.fn()

vi.mock('../../composables/useAuth', () => ({
  useAuth: () => ({
    login: mockLogin,
    logout: vi.fn(),
    isAuthenticated: { value: false },
    username: { value: null },
  }),
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
  })

  it('renderiza campos de usuario y password', () => {
    const wrapper = mount(LoginForm)
    expect(wrapper.find('input[type="text"]').exists()).toBe(true)
    expect(wrapper.find('input[type="password"]').exists()).toBe(true)
  })

  it('muestra error si los campos están vacíos al hacer submit', async () => {
    const wrapper = mount(LoginForm)
    await wrapper.find('form').trigger('submit.prevent')
    expect(wrapper.text()).toContain('Todos los campos son requeridos')
  })

  it('llama al composable login() con los datos correctos', async () => {
    mockLogin.mockResolvedValue({})
    const wrapper = mount(LoginForm)

    await wrapper.find('input[type="text"]').setValue('admin')
    await wrapper.find('input[type="password"]').setValue('123')
    await wrapper.find('form').trigger('submit.prevent')

    expect(mockLogin).toHaveBeenCalledWith({
      username: 'admin',
      password: '123',
    })
  })

  it('muestra error si login falla', async () => {
    mockLogin.mockRejectedValue({
      response: { data: { message: 'Credenciales inválidas' } },
    })
    const wrapper = mount(LoginForm)

    await wrapper.find('input[type="text"]').setValue('admin')
    await wrapper.find('input[type="password"]').setValue('wrong')
    await wrapper.find('form').trigger('submit.prevent')

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('Credenciales inválidas')
  })
})