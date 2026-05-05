import { describe, it, expect } from 'vitest'
import { calcularTotal, calcularSubtotal } from '../../utils/calcularTotal'
import fc from 'fast-check'
import type { ItemCarrito } from '../../types/venta.types'

describe('calcularTotal', () => {
  it('retorna 0 con carrito vacío', () => {
    expect(calcularTotal([])).toBe(0)
  })

  it('suma subtotales correctamente', () => {
    const items: ItemCarrito[] = [
      { producto: {} as any, cantidad: 2, subtotal: 30 },
      { producto: {} as any, cantidad: 1, subtotal: 20 },
    ]
    expect(calcularTotal(items)).toBe(50)
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
          expect(calcularTotal(items as ItemCarrito[])).toBeCloseTo(expected)
        }
      )
    )
  })

  it('PBT: calcularTotal es monótonamente creciente', () => {
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
          const totalAntes = calcularTotal(items as ItemCarrito[])
          const nuevoItem: ItemCarrito = {
            producto: {} as any,
            cantidad: 1,
            subtotal: 50,
          }
          const itemsConNuevo = [...items, nuevoItem] as ItemCarrito[]
          const totalDespues = calcularTotal(itemsConNuevo)
          expect(totalDespues).toBeGreaterThanOrEqual(totalAntes)
        }
      )
    )
  })
})

describe('calcularSubtotal', () => {
  it('multiplica precio por cantidad', () => {
    expect(calcularSubtotal(10, 5)).toBe(50)
  })

  it('retorna 0 con cantidad 0', () => {
    expect(calcularSubtotal(100, 0)).toBe(0)
  })
})