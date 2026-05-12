import { describe, it, expect } from 'vitest'
import fc from 'fast-check'
import {
  validarCedula,
  validarNombreCliente,
  validarSumaPagos,
} from '../../utils/validaciones'
import type { PagoRequest } from '../../types/venta.types'

// ─── validarCedula ────────────────────────────────────────────────────────────

describe('validarCedula', () => {
  // 3.5.1 — acepta exactamente 10 dígitos
  it('acepta exactamente 10 dígitos', () => {
    expect(validarCedula('1234567890')).toBe(true)
    expect(validarCedula('0000000000')).toBe(true)
    expect(validarCedula('9999999999')).toBe(true)
  })

  // 3.5.2 — rechaza longitud distinta de 10
  it('rechaza strings con longitud distinta de 10', () => {
    expect(validarCedula('')).toBe(false)
    expect(validarCedula('123456789')).toBe(false)   // 9 dígitos
    expect(validarCedula('12345678901')).toBe(false) // 11 dígitos
    expect(validarCedula('123')).toBe(false)
  })

  // 3.5.3 — rechaza caracteres no numéricos
  it('rechaza strings con caracteres no numéricos', () => {
    expect(validarCedula('123456789a')).toBe(false)
    expect(validarCedula('123 567890')).toBe(false)
    expect(validarCedula('12345-7890')).toBe(false)
    expect(validarCedula('abcdefghij')).toBe(false)
  })

  // 3.5.9 — PBT: solo acepta strings de exactamente 10 dígitos
  // Validates: Requirements 3.3.1
  it('PBT: solo acepta strings de exactamente 10 dígitos', () => {
    // Propiedad positiva: cualquier string de exactamente 10 dígitos debe ser válido
    fc.assert(
      fc.property(
        fc.stringMatching(/^\d{10}$/),
        (cedula) => {
          expect(validarCedula(cedula)).toBe(true)
        }
      )
    )

    // Propiedad negativa: strings con longitud != 10 o con no-dígitos deben ser inválidos
    fc.assert(
      fc.property(
        fc.oneof(
          // longitud distinta de 10 con solo dígitos
          fc.stringMatching(/^\d{1,9}$/),
          fc.stringMatching(/^\d{11,20}$/),
          // contiene al menos un no-dígito
          fc.stringMatching(/^[a-zA-Z\s\-]{1,15}$/)
        ),
        (cedula) => {
          expect(validarCedula(cedula)).toBe(false)
        }
      )
    )
  })
})

// ─── validarNombreCliente ─────────────────────────────────────────────────────

describe('validarNombreCliente', () => {
  // 3.5.4 — acepta nombre con 2+ palabras dentro del rango
  it('acepta nombre con 2+ palabras dentro del rango de caracteres', () => {
    expect(validarNombreCliente('Juan Pérez')).toBe(true)
    expect(validarNombreCliente('María José García')).toBe(true)
    expect(validarNombreCliente('Ana López')).toBe(true)
    expect(validarNombreCliente('José Ñoño')).toBe(true)
  })

  // 3.5.5 — rechaza nombre con 1 sola palabra
  it('rechaza nombre con 1 sola palabra', () => {
    expect(validarNombreCliente('Juan')).toBe(false)
    expect(validarNombreCliente('María')).toBe(false)
    expect(validarNombreCliente('Pedro')).toBe(false)
  })

  // 3.5.6 — rechaza nombre con caracteres especiales no permitidos
  it('rechaza nombre con caracteres especiales no permitidos', () => {
    expect(validarNombreCliente('Juan Pérez123')).toBe(false)
    expect(validarNombreCliente('Juan P@rez')).toBe(false)
    expect(validarNombreCliente('Juan Pérez!')).toBe(false)
    expect(validarNombreCliente('Juan-Pérez')).toBe(false)
  })

  it('rechaza nombre fuera del rango de longitud', () => {
    // menos de 3 caracteres
    expect(validarNombreCliente('AB')).toBe(false)
    // más de 50 caracteres
    expect(validarNombreCliente('A'.repeat(26) + ' ' + 'B'.repeat(25))).toBe(false)
  })
})

// ─── validarSumaPagos ─────────────────────────────────────────────────────────

describe('validarSumaPagos', () => {
  // 3.5.7 — retorna true cuando la suma es exactamente el total
  it('retorna true cuando la suma de pagos es exactamente el total', () => {
    const pagos: PagoRequest[] = [
      { metodoPago: 'EFECTIVO', monto: 50 },
      { metodoPago: 'TARJETA', monto: 50 },
    ]
    expect(validarSumaPagos(pagos, 100)).toBe(true)
  })

  it('retorna true con un solo pago igual al total', () => {
    const pagos: PagoRequest[] = [{ metodoPago: 'EFECTIVO', monto: 75.5 }]
    expect(validarSumaPagos(pagos, 75.5)).toBe(true)
  })

  it('retorna true con lista vacía y total 0', () => {
    expect(validarSumaPagos([], 0)).toBe(true)
  })

  // 3.5.8 — retorna false cuando la suma difiere del total
  it('retorna false cuando la suma difiere del total', () => {
    const pagos: PagoRequest[] = [{ metodoPago: 'EFECTIVO', monto: 80 }]
    expect(validarSumaPagos(pagos, 100)).toBe(false)
  })

  it('retorna false cuando la suma supera el total', () => {
    const pagos: PagoRequest[] = [
      { metodoPago: 'EFECTIVO', monto: 60 },
      { metodoPago: 'TARJETA', monto: 60 },
    ]
    expect(validarSumaPagos(pagos, 100)).toBe(false)
  })

  // 3.5.10 — PBT: retorna true si y solo si suma === total
  // Validates: Requirements 3.3.3
  it('PBT: retorna true si y solo si la suma de montos iguala el total', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            metodoPago: fc.constantFrom('EFECTIVO' as const, 'TARJETA' as const, 'TRANSFERENCIA' as const),
            monto: fc.float({ min: 0, max: 10000, noNaN: true }),
          }),
          { minLength: 1, maxLength: 5 }
        ),
        (pagos) => {
          const suma = pagos.reduce((acc, p) => acc + p.monto, 0)
          // Cuando el total es exactamente la suma, debe retornar true
          expect(validarSumaPagos(pagos, suma)).toBe(true)
          // Cuando el total difiere en más de la tolerancia, debe retornar false
          const totalDistinto = suma + 1
          expect(validarSumaPagos(pagos, totalDistinto)).toBe(false)
        }
      )
    )
  })
})
