<template>
  <div>
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Productos</h2>
      <button
        @click="$emit('nuevo')"
        class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Nuevo Producto
      </button>
    </div>

    <LoadingSpinner v-if="loading" />

    <table v-else class="w-full border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2 text-left">Nombre</th>
          <th class="border p-2 text-right">Precio</th>
          <th class="border p-2 text-right">Stock</th>
          <th class="border p-2 text-center">Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="producto in productos" :key="producto.id" class="hover:bg-gray-50">
          <td class="border p-2">{{ producto.nombre }}</td>
          <td class="border p-2 text-right">${{ producto.precio }}</td>
          <td class="border p-2 text-right">{{ producto.stock }}</td>
          <td class="border p-2 text-center space-x-2">
            <button
              @click="$emit('editar', producto)"
              class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm"
            >
              Editar
            </button>
            <button
              @click="$emit('eliminar', producto.id)"
              class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
            >
              Eliminar
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="!loading && productos.length === 0" class="text-gray-500 text-center py-4">
      No hay productos registrados.
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Producto } from '../../types/producto.types'
import LoadingSpinner from '../shared/LoadingSpinner.vue'

defineProps<{
  productos: Producto[]
  loading: boolean
}>()

defineEmits<{
  nuevo: []
  editar: [producto: Producto]
  eliminar: [id: number]
}>()
</script>