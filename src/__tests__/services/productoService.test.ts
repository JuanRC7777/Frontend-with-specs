import { describe, it, expect, vi } from 'vitest'
import { productoService } from '../../services/productoService'

vi.mock('../../services/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

import apiClient from '../../services/apiClient'

describe('productoService', () => {
  it('listar retorna lista de productos', async () => {
    const mockProductos = [
      { id: 1, nombre: 'Café', descripcion: 'Café negro', precio: 10, stock: 50, activo: true },
    ]
    ;(apiClient.get as any).mockResolvedValue({ data: mockProductos })

    const result = await productoService.listar()
    expect(result).toEqual(mockProductos)
    expect(apiClient.get).toHaveBeenCalledWith('/api/productos')
  })

  it('crear envía datos correctos al backend', async () => {
    const nuevoProducto = { nombre: 'Té', descripcion: 'Té verde', precio: 8, stock: 30 }
    const mockResponse = { id: 2, ...nuevoProducto, activo: true }
    ;(apiClient.post as any).mockResolvedValue({ data: mockResponse })

    const result = await productoService.crear(nuevoProducto)
    expect(result).toEqual(mockResponse)
    expect(apiClient.post).toHaveBeenCalledWith('/api/productos', nuevoProducto)
  })

  it('eliminar llama DELETE con el id correcto', async () => {
    ;(apiClient.delete as any).mockResolvedValue({})

    await productoService.eliminar(1)
    expect(apiClient.delete).toHaveBeenCalledWith('/api/productos/1')
  })
})