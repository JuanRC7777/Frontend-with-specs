import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(localStorage.getItem('token'))
  const username = ref<string | null>(localStorage.getItem('username'))
  const nombre = ref<string | null>(localStorage.getItem('nombre'))

  function setAuth(newToken: string, newUsername: string, newNombre: string) {
    token.value = newToken
    username.value = newUsername
    nombre.value = newNombre
    localStorage.setItem('token', newToken)
    localStorage.setItem('username', newUsername)
    localStorage.setItem('nombre', newNombre)
  }

  function logout() {
    token.value = null
    username.value = null
    nombre.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('nombre')
  }

  return { token, username, nombre, setAuth, logout }
})
