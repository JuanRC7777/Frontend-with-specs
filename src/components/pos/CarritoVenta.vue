<template>
  <div>
    <h3 class="text-lg font-bold mb-3">Carrito de Venta</h3>

    <div v-if="items.length === 0" class="text-gray-500 text-center py-4">
      El carrito está vacío
    </div>

    <div v-else class="space-y-2">
      <CarritoItem
        v-for="item in items"
        :key="item.producto.id"
        :item="item"
        @eliminar="$emit('eliminar', $event)"
      />

      <div class="border-t pt-3 mt-3 text-right">
        <p class="text-xl font-bold">
          Total: {{ formatCurrency(total) }}
        </p>
      </div>
    </div>

    <ErrorAlert :message="error" />

    <button
      @click="$emit('confirmar')"
      :disabled="items.length === 0 || loading"
      class="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {{ loading ? 'Procesando...' : 'Confirmar Venta' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import type { ItemCarrito } from '../../types/venta.types'
import { formatCurrency } from '../../utils/formatCurrency'
import CarritoItem from './CarritoItem.vue'
import ErrorAlert from '../shared/ErrorAlert.vue'

defineProps<{
  items: ItemCarrito[]
  total: number
  loading?: boolean
  error: string | null
}>()

defineEmits<{
  eliminar: [productoId: number]
  confirmar: []
}>()
</script>