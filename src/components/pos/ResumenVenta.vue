<template>
  <div class="bg-green-50 border border-green-400 rounded p-4 mt-4">
    <p class="font-bold text-lg text-green-700 mb-3">✅ Venta registrada exitosamente</p>
    <div class="space-y-1 text-sm">
      <p><span class="font-medium">Factura:</span> {{ venta.numeroFactura }}</p>
      <p><span class="font-medium">Cajero:</span> {{ venta.nombreCajero }}</p>
      <p><span class="font-medium">Cliente:</span> {{ venta.nombreCliente }}</p>
      <p><span class="font-medium">Cédula:</span> {{ venta.cedulaCliente }}</p>
      <p><span class="font-medium">Fecha:</span> {{ new Date(venta.fecha).toLocaleString('es-CO') }}</p>
      <div class="border-t pt-2 mt-2">
        <p>Subtotal: {{ formatCurrency(venta.subtotal) }}</p>
        <p>Impuesto ({{ (venta.tasaImpuesto * 100).toFixed(0) }}%): {{ formatCurrency(venta.impuesto) }}</p>
        <p class="font-bold text-base">Total: {{ formatCurrency(venta.total) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '../../utils/formatCurrency'
import type { VentaResponse } from '../../types/venta.types'

defineProps<{
  venta: VentaResponse
}>()
</script>
