import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as fc from 'fast-check'
import { useCarrito } from '../../composables/useCarrito'
import type { Producto } from '../../types/producto.types'

vi.mock('../../services/ventaService', () => ({
  ventaService: {
    registrar: vi.fn(),
  },
}))

import { ventaService } from '../../services/ventaService'

const productoMock: Producto = {
  id: 1,
  nombre: 'Café',
  descripcion: 'Café negro',
  precio: 10,
  stock: 50,
  activo: true,
}

describe('useCarrito', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 6.6.1: subtotal, impuesto y total se calculan correctamente con tasa
  it('6.6.1: subtotal, impuesto y total se calculan correctamente con tasa de impuesto', () => {
    const { agregar, tasaImpuesto, subtotal, impuesto, total } = useCarrito()
    tasaImpuesto.value = 0.12
    agregar(productoMock, 3) // subtotal = 30

    expect(subtotal.value).toBe(30)
    expect(impuesto.value).toBeCloseTo(3.6)   // 30 * 0.12
    expect(total.value).toBeCloseTo(33.6)     // 30 + 3.6
  })

  // 6.6.2: agregar incrementa cantidad si el producto ya existe
  it('6.6.2: agregar incrementa cantidad si el producto ya existe en el carrito', () => {
    const { agregar, items } = useCarrito()
    agregar(productoMock, 2)
    agregar(productoMock, 3)

    expect(items.value.length).toBe(1)
    expect(items.value[0].cantidad).toBe(5)
    expect(items.value[0].subtotal).toBe(50)
  })

  // 6.6.3: eliminar quita el item
  it('6.6.3: eliminar quita el item del carrito', () => {
    const { agregar, eliminar, items } = useCarrito()
    agregar(productoMock, 1)
    eliminar(1)

    expect(items.value.length).toBe(0)
  })

  // 6.6.4: confirmar lanza error con carrito vacío
  it('6.6.4: confirmar lanza error con carrito vacío', async () => {
    const { confirmar } = useCarrito()
    await expect(confirmar()).rejects.toThrow('El carrito está vacío')
  })

  // 6.6.5: confirmar lanza error si suma de pagos no iguala el total
  it('6.6.5: confirmar lanza error si la suma de pagos no iguala el total', async () => {
    const { agregar, confirmar, datosCliente, pagos, tasaImpuesto } = useCarrito()
    tasaImpuesto.value = 0
    agregar(productoMock, 2) // total = 20
    datosCliente.nombreCliente = 'Juan Pérez'
    datosCliente.cedulaCliente = '1234567890'
    pagos.value = [{ metodoPago: 'EFECTIVO', monto: 10 }] // suma = 10, no iguala 20

    await expect(confirmar()).rejects.toThrow('La suma de pagos no coincide con el total')
  })

  // 6.6.6: confirmar lanza error si cédula inválida
  it('6.6.6: confirmar lanza error si la cédula es inválida', async () => {
    const { agregar, confirmar, datosCliente, pagos, tasaImpuesto } = useCarrito()
    tasaImpuesto.value = 0
    agregar(productoMock, 2) // total = 20
    datosCliente.nombreCliente = 'Juan Pérez'
    datosCliente.cedulaCliente = '123' // inválida
    pagos.value = [{ metodoPago: 'EFECTIVO', monto: 20 }]

    await expect(confirmar()).rejects.toThrow('Cédula del cliente inválida')
  })

  // 6.6.7: confirmar lanza error si nombre inválido
  it('6.6.7: confirmar lanza error si el nombre del cliente es inválido', async () => {
    const { agregar, confirmar, datosCliente, pagos, tasaImpuesto } = useCarrito()
    tasaImpuesto.value = 0
    agregar(productoMock, 2) // total = 20
    datosCliente.nombreCliente = 'Juan' // solo una palabra
    datosCliente.cedulaCliente = '1234567890'
    pagos.value = [{ metodoPago: 'EFECTIVO', monto: 20 }]

    await expect(confirmar()).rejects.toThrow('Nombre del cliente inválido')
  })

  // 6.6.8: confirmar vacía el carrito tras venta exitosa
  it('6.6.8: confirmar vacía el carrito tras procesar la venta exitosamente', async () => {
    ;(ventaService.registrar as any).mockResolvedValue({
      id: 1,
      numeroFactura: 'F-001',
      total: 20,
      fecha: '2026-05-05',
      detalles: [],
      pagos: [],
    })

    const { agregar, confirmar, items, datosCliente, pagos, tasaImpuesto } = useCarrito()
    tasaImpuesto.value = 0
    agregar(productoMock, 2) // total = 20
    datosCliente.nombreCliente = 'Juan Pérez'
    datosCliente.cedulaCliente = '1234567890'
    pagos.value = [{ metodoPago: 'EFECTIVO', monto: 20 }]

    await confirmar()

    expect(items.value.length).toBe(0)
  })

  // 6.6.9 PBT: después de agregar, item existe con cantidad >= cantidad
  it('6.6.9 PBT: después de agregar, el item existe con cantidad >= cantidad', () => {
    /**
     * **Validates: Requirements 6.6.9**
     * Propiedad: para cualquier cantidad positiva, después de agregar un producto,
     * el item existe en el carrito con cantidad >= la cantidad agregada.
     */
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (cantidad) => {
        const { agregar, items } = useCarrito()
        agregar(productoMock, cantidad)

        const item = items.value.find((i) => i.producto.id === productoMock.id)
        expect(item).toBeDefined()
        expect(item!.cantidad).toBeGreaterThanOrEqual(cantidad)
      }),
    )
  })

  // 6.6.10 PBT: después de eliminar, ningún item tiene ese productoId
  it('6.6.10 PBT: después de eliminar, ningún item tiene ese productoId', () => {
    /**
     * **Validates: Requirements 6.6.10**
     * Propiedad: después de eliminar un producto por su id,
     * ningún item en el carrito tiene ese productoId.
     */
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100 }), (cantidad) => {
        const { agregar, eliminar, items } = useCarrito()
        agregar(productoMock, cantidad)
        eliminar(productoMock.id)

        expect(items.value.find((i) => i.producto.id === productoMock.id)).toBeUndefined()
      }),
    )
  })

  // 6.6.11 PBT: después de vaciar, items.length === 0, subtotal === 0, total === 0
  it('6.6.11 PBT: después de vaciar, items.length === 0, subtotal === 0 y total === 0', () => {
    /**
     * **Validates: Requirements 6.6.11**
     * Propiedad: después de vaciar el carrito, independientemente de cuántos
     * productos se hayan agregado, el carrito queda completamente vacío.
     */
    fc.assert(
      fc.property(
        fc.array(fc.integer({ min: 1, max: 50 }), { minLength: 1, maxLength: 10 }),
        (cantidades) => {
          const { agregar, vaciar, items, subtotal, total } = useCarrito()
          cantidades.forEach((c) => agregar(productoMock, c))
          vaciar()

          expect(items.value.length).toBe(0)
          expect(subtotal.value).toBe(0)
          expect(total.value).toBe(0)
        },
      ),
    )
  })

  // 6.6.12 PBT: total === subtotal + subtotal * tasaImpuesto para cualquier tasa en [0,1]
  it('6.6.12 PBT: total === subtotal + subtotal * tasaImpuesto para cualquier tasa en [0, 1]', () => {
    /**
     * **Validates: Requirements 6.6.12**
     * Propiedad: el total siempre es igual a subtotal + subtotal * tasaImpuesto
     * para cualquier tasa de impuesto en el rango [0, 1].
     */
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 1, noNaN: true }),
        fc.integer({ min: 1, max: 20 }),
        (tasa, cantidad) => {
          const { agregar, tasaImpuesto, subtotal, total } = useCarrito()
          tasaImpuesto.value = tasa
          agregar(productoMock, cantidad)

          const expectedTotal = subtotal.value + subtotal.value * tasa
          expect(total.value).toBeCloseTo(expectedTotal, 10)
        },
      ),
    )
  })
})
