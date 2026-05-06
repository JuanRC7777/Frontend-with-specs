import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('../../services/productoService', () => ({
  productoService: {
    listar: vi.fn(),
    crear: vi.fn(),
    actualizar: vi.fn(),
    eliminar: vi.fn(),
  },
}))

import { useProductos } from '../../composables/useProductos'
import { productoService } from '../../services/productoService'
import type { Producto } from '../../types/producto.types'

describe('useProductos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('cargar popula la lista de productos', async () => {
    const mockLista: Producto[] = [
      { id: 1, nombre: 'Café', descripcion: 'Café', precio: 10, stock: 50, activo: true },
    ]
    ;(productoService.listar as any).mockResolvedValue(mockLista)

    const { productos, cargar } = useProductos()
    await cargar()

    expect(productos.value).toEqual(mockLista)
  })

  it('crear agrega el producto a la lista', async () => {
    const nuevo: Producto = { id: 2, nombre: 'Té', descripcion: 'Té', precio: 8, stock: 30, activo: true }
    ;(productoService.crear as any).mockResolvedValue(nuevo)

    const { productos, crear } = useProductos()
    await crear({ nombre: 'Té', descripcion: 'Té', precio: 8, stock: 30 })

    expect(productos.value).toContainEqual(nuevo)
  })

  it('eliminar quita el producto de la lista', async () => {
    ;(productoService.eliminar as any).mockResolvedValue(undefined)

    const { productos, eliminar } = useProductos()
    productos.value = [
      { id: 1, nombre: 'Café', descripcion: 'Café', precio: 10, stock: 50, activo: true },
    ]
    await eliminar(1)

    expect(productos.value.length).toBe(0)
  })
})