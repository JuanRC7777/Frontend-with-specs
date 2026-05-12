<template>
  <div class="bg-white rounded shadow overflow-hidden">
    <LoadingSpinner v-if="loading" />
    <div v-else>
      <table class="w-full text-sm">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3 text-left font-medium text-gray-600">Factura</th>
            <th class="px-4 py-3 text-left font-medium text-gray-600">Fecha</th>
            <th class="px-4 py-3 text-left font-medium text-gray-600">Cliente</th>
            <th class="px-4 py-3 text-right font-medium text-gray-600">Total</th>
            <th class="px-4 py-3 text-center font-medium text-gray-600">Estado</th>
            <th class="px-4 py-3 text-center font-medium text-gray-600">Acciones</th>
          </tr>
        </thead>
        <tbody class="divide-y">
          <tr v-for="venta in ventas" :key="venta.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 font-mono text-xs">{{ venta.numeroFactura }}</td>
            <td class="px-4 py-3">{{ new Date(venta.fecha).toLocaleDateString('es-CO') }}</td>
            <td class="px-4 py-3">{{ venta.nombreCliente }}</td>
            <td class="px-4 py-3 text-right">{{ formatCurrency(venta.total) }}</td>
            <td class="px-4 py-3 text-center">
              <span :class="venta.reembolsada ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'" class="px-2 py-1 rounded-full text-xs font-medium">
                {{ venta.reembolsada ? 'Reembolsada' : 'Activa' }}
              </span>
            </td>
            <td class="px-4 py-3 text-center">
              <button @click="$emit('ver', venta)" class="text-blue-600 hover:underline text-xs">Ver detalle</button>
            </td>
          </tr>
          <tr v-if="ventas.length === 0">
            <td colspan="6" class="px-4 py-8 text-center text-gray-500">No se encontraron ventas</td>
          </tr>
        </tbody>
      </table>
      <!-- Paginación -->
      <div class="flex justify-between items-center px-4 py-3 border-t text-sm">
        <button @click="$emit('pagina', pagina - 1)" :disabled="pagina === 0" class="px-3 py-1 border rounded disabled:opacity-50">Anterior</button>
        <span class="text-gray-600">Página {{ pagina + 1 }}</span>
        <button @click="$emit('pagina', pagina + 1)" :disabled="ventas.length < tamano" class="px-3 py-1 border rounded disabled:opacity-50">Siguiente</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VentaResponse } from '../../types/venta.types'
import { formatCurrency } from '../../utils/formatCurrency'
import LoadingSpinner from '../shared/LoadingSpinner.vue'

defineProps<{
  ventas: VentaResponse[]
  loading: boolean
  pagina: number
  tamano: number
}>()

defineEmits<{
  ver: [venta: VentaResponse]
  pagina: [numero: number]
}>()
</script>
