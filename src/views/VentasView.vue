<template>
  <div>
    <Navbar />
    <div class="max-w-6xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Historial de Ventas</h1>

      <ErrorAlert :message="error" />

      <VentaFiltros @buscar="aplicarFiltros" @limpiar="limpiarFiltros" />

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div class="lg:col-span-2">
          <VentaTable
            :ventas="ventas"
            :loading="loading"
            :pagina="filtros.page ?? 0"
            :tamano="filtros.size ?? 20"
            @ver="seleccionarVenta"
            @pagina="cambiarPagina"
          />
        </div>
        <div v-if="ventaSeleccionada">
          <div v-if="mostrarReembolso">
            <ReembolsoForm :loading="loading" @confirmar="procesarReembolso" @cancelar="mostrarReembolso = false" />
          </div>
          <div v-else>
            <VentaDetalle :venta="ventaSeleccionada" @cerrar="ventaSeleccionada = null" @reembolsar="iniciarReembolso" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useVentas } from '../composables/useVentas'
import type { VentaResponse, FiltrosVenta } from '../types/venta.types'
import Navbar from '../components/shared/Navbar.vue'
import ErrorAlert from '../components/shared/ErrorAlert.vue'
import VentaFiltros from '../components/ventas/VentaFiltros.vue'
import VentaTable from '../components/ventas/VentaTable.vue'
import VentaDetalle from '../components/ventas/VentaDetalle.vue'
import ReembolsoForm from '../components/ventas/ReembolsoForm.vue'

const { ventas, loading, error, filtros, cargar, reembolsar } = useVentas()
const ventaSeleccionada = ref<VentaResponse | null>(null)
const mostrarReembolso = ref(false)

onMounted(() => cargar())

function seleccionarVenta(venta: VentaResponse) {
  ventaSeleccionada.value = venta
  mostrarReembolso.value = false
}

function aplicarFiltros(nuevosFiltros: FiltrosVenta) {
  Object.assign(filtros, nuevosFiltros, { page: 0 })
  cargar()
}

function limpiarFiltros() {
  Object.assign(filtros, { fecha: undefined, cedulaCliente: undefined, metodoPago: undefined, page: 0, size: 20 })
  cargar()
}

function cambiarPagina(numero: number) {
  filtros.page = numero
  cargar()
}

function iniciarReembolso(_id: number) {
  mostrarReembolso.value = true
}

async function procesarReembolso(motivo: string) {
  if (!ventaSeleccionada.value) return
  await reembolsar(ventaSeleccionada.value.id, motivo)
  mostrarReembolso.value = false
}
</script>
