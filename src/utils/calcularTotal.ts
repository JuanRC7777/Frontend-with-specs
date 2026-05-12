import type { ItemCarrito } from '../types/venta.types'

export function calcularSubtotal(precio: number, cantidad: number): number {
  return precio * cantidad
}

export function calcularSubtotalGeneral(items: ItemCarrito[]): number {
  return items.reduce((acc, i) => acc + i.subtotal, 0)
}

export function calcularImpuesto(subtotal: number, tasa: number): number {
  return subtotal * tasa
}

export function calcularTotal(subtotal: number, tasa: number): number {
  return subtotal + subtotal * tasa
}
