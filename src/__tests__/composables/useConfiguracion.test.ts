import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useConfiguracion } from '../../composables/useConfiguracion'

vi.mock('../../services/configuracionService', () => ({
  configuracionService: {
    obtenerTasaImpuesto: vi.fn(),
    actualizarTasaImpuesto: vi.fn(),
  },
}))

import { configuracionService } from '../../services/configuracionService'

describe('useConfiguracion', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // 6.7.1: cargarTasa setea tasaImpuesto con el valorDecimal del backend
  it('6.7.1: cargarTasa setea tasaImpuesto con el valorDecimal del backend', async () => {
    ;(configuracionService.obtenerTasaImpuesto as any).mockResolvedValue({
      clave: 'TASA_IMPUESTO',
      valor: '0.12',
      valorDecimal: 0.12,
    })

    const { cargarTasa, tasaImpuesto } = useConfiguracion()
    await cargarTasa()

    expect(tasaImpuesto.value).toBe(0.12)
  })

  // 6.7.2: actualizarTasa llama al servicio con el valor correcto
  it('6.7.2: actualizarTasa llama al servicio con el valor correcto', async () => {
    ;(configuracionService.actualizarTasaImpuesto as any).mockResolvedValue({
      clave: 'TASA_IMPUESTO',
      valor: '0.15',
      valorDecimal: 0.15,
    })

    const { actualizarTasa, tasaImpuesto } = useConfiguracion()
    await actualizarTasa(0.15)

    expect(configuracionService.actualizarTasaImpuesto).toHaveBeenCalledWith({
      tasaImpuesto: 0.15,
    })
    expect(tasaImpuesto.value).toBe(0.15)
  })
})
