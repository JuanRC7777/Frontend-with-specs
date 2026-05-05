import { describe, it, expect } from 'vitest'
import { formatCurrency } from '../../utils/formatCurrency'

describe('formatCurrency', () => {
  it('formatea números positivos correctamente', () => {
    const result = formatCurrency(50000)
    expect(result).toContain('50')
  })

  it('formatea cero correctamente', () => {
    const result = formatCurrency(0)
    expect(result).toContain('0')
  })
})