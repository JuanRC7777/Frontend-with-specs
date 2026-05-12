import { ref, reactive, computed } from 'vue'
import { ventaService } from '../services/ventaService'
import {
  calcularSubtotal,
  calcularSubtotalGeneral,
  calcularImpuesto,
  calcularTotal,
} from '../utils/calcularTotal'
import { validarCedula, validarNombreCliente, validarSumaPagos } from '../utils/validaciones'
import type { Producto } from '../types/producto.types'
import type { ItemCarrito, PagoRequest } from '../types/venta.types'

export function useCarrito() {
  const items = ref<ItemCarrito[]>([])
  const tasaImpuesto = ref<number>(0)
  const datosCliente = reactive({ nombreCliente: '', cedulaCliente: '' })
  const pagos = ref<PagoRequest[]>([])

  const subtotal = computed(() => calcularSubtotalGeneral(items.value))
  const impuesto = computed(() => calcularImpuesto(subtotal.value, tasaImpuesto.value))
  const total = computed(() => calcularTotal(subtotal.value, tasaImpuesto.value))

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
    pagos.value = []
    datosCliente.nombreCliente = ''
    datosCliente.cedulaCliente = ''
  }

  async function confirmar() {
    if (items.value.length === 0) throw new Error('El carrito está vacío')
    if (!validarNombreCliente(datosCliente.nombreCliente))
      throw new Error('Nombre del cliente inválido')
    if (!validarCedula(datosCliente.cedulaCliente))
      throw new Error('Cédula del cliente inválida')
    if (!validarSumaPagos(pagos.value, total.value))
      throw new Error('La suma de pagos no coincide con el total')

    const resultado = await ventaService.registrar({
      nombreCliente: datosCliente.nombreCliente,
      cedulaCliente: datosCliente.cedulaCliente,
      items: items.value.map((i) => ({
        productoId: i.producto.id,
        cantidad: i.cantidad,
      })),
      pagos: pagos.value,
    })
    vaciar()
    return resultado
  }

  return {
    items,
    tasaImpuesto,
    datosCliente,
    pagos,
    subtotal,
    impuesto,
    total,
    agregar,
    eliminar,
    vaciar,
    confirmar,
  }
}
