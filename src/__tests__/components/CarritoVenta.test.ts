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
        subtotal: 0,
        impuesto: 0,
        total: 0,
        tasaImpuesto: 0.19,
        error: null,
      },
    })

    expect(wrapper.text()).toContain('El carrito está vacío')
  })

  it('muestra subtotal, impuesto y total por separado', () => {
    const items: ItemCarrito[] = [
      { producto: productoMock, cantidad: 2, subtotal: 20 },
    ]

    const wrapper = mount(CarritoVenta, {
      props: {
        items,
        subtotal: 20,
        impuesto: 3.8,
        total: 23.8,
        tasaImpuesto: 0.19,
        error: null,
      },
    })

    const text = wrapper.text()
    // Subtotal visible
    expect(text).toContain('Subtotal')
    expect(text).toContain('20')
    // Impuesto visible con tasa
    expect(text).toContain('Impuesto')
    expect(text).toContain('19%')
    // Total visible (mayor que subtotal)
    expect(text).toContain('Total')
    expect(text).toContain('24')
  })

  it('deshabilita botón "Confirmar" con carrito vacío', () => {
    const wrapper = mount(CarritoVenta, {
      props: {
        items: [],
        subtotal: 0,
        impuesto: 0,
        total: 0,
        tasaImpuesto: 0.19,
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
        subtotal: 0,
        impuesto: 0,
        total: 0,
        tasaImpuesto: 0.19,
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
      subtotal: 10,
      impuesto: 1.9,
      total: 11.9,
      tasaImpuesto: 0.19,
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