<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="bg-white p-8 rounded shadow-md w-full max-w-md">
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'
import LoginForm from '../components/auth/LoginForm.vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  if (authStore.token) {
    router.push('/pos')
  }
})
</script>