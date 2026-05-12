import { describe, it, expect, vi, beforeEach } from 'vitest'
import { configuracionService } from '../../services/configuracionService'

vi.mock('../../services/apiClient', () => ({
  default: {
    get: vi.fn(),
    put: vi.fn(),
  },
}))

import apiClient from '../../services/apiClient'

describe('configuracionService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 4.7.1 — obtenerTasaImpuesto retorna valorDecimal correctamente
  it('obtenerTasaImpuesto retorna valorDecimal correctamente', async () => {
    const mockResponse = {
      clave: 'TASA_IMPUESTO',
      valor: '0.15',
      valorDecimal: 0.15,
    }
    ;(apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse })

    const result = await configuracionService.obtenerTasaImpuesto()

    expect(result).toEqual(mockResponse)
    expect(result.valorDecimal).toBe(0.15)
    expect(apiClient.get).toHaveBeenCalledWith('/api/configuracion/tasa-impuesto')
  })

  // 4.7.2 — actualizarTasaImpuesto envía el valor correcto al backend
  it('actualizarTasaImpuesto envía el valor correcto al backend', async () => {
    const request = { tasaImpuesto: 0.12 }
    const mockResponse = {
      clave: 'TASA_IMPUESTO',
      valor: '0.12',
      valorDecimal: 0.12,
    }
    ;(apiClient.put as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockResponse })

    const result = await configuracionService.actualizarTasaImpuesto(request)

    expect(result).toEqual(mockResponse)
    expect(apiClient.put).toHaveBeenCalledWith('/api/configuracion/tasa-impuesto', request)
    expect(apiClient.put).toHaveBeenCalledWith(
      '/api/configuracion/tasa-impuesto',
      expect.objectContaining({ tasaImpuesto: 0.12 }),
    )
  })
})
