<template>
  <div>
    <h3 class="text-lg font-bold mb-3">Productos Disponibles</h3>

    <div v-if="productos.length === 0" class="text-gray-500">
      No hay productos disponibles.
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="producto in productos"
        :key="producto.id"
        class="flex items-center justify-between border rounded p-2"
      >
        <div>
          <p class="font-medium">{{ producto.nombre }}</p>
          <p class="text-sm text-gray-600">${{ producto.precio }} - Stock: {{ producto.stock }}</p>
        </div>
        <div class="flex items-center gap-2">
          <input
            v-model.number="cantidades[producto.id]"
            type="number"
            min="1"
            :max="producto.stock"
            class="w-16 border rounded px-2 py-1 text-center"
          />
          <button
            @click="agregarAlCarrito(producto)"
            class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { Producto } from '../../types/producto.types'
import { useCarrito } from '../../composables/useCarrito'

defineProps<{
  productos: Producto[]
}>()

const { agregar } = useCarrito()

const cantidades = reactive<Record<number, number>>({})

function agregarAlCarrito(producto: Producto) {
  const cantidad = cantidades[producto.id] || 1
  if (cantidad < 1) return
  if (cantidad > producto.stock) {
    alert('Stock insuficiente')
    return
  }
  agregar(producto, cantidad)
  cantidades[producto.id] = 1
}
</script>