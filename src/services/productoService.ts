import apiClient from './apiClient'
import type { Producto, CrearProductoRequest } from '../types/producto.types'

export const productoService = {
  async listar(): Promise<Producto[]> {
    const response = await apiClient.get<Producto[]>('/api/productos')
    return response.data
  },

  async obtener(id: number): Promise<Producto> {
    const response = await apiClient.get<Producto>(`/api/productos/${id}`)
    return response.data
  },

  async crear(data: CrearProductoRequest): Promise<Producto> {
    const response = await apiClient.post<Producto>('/api/productos', data)
    return response.data
  },

  async actualizar(id: number, data: CrearProductoRequest): Promise<Producto> {
    const response = await apiClient.put<Producto>(`/api/productos/${id}`, data)
    return response.data
  },

  async eliminar(id: number): Promise<void> {
    await apiClient.delete(`/api/productos/${id}`)
  },
}