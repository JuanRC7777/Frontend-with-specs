import { ref, computed } from 'vue'
import { ventaService } from '../services/ventaService'
import { calcularSubtotal, calcularTotal } from '../utils/calcularTotal'
import type { Producto } from '../types/producto.types'
import type { ItemCarrito } from '../types/venta.types'

export function useCarrito() {
  const items = ref<ItemCarrito[]>([])

  const total = computed(() => calcularTotal(items.value))

  function agregar(producto: Producto, cantidad: number) {
    const existente = items.value.find((i) => i.producto.id === producto.id)
    if (existente) {
      existente.cantidad += cantidad
      existente.subtotal = calcularSubtotal(producto.precio, existente.cantidad)
    } else {
      items.value.push({
        producto,
        cantidad,
        subtotal: calcularSubtotal(producto.precio, cantidad),
      })
    }
  }

  function eliminar(productoId: number) {
    items.value = items.value.filter((i) => i.producto.id !== productoId)
  }

  function vaciar() {
    items.value = []
  }

  async function confirmar() {
    if (items.value.length === 0) throw new Error('El carrito está vacío')
    await ventaService.registrar({
      items: items.value.map((i) => ({
        productoId: i.producto.id,
        cantidad: i.cantidad,
      })),
    })
    vaciar()
  }

  return { items, agregar, eliminar, vaciar, total, confirmar }
}