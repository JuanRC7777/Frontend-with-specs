import type { PagoRequest } from '../types/venta.types'

export function validarCedula(cedula: string): boolean {
  return /^\d{10}$/.test(cedula)
}

export function validarNombreCliente(nombre: string): boolean {
  if (nombre.length < 3 || nombre.length > 50) return false
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return false
  return nombre.trim().split(/\s+/).length >= 2
}

export function validarSumaPagos(pagos: PagoRequest[], total: number): boolean {
  const suma = pagos.reduce((acc, p) => acc + p.monto, 0)
  return Math.abs(suma - total) < 0.001
}
