import type { ItemCarrito } from '../types/venta.types'

export function calcularSubtotal(precio: number, cantidad: number): number {
  return precio * cantidad
}

export function calcularTotal(items: ItemCarrito[]): number {
  return items.reduce((acc, item) => acc + item.subtotal, 0)
}