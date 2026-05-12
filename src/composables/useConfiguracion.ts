import { ref } from 'vue'
import { configuracionService } from '../services/configuracionService'

export function useConfiguracion() {
  const tasaImpuesto = ref<number>(0)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function cargarTasa() {
    loading.value = true
    try {
      const config = await configuracionService.obtenerTasaImpuesto()
      tasaImpuesto.value = config.valorDecimal
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar tasa de impuesto'
    } finally {
      loading.value = false
    }
  }

  async function actualizarTasa(nuevaTasa: number) {
    loading.value = true
    error.value = null
    try {
      const config = await configuracionService.actualizarTasaImpuesto({ tasaImpuesto: nuevaTasa })
      tasaImpuesto.value = config.valorDecimal
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al actualizar tasa de impuesto'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { tasaImpuesto, loading, error, cargarTasa, actualizarTasa }
}
