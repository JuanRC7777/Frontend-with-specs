import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ProductoForm from '../../components/productos/ProductoForm.vue'
import { setActivePinia, createPinia } from 'pinia'

describe('ProductoForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renderiza formulario vacío para nuevo producto', () => {
    const wrapper = mount(ProductoForm, {
      props: { producto: null },
    })

    expect(wrapper.find('h3').text()).toBe('Nuevo Producto')
    expect((wrapper.find('input[type="text"]').element as HTMLInputElement).value).toBe('')
  })

  it('precarga datos cuando recibe prop producto', () => {
    const wrapper = mount(ProductoForm, {
      props: {
        producto: {
          id: 1,
          nombre: 'Café',
          descripcion: 'Café negro',
          precio: 10,
          stock: 50,
          activo: true,
        },
      },
    })

    expect(wrapper.find('h3').text()).toBe('Editar Producto')
    expect((wrapper.find('input[type="text"]').element as HTMLInputElement).value).toBe('Café')
  })

  it('muestra error si precio es <= 0', async () => {
    const wrapper = mount(ProductoForm, {
      props: { producto: null },
    })

    await wrapper.find('input[type="text"]').setValue('Producto')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('El precio debe ser mayor a cero')
  })

  it('muestra error si stock es negativo', async () => {
    const wrapper = mount(ProductoForm, {
      props: { producto: null },
    })

    const inputs = wrapper.findAll('input[type="number"]')
    // inputs[0] = precio, inputs[1] = stock
    await inputs[0].setValue(10)
    await inputs[1].setValue(-5)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('El stock no puede ser negativo')
  })

  it('emite submit con datos válidos', async () => {
    const wrapper = mount(ProductoForm, {
      props: { producto: null },
    })

    await wrapper.find('input[type="text"]').setValue('Té')
    const inputs = wrapper.findAll('input[type="number"]')
    await inputs[0].setValue(8)
    await inputs[1].setValue(30)
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')![0]).toEqual([
      { nombre: 'Té', descripcion: '', precio: 8, stock: 30 },
    ])
  })
})