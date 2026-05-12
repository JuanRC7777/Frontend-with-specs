import { describe, it, expect } from 'vitest'
import {
  calcularSubtotal,
  calcularSubtotalGeneral,
  calcularImpuesto,
  calcularTotal,
} from '../../utils/calcularTotal'
import fc from 'fast-check'
import type { ItemCarrito } from '../../types/venta.types'

describe('calcularSubtotal', () => {
  it('multiplica precio por cantidad', () => {
    expect(calcularSubtotal(10, 5)).toBe(50)
  })

  it('retorna 0 con cantidad 0', () => {
    expect(calcularSubtotal(100, 0)).toBe(0)
  })
})

describe('calcularSubtotalGeneral', () => {
  it('retorna 0 con carrito vacío', () => {
    expect(calcularSubtotalGeneral([])).toBe(0)
  })

  it('suma subtotales correctamente', () => {
    const items: ItemCarrito[] = [
      { producto: {} as any, cantidad: 2, subtotal: 30 },
      { producto: {} as any, cantidad: 1, subtotal: 20 },
    ]
    expect(calcularSubtotalGeneral(items)).toBe(50)
  })

  it('PBT: siempre equivale a reduce de subtotales', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            producto: fc.constant({} as any),
            cantidad: fc.integer({ min: 1, max: 100 }),
            subtotal: fc.float({ min: 0, max: 1000, noNaN: true }),
          })
        ),
        (items) => {
          const expected = items.reduce((acc, i) => acc + i.subtotal, 0)
          expect(calcularSubtotalGeneral(items as ItemCarrito[])).toBeCloseTo(expected)
        }
      )
    )
  })

  it('PBT: es monótonamente creciente al agregar items con subtotal > 0', () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            producto: fc.constant({} as any),
            cantidad: fc.integer({ min: 1, max: 100 }),
            subtotal: fc.float({ min: 0, max: 1000, noNaN: true }),
          })
        ),
        (items) => {
          const totalAntes = calcularSubtotalGeneral(items as ItemCarrito[])
          const nuevoItem: ItemCarrito = {
            producto: {} as any,
            cantidad: 1,
            subtotal: 50,
          }
          const itemsConNuevo = [...items, nuevoItem] as ItemCarrito[]
          const totalDespues = calcularSubtotalGeneral(itemsConNuevo)
          expect(totalDespues).toBeGreaterThanOrEqual(totalAntes)
        }
      )
    )
  })
})

describe('calcularImpuesto', () => {
  it('calcula correctamente con tasa 0.05', () => {
    expect(calcularImpuesto(100, 0.05)).toBeCloseTo(5)
  })

  it('retorna 0 con tasa 0', () => {
    expect(calcularImpuesto(200, 0)).toBe(0)
  })
})

describe('calcularTotal', () => {
  it('es subtotal + impuesto', () => {
    expect(calcularTotal(100, 0.05)).toBeCloseTo(105)
  })

  it('PBT: calcularTotal(s, t) === s + s * t para cualquier s >= 0 y t en [0, 1]', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 10000, noNaN: true }),
        fc.float({ min: 0, max: 1, noNaN: true }),
        (subtotal, tasa) => {
          const expected = subtotal + subtotal * tasa
          expect(calcularTotal(subtotal, tasa)).toBeCloseTo(expected)
        }
      )
    )
  })
})
