import { describe, it, expect, vi, beforeEach } from 'vitest'
import { ventaService } from '../../services/ventaService'

vi.mock('../../services/apiClient', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

import apiClient from '../../services/apiClient'

const mockVentaResponse = {
  id: 1,
  numeroFactura: 'FAC-001',
  usuarioId: 10,
  nombreCajero: 'Admin',
  nombreCliente: 'Juan Pérez',
  cedulaCliente: '1234567890',
  detalles: [
    { productoId: 1, nombreProducto: 'Producto A', cantidad: 2, precioUnit: 10, subtotal: 20 },
  ],
  pagos: [{ id: 1, metodoPago: 'EFECTIVO', monto: 22 }],
  subtotal: 20,
  tasaImpuesto: 0.1,
  impuesto: 2,
  total: 22,
  fecha: '2026-05-05T18:00:00',
  reembolsada: false,
  reembolso: null,
}

describe('ventaService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 4.6.1 — registrar envía nombreCliente, cedulaCliente, items y pagos al backend
  it('registrar envía nombreCliente, cedulaCliente, items y pagos al backend', async () => {
    const ventaRequest = {
      nombreCliente: 'Juan Pérez',
      cedulaCliente: '1234567890',
      items: [{ productoId: 1, cantidad: 2 }],
      pagos: [{ metodoPago: 'EFECTIVO' as const, monto: 22 }],
    }
    ;(apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockVentaResponse })

    const result = await ventaService.registrar(ventaRequest)

    expect(result).toEqual(mockVentaResponse)
    expect(apiClient.post).toHaveBeenCalledWith('/api/ventas', ventaRequest)
    expect(apiClient.post).toHaveBeenCalledWith('/api/ventas', expect.objectContaining({
      nombreCliente: 'Juan Pérez',
      cedulaCliente: '1234567890',
      items: [{ productoId: 1, cantidad: 2 }],
      pagos: [{ metodoPago: 'EFECTIVO', monto: 22 }],
    }))
  })

  // 4.6.2 — listar pasa filtros como query params correctamente
  it('listar pasa filtros como query params correctamente', async () => {
    const filtros = {
      fecha: '2026-05-05',
      cedulaCliente: '1234567890',
      metodoPago: 'EFECTIVO' as const,
      page: 0,
      size: 10,
    }
    ;(apiClient.get as ReturnType<typeof vi.fn>).mockResolvedValue({ data: [mockVentaResponse] })

    const result = await ventaService.listar(filtros)

    expect(result).toEqual([mockVentaResponse])
    expect(apiClient.get).toHaveBeenCalledWith('/api/ventas', { params: filtros })
  })

  // 4.6.3 — reembolsar llama POST /api/ventas/{id}/reembolso con el motivo
  it('reembolsar llama POST /api/ventas/{id}/reembolso con el motivo', async () => {
    const ventaId = 5
    const reembolsoRequest = { motivo: 'Producto defectuoso' }
    const mockReembolsoResponse = {
      id: 1,
      ventaId: 5,
      motivo: 'Producto defectuoso',
      fecha: '2026-05-06T10:00:00',
      usuarioId: 10,
      nombreUsuario: 'Admin',
    }
    ;(apiClient.post as ReturnType<typeof vi.fn>).mockResolvedValue({ data: mockReembolsoResponse })

    const result = await ventaService.reembolsar(ventaId, reembolsoRequest)

    expect(result).toEqual(mockReembolsoResponse)
    expect(apiClient.post).toHaveBeenCalledWith(
      `/api/ventas/${ventaId}/reembolso`,
      reembolsoRequest,
    )
  })

  // 4.6.4 — registrar lanza error cuando el backend retorna 400
  it('registrar lanza error cuando el backend retorna 400', async () => {
    const mockError = {
      response: { status: 400, data: { message: 'Stock insuficiente para producto 1' } },
    }
    ;(apiClient.post as ReturnType<typeof vi.fn>).mockRejectedValue(mockError)

    const ventaRequest = {
      nombreCliente: 'Juan Pérez',
      cedulaCliente: '1234567890',
      items: [{ productoId: 1, cantidad: 999 }],
      pagos: [{ metodoPago: 'EFECTIVO' as const, monto: 100 }],
    }

    await expect(ventaService.registrar(ventaRequest)).rejects.toEqual(mockError)
  })
})
