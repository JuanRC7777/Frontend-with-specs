import { ref } from 'vue'
import { ventaService } from '../services/ventaService'
import type { VentaResponse } from '../types/venta.types'

export function useVentas() {
  const ventas = ref<VentaResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function listar() {
    loading.value = true
    error.value = null
    try {
      ventas.value = await ventaService.listar()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar ventas'
    } finally {
      loading.value = false
    }
  }

  return { ventas, loading, error, listar }
}