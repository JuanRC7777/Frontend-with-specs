<template>
  <form @submit.prevent="handleSubmit" class="space-y-4 max-w-md">
    <h3 class="text-lg font-bold">{{ isEditing ? 'Editar Producto' : 'Nuevo Producto' }}</h3>

    <ErrorAlert :message="error" />

    <div>
      <label class="block text-sm font-medium mb-1">Nombre *</label>
      <input
        v-model="nombre"
        type="text"
        required
        class="w-full border rounded px-3 py-2"
      />
      <p v-if="nombreError" class="text-red-500 text-sm">{{ nombreError }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Descripción</label>
      <textarea
        v-model="descripcion"
        class="w-full border rounded px-3 py-2"
        rows="2"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Precio *</label>
      <input
        v-model.number="precio"
        type="number"
        step="0.01"
        required
        class="w-full border rounded px-3 py-2"
      />
      <p v-if="precioError" class="text-red-500 text-sm">{{ precioError }}</p>
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Stock *</label>
      <input
        v-model.number="stock"
        type="number"
        required
        class="w-full border rounded px-3 py-2"
      />
      <p v-if="stockError" class="text-red-500 text-sm">{{ stockError }}</p>
    </div>

    <div class="flex gap-2">
      <button
        type="submit"
        class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {{ isEditing ? 'Actualizar' : 'Crear' }}
      </button>
      <button
        type="button"
        @click="$emit('cancelar')"
        class="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
      >
        Cancelar
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { Producto } from '../../types/producto.types'
import ErrorAlert from '../shared/ErrorAlert.vue'

const props = defineProps<{
  producto?: Producto | null
}>()

const emit = defineEmits<{
  submit: [data: { nombre: string; descripcion: string; precio: number; stock: number }]
  cancelar: []
}>()

const isEditing = computed(() => !!props.producto)

const nombre = ref('')
const descripcion = ref('')
const precio = ref<number>(0)
const stock = ref<number>(0)
const error = ref<string | null>(null)

const nombreError = ref<string | null>(null)
const precioError = ref<string | null>(null)
const stockError = ref<string | null>(null)

watch(
  () => props.producto,
  (prod) => {
    if (prod) {
      nombre.value = prod.nombre
      descripcion.value = prod.descripcion
      precio.value = prod.precio
      stock.value = prod.stock
    } else {
      nombre.value = ''
      descripcion.value = ''
      precio.value = 0
      stock.value = 0
    }
  },
  { immediate: true }
)

function validate(): boolean {
  nombreError.value = null
  precioError.value = null
  stockError.value = null
  error.value = null

  let valid = true

  if (!nombre.value.trim()) {
    nombreError.value = 'El nombre es requerido'
    valid = false
  }

  if (precio.value <= 0) {
    precioError.value = 'El precio debe ser mayor a cero'
    valid = false
  }

  if (stock.value < 0) {
    stockError.value = 'El stock no puede ser negativo'
    valid = false
  }

  return valid
}

function handleSubmit() {
  if (!validate()) return

  emit('submit', {
    nombre: nombre.value.trim(),
    descripcion: descripcion.value.trim(),
    precio: precio.value,
    stock: stock.value,
  })
}
</script>