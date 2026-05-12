import apiClient from './apiClient'
import type { ConfiguracionResponse, ActualizarTasaRequest } from '../types/configuracion.types'

export const configuracionService = {
  async obtenerTasaImpuesto(): Promise<ConfiguracionResponse> {
    const response = await apiClient.get<ConfiguracionResponse>('/api/configuracion/tasa-impuesto')
    return response.data
  },

  async actualizarTasaImpuesto(data: ActualizarTasaRequest): Promise<ConfiguracionResponse> {
    const response = await apiClient.put<ConfiguracionResponse>('/api/configuracion/tasa-impuesto', data)
    return response.data
  },
}
