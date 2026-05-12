<template>
  <div v-if="venta" class="bg-white rounded shadow p-4">
    <div class="flex justify-between items-start mb-4">
      <h3 class="font-bold text-lg">Detalle de Venta</h3>
      <button @click="$emit('cerrar')" class="text-gray-500 hover:text-gray-700">✕</button>
    </div>

    <div class="space-y-2 text-sm mb-4">
      <p><span class="font-medium">Factura:</span> <span class="font-mono">{{ venta.numeroFactura }}</span></p>
      <p><span class="font-medium">Cajero:</span> {{ venta.nombreCajero }}</p>
      <p><span class="font-medium">Cliente:</span> {{ venta.nombreCliente }}</p>
      <p><span class="font-medium">Cédula:</span> {{ venta.cedulaCliente }}</p>
      <p><span class="font-medium">Fecha:</span> {{ new Date(venta.fecha).toLocaleString('es-CO') }}</p>
    </div>

    <!-- Ítems -->
    <table class="w-full text-sm mb-4 border-t pt-2">
      <thead><tr class="text-gray-600"><th class="text-left py-1">Producto</th><th class="text-right py-1">Cant.</th><th class="text-right py-1">Precio</th><th class="text-right py-1">Subtotal</th></tr></thead>
      <tbody>
        <tr v-for="d in venta.detalles" :key="d.productoId" class="border-t">
          <td class="py-1">{{ d.nombreProducto }}</td>
          <td class="text-right py-1">{{ d.cantidad }}</td>
          <td class="text-right py-1">{{ formatCurrency(d.precioUnit) }}</td>
          <td class="text-right py-1">{{ formatCurrency(d.subtotal) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totales -->
    <div class="text-sm text-right space-y-1 border-t pt-2 mb-4">
      <p>Subtotal: {{ formatCurrency(venta.subtotal) }}</p>
      <p>Impuesto ({{ (venta.tasaImpuesto * 100).toFixed(0) }}%): {{ formatCurrency(venta.impuesto) }}</p>
      <p class="font-bold text-base">Total: {{ formatCurrency(venta.total) }}</p>
    </div>

    <!-- Pagos -->
    <div class="text-sm mb-4">
      <p class="font-medium mb-1">Pagos:</p>
      <div v-for="p in venta.pagos" :key="p.id" class="flex justify-between">
        <span>{{ p.metodoPago }}</span><span>{{ formatCurrency(p.monto) }}</span>
      </div>
    </div>

    <!-- Estado reembolso -->
    <div v-if="venta.reembolsada && venta.reembolso" class="bg-red-50 border border-red-200 rounded p-3 text-sm mb-4">
      <span class="font-medium text-red-700">Reembolsada</span>
      <p class="text-gray-600 mt-1">{{ venta.reembolso.motivo }}</p>
      <p class="text-gray-500 text-xs">{{ new Date(venta.reembolso.fecha).toLocaleString('es-CO') }} — {{ venta.reembolso.nombreUsuario }}</p>
    </div>

    <button v-if="!venta.reembolsada" @click="$emit('reembolsar', venta.id)" class="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm">
      Reembolsar venta
    </button>
  </div>
</template>

<script setup lang="ts">
import type { VentaResponse } from '../../types/venta.types'
import { formatCurrency } from '../../utils/formatCurrency'

defineProps<{ venta: VentaResponse | null }>()
defineEmits<{ cerrar: []; reembolsar: [id: number] }>()
</script>
