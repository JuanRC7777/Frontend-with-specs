<template>
  <nav class="bg-gray-800 text-white p-4 flex justify-between items-center">
    <div class="flex gap-4">
      <router-link to="/pos" class="hover:text-gray-300">POS</router-link>
      <router-link to="/productos" class="hover:text-gray-300">Productos</router-link>
    </div>
    <div class="flex items-center gap-4">
      <span>{{ username }}</span>
      <button
        @click="handleLogout"
        class="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-sm"
      >
        Cerrar sesión
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'

const { username, logout } = useAuth()

function handleLogout() {
  logout()
}
</script>