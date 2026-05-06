<template>
  <div>
    <Navbar />
    <div class="max-w-4xl mx-auto p-4">
      <ErrorAlert :message="error" />

      <ProductoTable
        :productos="productos"
        :loading="loading"
        @nuevo="abrirFormulario()"
        @editar="abrirFormulario"
        @eliminar="handleEliminar"
      />

      <div v-if="mostrarForm" class="mt-6 bg-white p-4 rounded shadow">
        <ProductoForm
          :producto="productoSeleccionado"
          @submit="handleSubmit"
          @cancelar="cerrarFormulario"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useProductos } from '../composables/useProductos'
import type { Producto } from '../types/producto.types'
import Navbar from '../components/shared/Navbar.vue'
import ErrorAlert from '../components/shared/ErrorAlert.vue'
import ProductoTable from '../components/productos/ProductoTable.vue'
import ProductoForm from '../components/productos/ProductoForm.vue'

const { productos, loading, error, cargar, crear, actualizar, eliminar } = useProductos()

const mostrarForm = ref(false)
const productoSeleccionado = ref<Producto | null>(null)

onMounted(() => {
  cargar()
})

function abrirFormulario(producto?: Producto) {
  productoSeleccionado.value = producto || null
  mostrarForm.value = true
}

function cerrarFormulario() {
  mostrarForm.value = false
  productoSeleccionado.value = null
}

async function handleSubmit(data: { nombre: string; descripcion: string; precio: number; stock: number }) {
  if (productoSeleccionado.value) {
    await actualizar(productoSeleccionado.value.id, data)
  } else {
    await crear(data)
  }
  cerrarFormulario()
}

async function handleEliminar(id: number) {
  if (confirm('¿Está seguro de eliminar este producto?')) {
    await eliminar(id)
  }
}
</script>