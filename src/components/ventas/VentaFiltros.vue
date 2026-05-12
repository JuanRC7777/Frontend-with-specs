<template>
  <div class="bg-white p-4 rounded shadow mb-4">
    <h3 class="font-bold mb-3">Filtros</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
        <input v-model="filtroLocal.fecha" type="date" class="w-full border rounded px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Cédula cliente</label>
        <input v-model="filtroLocal.cedulaCliente" type="text" maxlength="10" placeholder="10 dígitos" class="w-full border rounded px-3 py-2 text-sm" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
        <select v-model="filtroLocal.metodoPago" class="w-full border rounded px-3 py-2 text-sm">
          <option value="">Todos</option>
          <option value="EFECTIVO">Efectivo</option>
          <option value="TARJETA">Tarjeta</option>
          <option value="TRANSFERENCIA">Transferencia</option>
        </select>
      </div>
    </div>
    <div class="flex gap-2 mt-3">
      <button @click="buscar" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm">Buscar</button>
      <button @click="limpiar" class="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 text-sm">Limpiar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import type { FiltrosVenta, MetodoPago } from '../../types/venta.types'

const emit = defineEmits<{
  buscar: [filtros: FiltrosVenta]
  limpiar: []
}>()

const filtroLocal = reactive<{ fecha: string; cedulaCliente: string; metodoPago: MetodoPago | '' }>({
  fecha: '',
  cedulaCliente: '',
  metodoPago: '',
})

function buscar() {
  const filtros: FiltrosVenta = {}
  if (filtroLocal.fecha) filtros.fecha = filtroLocal.fecha
  if (filtroLocal.cedulaCliente) filtros.cedulaCliente = filtroLocal.cedulaCliente
  if (filtroLocal.metodoPago) filtros.metodoPago = filtroLocal.metodoPago
  emit('buscar', filtros)
}

function limpiar() {
  filtroLocal.fecha = ''
  filtroLocal.cedulaCliente = ''
  filtroLocal.metodoPago = ''
  emit('limpiar')
}
</script>
