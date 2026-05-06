import { ref } from 'vue'
import { productoService } from '../services/productoService'
import type { Producto, CrearProductoRequest } from '../types/producto.types'

export function useProductos() {
  const productos = ref<Producto[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function cargar() {
    loading.value = true
    error.value = null
    try {
      productos.value = await productoService.listar()
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al cargar productos'
    } finally {
      loading.value = false
    }
  }

  async function crear(data: CrearProductoRequest) {
    loading.value = true
    error.value = null
    try {
      const nuevo = await productoService.crear(data)
      productos.value.push(nuevo)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al crear producto'
    } finally {
      loading.value = false
    }
  }

  async function actualizar(id: number, data: CrearProductoRequest) {
    loading.value = true
    error.value = null
    try {
      const actualizado = await productoService.actualizar(id, data)
      const index = productos.value.findIndex((p) => p.id === id)
      if (index !== -1) productos.value[index] = actualizado
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al actualizar producto'
    } finally {
      loading.value = false
    }
  }

  async function eliminar(id: number) {
    loading.value = true
    error.value = null
    try {
      await productoService.eliminar(id)
      productos.value = productos.value.filter((p) => p.id !== id)
    } catch (e: any) {
      error.value = e.response?.data?.message || 'Error al eliminar producto'
    } finally {
      loading.value = false
    }
  }

  return { productos, loading, error, cargar, crear, actualizar, eliminar }
}