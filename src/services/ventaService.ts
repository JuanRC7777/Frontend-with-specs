import apiClient from './apiClient'
import type {
  RegistrarVentaRequest,
  VentaResponse,
  FiltrosVenta,
  ReembolsoRequest,
  ReembolsoResponse,
} from '../types/venta.types'

export const ventaService = {
  async registrar(data: RegistrarVentaRequest): Promise<VentaResponse> {
    const response = await apiClient.post<VentaResponse>('/api/ventas', data)
    return response.data
  },

  async listar(filtros?: FiltrosVenta): Promise<VentaResponse[]> {
    const response = await apiClient.get<VentaResponse[]>('/api/ventas', {
      params: filtros,
    })
    return response.data
  },

  async obtener(id: number): Promise<VentaResponse> {
    const response = await apiClient.get<VentaResponse>(`/api/ventas/${id}`)
    return response.data
  },

  async obtenerPorFactura(numeroFactura: string): Promise<VentaResponse> {
    const response = await apiClient.get<VentaResponse>(`/api/ventas/factura/${numeroFactura}`)
    return response.data
  },

  async reembolsar(id: number, data: ReembolsoRequest): Promise<ReembolsoResponse> {
    const response = await apiClient.post<ReembolsoResponse>(`/api/ventas/${id}/reembolso`, data)
    return response.data
  },
}
