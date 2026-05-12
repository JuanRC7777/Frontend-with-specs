import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PagoForm from '../../components/pos/PagoForm.vue'
import { setActivePinia, createPinia } from 'pinia'
import type { PagoRequest } from '../../types/venta.types'

describe('PagoForm', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // 11.7.1 — renderiza campos de nombre y cédula del cliente
  it('renderiza campos de nombre y cédula del cliente', () => {
    const wrapper = mount(PagoForm, {
      props: {
        datosCliente: { nombreCliente: '', cedulaCliente: '' },
        pagos: [{ metodoPago: 'EFECTIVO', monto: 0 }],
        total: 100,
      },
    })

    const inputs = wrapper.findAll('input')
    const textos = wrapper.text()

    expect(textos).toContain('Nombre del cliente')
    expect(textos).toContain('Cédula del cliente')
    // Hay al menos 2 inputs de texto/número (nombre, cédula, monto)
    expect(inputs.length).toBeGreaterThanOrEqual(2)
  })

  // 11.7.2 — muestra error de validación si la cédula no tiene 10 dígitos
  it('muestra error de validación si la cédula no tiene 10 dígitos', async () => {
    const wrapper = mount(PagoForm, {
      props: {
        datosCliente: { nombreCliente: '', cedulaCliente: '123' },
        pagos: [{ metodoPago: 'EFECTIVO', monto: 0 }],
        total: 100,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('10 dígitos')
  })

  // 11.7.3 — muestra error si el nombre no tiene mínimo 2 palabras
  it('muestra error si el nombre no tiene mínimo 2 palabras', async () => {
    const wrapper = mount(PagoForm, {
      props: {
        datosCliente: { nombreCliente: 'Maria', cedulaCliente: '' },
        pagos: [{ metodoPago: 'EFECTIVO', monto: 0 }],
        total: 100,
      },
    })

    await wrapper.vm.$nextTick()
    expect(wrapper.text()).toContain('2 palabras')
  })

  // 11.7.4 — muestra advertencia si la suma de pagos no iguala el total
  it('muestra advertencia si la suma de pagos no iguala el total', async () => {
    const wrapper = mount(PagoForm, {
      props: {
        datosCliente: { nombreCliente: '', cedulaCliente: '' },
        pagos: [{ metodoPago: 'EFECTIVO', monto: 50 }],
        total: 100,
      },
    })

    await wrapper.vm.$nextTick()
    // El indicador muestra ✗ cuando la suma no coincide con el total
    expect(wrapper.text()).toContain('✗')
  })

  // 11.7.5 — permite agregar múltiples métodos de pago
  it('permite agregar múltiples métodos de pago', async () => {
    const pagos: PagoRequest[] = [{ metodoPago: 'EFECTIVO', monto: 50 }]

    const wrapper = mount(PagoForm, {
      props: {
        datosCliente: { nombreCliente: '', cedulaCliente: '' },
        pagos,
        total: 100,
      },
    })

    // Antes: 1 método de pago
    expect(wrapper.findAll('select').length).toBe(1)

    // Clic en "+ Agregar método"
    const botonAgregar = wrapper.find('button[type="button"]')
    await botonAgregar.trigger('click')
    await wrapper.vm.$nextTick()

    // Después: 2 métodos de pago
    expect(wrapper.findAll('select').length).toBe(2)
  })
})
