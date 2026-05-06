<template>
  <div class="flex items-center justify-between border-b py-2">
    <div class="flex-1">
      <p class="font-medium">{{ item.producto.nombre }}</p>
      <p class="text-sm text-gray-600">
        ${{ item.producto.precio }} × {{ item.cantidad }}
      </p>
    </div>
    <div class="flex items-center gap-4">
      <span class="font-bold">${{ item.subtotal }}</span>
      <button
        @click="$emit('eliminar', item.producto.id)"
        class="text-red-500 hover:text-red-700 text-sm"
      >
        ✕
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ItemCarrito } from '../../types/venta.types'

defineProps<{
  item: ItemCarrito
}>()

defineEmits<{
  eliminar: [productoId: number]
}>()
</script>