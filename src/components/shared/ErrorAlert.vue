<template>
  <div v-if="message || (errors && Object.keys(errors).length > 0)"
    class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
  >
    <p v-if="message" class="font-medium">{{ message }}</p>
    <ul v-if="errors && Object.keys(errors).length > 0" class="mt-1 list-disc list-inside text-sm">
      <li v-for="(msg, field) in errors" :key="field">
        <span class="font-medium">{{ field }}:</span> {{ msg }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  message?: string | null
  errors?: Record<string, string> | null
}>()
</script>
