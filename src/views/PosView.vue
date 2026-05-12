<template>
  <div>
    <Navbar />
    <div class="max-w-6xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Punto de Venta</h1>

      <ErrorAlert :message="errorProductos" />

      <div v-if="ventaExitosa && ultimaVenta" class="mb-4">
        <ResumenVenta :venta="ultimaVenta" />
        <button @click="ventaExitosa = false" class="mt-2 text-blue-600 hover:underline text-sm">
          Nueva venta
        </button>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Columna izquierda: productos -->
        <div class="bg-white p-4 rounded shadow">
          <ProductoSelector :productos="productosDisponibles" :on-agregar="agregar" />
        </div>

        <!-- Columna derecha: carrito + pago -->
        <div class="bg-white p-4 rounded shadow">
          <CarritoVenta
            :items="items"
            :subtotal="subtotal"
            :impuesto="impuesto"
            :total="total"
            :tasaImpuesto="tasaImpuesto"
            :loading="procesandoVenta"
            :error="errorVenta"
            @eliminar="eliminar"
            @confirmar="handleConfirmar"
          />
          <PagoForm
            :datosCliente="datosCliente"
            :pagos="pagos"
            :total="total"
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
import { useConfiguracion } from '../composables/useConfiguracion'
import type { VentaResponse } from '../types/venta.types'
import Navbar from '../components/shared/Navbar.vue'
import ErrorAlert from '../components/shared/ErrorAlert.vue'
import ProductoSelector from '../components/pos/ProductoSelector.vue'
import CarritoVenta from '../components/pos/CarritoVenta.vue'
import PagoForm from '../components/pos/PagoForm.vue'
import ResumenVenta from '../components/pos/ResumenVenta.vue'

const { productos, error: errorProductos, cargar } = useProductos()
const carrito = useCarrito()
const { items, agregar, eliminar, subtotal, impuesto, total, tasaImpuesto, datosCliente, pagos, confirmar } = carrito
const { cargarTasa, tasaImpuesto: tasaConfig } = useConfiguracion()

const procesandoVenta = ref(false)
const errorVenta = ref<string | null>(null)
const ventaExitosa = ref(false)
const ultimaVenta = ref<VentaResponse | null>(null)

const productosDisponibles = computed(() =>
  productos.value.filter((p) => p.activo && p.stock > 0)
)

onMounted(async () => {
  await cargarTasa()
  tasaImpuesto.value = tasaConfig.value
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
    errorVenta.value = e.message || e.response?.data?.message || 'Error al procesar la venta'
  } finally {
    procesandoVenta.value = false
  }
}
</script>
