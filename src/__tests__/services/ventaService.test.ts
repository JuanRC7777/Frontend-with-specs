import { describe, it, expect, vi } from 'vitest'
import { ventaService } from '../../services/ventaService'

vi.mock('../../services/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import apiClient from '../../services/apiClient'

describe('ventaService', () => {
  it('registrar envía items al backend', async () => {
    const ventaRequest = {
      items: [
        { productoId: 1, cantidad: 2 },
      ],
    }
    const mockResponse = {
      id: 1,
      total: 20,
      fecha: '2026-05-05T18:00:00',
      detalles: [],
    }
    ;(apiClient.post as any).mockResolvedValue({ data: mockResponse })

    const result = await ventaService.registrar(ventaRequest)
    expect(result).toEqual(mockResponse)
    expect(apiClient.post).toHaveBeenCalledWith('/api/ventas', ventaRequest)
  })

  it('registrar lanza error cuando hay stock insuficiente (HTTP 400)', async () => {
    const mockError = {
      response: { status: 400, data: { message: 'Stock insuficiente para producto 1' } },
    }
    ;(apiClient.post as any).mockRejectedValue(mockError)

    await expect(
      ventaService.registrar({ items: [{ productoId: 1, cantidad: 999 }] })
    ).rejects.toEqual(mockError)
  })
})