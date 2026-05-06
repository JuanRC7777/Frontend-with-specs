<template>
  <div
    v-if="message"
    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
  >
    {{ message }}
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message: string | null
}>()
</script>