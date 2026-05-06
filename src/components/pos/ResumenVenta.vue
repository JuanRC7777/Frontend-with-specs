<template>
  <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4">
    <p class="font-bold text-lg">✅ Venta registrada exitosamente</p>
    <p>Total: {{ formatCurrency(total) }}</p>
    <p>Fecha: {{ fecha }}</p>
  </div>
</template>

<script setup lang="ts">
import { formatCurrency } from '../../utils/formatCurrency'

defineProps<{
  total: number
  fecha: string
}>()
</script>