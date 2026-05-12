<template>
  <div class="bg-white rounded shadow p-4">
    <h3 class="font-bold mb-3">Procesar Reembolso</h3>
    <div class="mb-3">
      <label class="block text-sm font-medium text-gray-700 mb-1">Motivo del reembolso</label>
      <textarea
        v-model="motivo"
        rows="4"
        :maxlength="500"
        placeholder="Describe el motivo del reembolso (mínimo 10 caracteres)"
        class="w-full border rounded px-3 py-2 text-sm resize-none"
        :class="{ 'border-red-500': motivoError }"
      ></textarea>
      <div class="flex justify-between text-xs mt-1">
        <span v-if="motivoError" class="text-red-500">{{ motivoError }}</span>
        <span v-else class="text-gray-400"></span>
        <span :class="motivo.length < 10 ? 'text-red-500' : 'text-gray-500'">{{ motivo.length }}/500</span>
      </div>
    </div>
    <div class="flex gap-2">
      <button @click="$emit('cancelar')" class="flex-1 bg-gray-200 text-gray-700 py-2 rounded hover:bg-gray-300 text-sm">Cancelar</button>
      <button @click="confirmar" :disabled="!motivoValido || loading" class="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 text-sm disabled:opacity-50">
        {{ loading ? 'Procesando...' : 'Confirmar Reembolso' }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = defineProps<{ loading?: boolean }>()
const emit = defineEmits<{ confirmar: [motivo: string]; cancelar: [] }>()

const motivo = ref('')

const motivoValido = computed(() => motivo.value.length >= 10 && motivo.value.length <= 500)
const motivoError = computed(() => {
  if (!motivo.value) return null
  if (motivo.value.length < 10) return 'El motivo debe tener al menos 10 caracteres'
  if (motivo.value.length > 500) return 'El motivo no puede superar 500 caracteres'
  return null
})

function confirmar() {
  if (motivoValido.value) emit('confirmar', motivo.value)
}
</script>
