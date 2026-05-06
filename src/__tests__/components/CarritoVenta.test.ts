import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CarritoVenta from '../../components/pos/CarritoVenta.vue'
import { setActivePinia, createPinia } from 'pinia'
import type { ItemCarrito } from '../../types/venta.types'
import type { Producto } from '../../types/producto.types'

const productoMock: Producto = {
  id: 1,
  nombre: 'Café',
  descripcion: 'Café',
  precio: 10,
  stock: 50,
  activo: true,
}

describe('CarritoVenta', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('renderiza carrito vacío inicialmente', () => {
    const wrapper = mount(CarritoVenta, {
      props: {
        items: [],
        total: 0,
        error: null,
      },
    })

    expect(wrapper.text()).toContain('El carrito está vacío')
  })

  it('muestra total actualizado al tener productos', () => {
    const items: ItemCarrito[] = [
      { producto: productoMock, cantidad: 2, subtotal: 20 },
    ]

    const wrapper = mount(CarritoVenta, {
      props: {
        items,
        total: 20,
        error: null,
      },
    })

    expect(wrapper.text()).toContain('$20')
  })

  it('deshabilita botón "Confirmar" con carrito vacío', () => {
    const wrapper = mount(CarritoVenta, {
      props: {
        items: [],
        total: 0,
        error: null,
      },
    })

    const button = wrapper.find('button')
    expect(button.attributes('disabled')).toBeDefined()
  })

  it('muestra error cuando se pasa prop error', () => {
    const wrapper = mount(CarritoVenta, {
      props: {
        items: [],
        total: 0,
        error: 'Stock insuficiente',
      },
    })

    expect(wrapper.text()).toContain('Stock insuficiente')
  })

  it('emite confirmar al hacer clic en el botón', async () => {
  const items: ItemCarrito[] = [
    { producto: productoMock, cantidad: 1, subtotal: 10 },
  ]

  const wrapper = mount(CarritoVenta, {
    props: {
      items,
      total: 10,
      error: null,
    },
  })

  // Buscamos el botón que contiene "Confirmar Venta"
  const botones = wrapper.findAll('button')
  const botonConfirmar = botones.find((b) => b.text().includes('Confirmar Venta'))
  expect(botonConfirmar).toBeDefined()
  await botonConfirmar!.trigger('click')
  expect(wrapper.emitted('confirmar')).toBeTruthy()
})
})