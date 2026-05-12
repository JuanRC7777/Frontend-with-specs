import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './style.css'

async function bootstrap() {
  // MSW deshabilitado — conectando al backend real en VITE_API_URL
  // Para habilitar mocks: descomentar las líneas siguientes
  // if (import.meta.env.DEV) {
  //   const { worker } = await import('./mocks/browser')
  //   await worker.start({ onUnhandledRequest: 'bypass' })
  // }

  const app = createApp(App)
  app.use(createPinia())
  app.use(router)
  app.mount('#app')
}

bootstrap()