<template>
  <form @submit.prevent="handleSubmit" class="max-w-sm mx-auto mt-10 space-y-4">
    <h2 class="text-2xl font-bold text-center">Iniciar Sesión</h2>

    <ErrorAlert :message="error" />

    <div>
      <label class="block text-sm font-medium mb-1">Usuario</label>
      <input
        v-model="username"
        type="text"
        required
        class="w-full border rounded px-3 py-2"
        placeholder="Ingrese su usuario"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-1">Contraseña</label>
      <input
        v-model="password"
        type="password"
        required
        class="w-full border rounded px-3 py-2"
        placeholder="Ingrese su contraseña"
      />
    </div>

    <button
      type="submit"
      :disabled="loading"
      class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      Ingresar
    </button>

    <LoadingSpinner v-if="loading" />
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuth } from '../../composables/useAuth'
import ErrorAlert from '../shared/ErrorAlert.vue'
import LoadingSpinner from '../shared/LoadingSpinner.vue'

const { login } = useAuth()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref<string | null>(null)

async function handleSubmit() {
  if (!username.value.trim() || !password.value.trim()) {
    error.value = 'Todos los campos son requeridos'
    return
  }

  loading.value = true
  error.value = null

  try {
    await login({
      username: username.value.trim(),
      password: password.value,
    })
  } catch (e: any) {
    error.value = e.response?.data?.message || 'Credenciales inválidas'
  } finally {
    loading.value = false
  }
}
</script>