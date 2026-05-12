<template>
  <div>
    <Navbar />
    <div class="max-w-2xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6">Configuración</h1>

      <div class="bg-white rounded shadow p-6">
        <h2 class="text-lg font-semibold mb-4">Tasa de Impuesto</h2>

        <div v-if="loading" class="text-gray-500 text-sm">Cargando...</div>
        <div v-else>
          <p class="text-sm text-gray-600 mb-4">
            Tasa actual: <span class="font-bold text-lg">{{ (tasaImpuesto * 100).toFixed(1) }}%</span>
          </p>

          <div class="flex gap-3 items-end">
            <div class="flex-1">
              <label class="block text-sm font-medium text-gray-700 mb-1">Nueva tasa (%)</label>
              <input
                v-model.number="nuevaTasaPorcentaje"
                type="number"
                min="0"
                max="100"
                step="0.1"
                class="w-full border rounded px-3 py-2"
              />
            </div>
            <button
              @click="guardar"
              :disabled="loading || nuevaTasaPorcentaje < 0 || nuevaTasaPorcentaje > 100"
              class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Guardar
            </button>
          </div>

          <p v-if="mensaje" :class="mensajeExito ? 'text-green-600' : 'text-red-600'" class="mt-3 text-sm">
            {{ mensaje }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfiguracion } from '../composables/useConfiguracion'
import Navbar from '../components/shared/Navbar.vue'

const { tasaImpuesto, loading, cargarTasa, actualizarTasa } = useConfiguracion()
const nuevaTasaPorcentaje = ref(0)
const mensaje = ref('')
const mensajeExito = ref(false)

onMounted(async () => {
  await cargarTasa()
  nuevaTasaPorcentaje.value = tasaImpuesto.value * 100
})

async function guardar() {
  try {
    await actualizarTasa(nuevaTasaPorcentaje.value / 100)
    mensaje.value = 'Tasa actualizada correctamente'
    mensajeExito.value = true
  } catch {
    mensaje.value = 'Error al actualizar la tasa'
    mensajeExito.value = false
  }
}
</script>
