<template>
  <div class="space-y-4 mt-4 border-t pt-4">
    <h3 class="text-lg font-bold">Datos del Cliente y Pago</h3>

    <!-- Datos del cliente -->
    <div class="space-y-2">
      <div>
        <label class="block text-sm font-medium text-gray-700">Nombre del cliente</label>
        <input
          v-model="datosCliente.nombreCliente"
          type="text"
          placeholder="Ej: María García"
          class="w-full border rounded px-3 py-2 text-sm"
          :class="{ 'border-red-500': nombreError }"
        />
        <p v-if="nombreError" class="text-red-500 text-xs mt-1">{{ nombreError }}</p>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700">Cédula del cliente</label>
        <input
          v-model="datosCliente.cedulaCliente"
          type="text"
          maxlength="10"
          placeholder="10 dígitos"
          class="w-full border rounded px-3 py-2 text-sm"
          :class="{ 'border-red-500': cedulaError }"
        />
        <p v-if="cedulaError" class="text-red-500 text-xs mt-1">{{ cedulaError }}</p>
      </div>
    </div>

    <!-- Métodos de pago -->
    <div>
      <div class="flex justify-between items-center mb-2">
        <label class="block text-sm font-medium text-gray-700">Métodos de pago</label>
        <button @click="agregarPago" type="button" class="text-blue-600 text-sm hover:underline">
          + Agregar método
        </button>
      </div>

      <div v-for="(pago, index) in pagos" :key="index" class="flex gap-2 mb-2">
        <select v-model="pago.metodoPago" class="border rounded px-2 py-1 text-sm flex-1">
          <option value="EFECTIVO">Efectivo</option>
          <option value="TARJETA">Tarjeta</option>
          <option value="TRANSFERENCIA">Transferencia</option>
        </select>
        <input
          v-model.number="pago.monto"
          type="number"
          min="0"
          step="0.01"
          placeholder="Monto"
          class="border rounded px-2 py-1 text-sm w-28"
        />
        <button
          v-if="pagos.length > 1"
          @click="eliminarPago(index)"
          type="button"
          class="text-red-500 text-sm"
        >✕</button>
      </div>

      <!-- Validación suma de pagos -->
      <div class="text-sm mt-2">
        <span :class="sumaPagosValida ? 'text-green-600' : 'text-red-500'">
          Suma pagos: {{ formatCurrency(sumaPagos) }} / Total: {{ formatCurrency(total) }}
          {{ sumaPagosValida ? '✓' : '✗' }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { formatCurrency } from '../../utils/formatCurrency'
import { validarCedula, validarNombreCliente, validarSumaPagos } from '../../utils/validaciones'
import type { PagoRequest } from '../../types/venta.types'

const props = defineProps<{
  datosCliente: { nombreCliente: string; cedulaCliente: string }
  pagos: PagoRequest[]
  total: number
}>()

const nombreError = computed(() => {
  if (!props.datosCliente.nombreCliente) return null
  return validarNombreCliente(props.datosCliente.nombreCliente) ? null : 'Mínimo 2 palabras, solo letras, 3–50 caracteres'
})

const cedulaError = computed(() => {
  if (!props.datosCliente.cedulaCliente) return null
  return validarCedula(props.datosCliente.cedulaCliente) ? null : 'Debe tener exactamente 10 dígitos numéricos'
})

const sumaPagos = computed(() => props.pagos.reduce((acc, p) => acc + (p.monto || 0), 0))
const sumaPagosValida = computed(() => validarSumaPagos(props.pagos, props.total))

function agregarPago() {
  props.pagos.push({ metodoPago: 'EFECTIVO', monto: 0 })
}

function eliminarPago(index: number) {
  props.pagos.splice(index, 1)
}
</script>
