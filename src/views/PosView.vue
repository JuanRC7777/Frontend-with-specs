<template>
  <div>
    <Navbar />
    <div class="max-w-6xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Punto de Venta</h1>

      <ErrorAlert :message="errorProductos" />

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-4 rounded shadow">
          <ProductoSelector :productos="productosDisponibles" />
        </div>

        <div class="bg-white p-4 rounded shadow">
          <CarritoVenta
            :items="items"
            :total="total"
            :loading="procesandoVenta"
            :error="errorVenta"
            @eliminar="eliminar"
            @confirmar="handleConfirmar"
          />

          <ResumenVenta
            v-if="ventaExitosa"
            :total="ultimaVenta?.total || 0"
            :fecha="ultimaVenta?.fecha || ''"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useProductos } from '../composables/useProductos'
import { useCarrito } from '../composables/useCarrito'
import type { VentaResponse } from '../types/venta.types'
import Navbar from '../components/shared/Navbar.vue'
import ErrorAlert from '../components/shared/ErrorAlert.vue'
import ProductoSelector from '../components/pos/ProductoSelector.vue'
import CarritoVenta from '../components/pos/CarritoVenta.vue'
import ResumenVenta from '../components/pos/ResumenVenta.vue'

const { productos, error: errorProductos, cargar } = useProductos()
const { items, eliminar, total, confirmar } = useCarrito()

const procesandoVenta = ref(false)
const errorVenta = ref<string | null>(null)
const ventaExitosa = ref(false)
const ultimaVenta = ref<VentaResponse | null>(null)

const productosDisponibles = computed(() =>
  productos.value.filter((p) => p.activo && p.stock > 0)
)

onMounted(() => {
  cargar()
})

async function handleConfirmar() {
  procesandoVenta.value = true
  errorVenta.value = null
  ventaExitosa.value = false

  try {
    ultimaVenta.value = await confirmar()
    ventaExitosa.value = true
  } catch (e: any) {
    errorVenta.value = e.response?.data?.message || 'Error al procesar la venta'
  } finally {
    procesandoVenta.value = false
  }
}
</script>