import { ref, reactive } from 'vue'
import { ventaService } from '../services/ventaService'
import type { VentaResponse, FiltrosVenta } from '../types/venta.types'

export function useVentas() {
  const ventas = ref<VentaResponse[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  const filtros = reactive<FiltrosVenta>({ page: 0, size: 20 })

  async function cargar() {
    loading.value = true
    error.value = null
    try {
      ventas.value = await ventaService.listar({ ...filtros })
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar ventas'
    } finally {
      loading.value = false
    }
  }

  async function reembolsar(id: number, motivo: string) {
    loading.value = true
    error.value = null
    try {
      const reembolso = await ventaService.reembolsar(id, { motivo })
      const venta = ventas.value.find((v) => v.id === id)
      if (venta) {
        venta.reembolsada = true
        venta.reembolso = reembolso
      }
      return reembolso
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al procesar reembolso'
      throw e
    } finally {
      loading.value = false
    }
  }

  return { ventas, loading, error, filtros, cargar, reembolsar }
}
