import apiClient from './apiClient'
import type { RegistrarVentaRequest, VentaResponse } from '../types/venta.types'

export const ventaService = {
  async registrar(data: RegistrarVentaRequest): Promise<VentaResponse> {
    const response = await apiClient.post<VentaResponse>('/api/ventas', data)
    return response.data
  },

  async listar(): Promise<VentaResponse[]> {
    const response = await apiClient.get<VentaResponse[]>('/api/ventas')
    return response.data
  },
}