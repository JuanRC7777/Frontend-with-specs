import { describe, it, expect, vi, beforeEach } from 'vitest'
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

  it('agregar calcula subtotal correctamente', () => {
    const { agregar, items } = useCarrito()
    agregar(productoMock, 3)

    expect(items.value[0].subtotal).toBe(30)
  })

  it('agregar incrementa cantidad si el producto ya existe en el carrito', () => {
    const { agregar, items } = useCarrito()
    agregar(productoMock, 2)
    agregar(productoMock, 3)

    expect(items.value.length).toBe(1)
    expect(items.value[0].cantidad).toBe(5)
    expect(items.value[0].subtotal).toBe(50)
  })

  it('eliminar quita el item del carrito', () => {
    const { agregar, eliminar, items } = useCarrito()
    agregar(productoMock, 1)
    eliminar(1)

    expect(items.value.length).toBe(0)
  })

  it('total se actualiza reactivamente al agregar productos', () => {
    const { agregar, total } = useCarrito()
    agregar(productoMock, 3)

    expect(total.value).toBe(30)
  })

  it('confirmar lanza error con carrito vacío', async () => {
    const { confirmar } = useCarrito()
    await expect(confirmar()).rejects.toThrow('El carrito está vacío')
  })

  it('confirmar vacía el carrito tras procesar la venta', async () => {
    ;(ventaService.registrar as any).mockResolvedValue({
      id: 1,
      total: 20,
      fecha: '2026-05-05',
      detalles: [],
    })

    const { agregar, confirmar, items } = useCarrito()
    agregar(productoMock, 2)
    await confirmar()

    expect(items.value.length).toBe(0)
  })

  // PBT: después de agregar, el item existe
  it('PBT: después de agregar, el item existe con cantidad >= cantidad', () => {
    const { agregar, items } = useCarrito()
    agregar(productoMock, 5)

    const item = items.value.find((i) => i.producto.id === 1)
    expect(item).toBeDefined()
    expect(item!.cantidad).toBeGreaterThanOrEqual(5)
  })

  // PBT: después de eliminar, ningún item tiene ese productoId
  it('PBT: después de eliminar, ningún item tiene ese productoId', () => {
    const { agregar, eliminar, items } = useCarrito()
    agregar(productoMock, 1)
    eliminar(1)

    expect(items.value.find((i) => i.producto.id === 1)).toBeUndefined()
  })

  // PBT: después de vaciar, items y total son 0
  it('PBT: después de vaciar, items.length === 0 y total === 0', () => {
    const { agregar, vaciar, items, total } = useCarrito()
    agregar(productoMock, 3)
    vaciar()

    expect(items.value.length).toBe(0)
    expect(total.value).toBe(0)
  })
})