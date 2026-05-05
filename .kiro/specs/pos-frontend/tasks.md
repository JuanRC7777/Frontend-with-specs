# Tasks — Sistema POS Frontend

**Proyecto:** Point of Sale — Vue 3 + TypeScript
**Versión:** 1.0.0

---

## 1. Configuración Inicial del Proyecto

- [ ] 1.1 Crear proyecto con Vite: `npm create vite@latest pos-frontend -- --template vue-ts`
- [ ] 1.2 Instalar dependencias de producción
  - [ ] 1.2.1 `vue-router`
  - [ ] 1.2.2 `axios`
  - [ ] 1.2.3 `pinia`
  - [ ] 1.2.4 `tailwindcss`, `postcss`, `autoprefixer`
- [ ] 1.3 Instalar dependencias de desarrollo y testing
  - [ ] 1.3.1 `vitest`
  - [ ] 1.3.2 `@vue/test-utils`
  - [ ] 1.3.3 `@testing-library/vue`, `@testing-library/jest-dom`
  - [ ] 1.3.4 `jsdom`
  - [ ] 1.3.5 `msw` (Mock Service Worker)
  - [ ] 1.3.6 `fast-check` (property-based testing)
- [ ] 1.4 Configurar Tailwind CSS (`tailwind.config.ts`, `postcss.config.js`, importar en `src/style.css`)
- [ ] 1.5 Configurar Vitest en `vite.config.ts`
  - [ ] 1.5.1 Entorno `jsdom`
  - [ ] 1.5.2 `setupFiles` apuntando a `src/setupTests.ts`
  - [ ] 1.5.3 Umbral de cobertura del 80% en `composables/` y `utils/`
- [ ] 1.6 Crear `src/setupTests.ts` con `import '@testing-library/jest-dom'`
- [ ] 1.7 Crear estructura de carpetas: `views/`, `components/`, `composables/`, `services/`, `stores/`, `types/`, `router/`, `utils/`, `__tests__/`
- [ ] 1.8 Configurar variable de entorno `VITE_API_URL` en `.env` y `.env.example`

---

## 2. Tipos TypeScript (DTOs)

- [ ] 2.1 Crear `types/auth.types.ts`
  - [ ] 2.1.1 `LoginRequest { username, password }`
  - [ ] 2.1.2 `LoginResponse { token, username, expiresIn }`
- [ ] 2.2 Crear `types/producto.types.ts`
  - [ ] 2.2.1 `Producto { id, nombre, descripcion, precio, stock, activo }`
  - [ ] 2.2.2 `CrearProductoRequest { nombre, descripcion, precio, stock }`
- [ ] 2.3 Crear `types/venta.types.ts`
  - [ ] 2.3.1 `ItemVenta { productoId, cantidad }`
  - [ ] 2.3.2 `RegistrarVentaRequest { items: ItemVenta[] }`
  - [ ] 2.3.3 `VentaResponse { id, total, fecha, detalles }`
  - [ ] 2.3.4 `DetalleVentaResponse { productoId, nombreProducto, cantidad, precioUnitario, subtotal }`
  - [ ] 2.3.5 `ItemCarrito { producto: Producto, cantidad, subtotal }`

---

## 3. Utilidades Puras

- [ ] 3.1 Crear `utils/calcularTotal.ts`
  - [ ] 3.1.1 `calcularTotal(items: ItemCarrito[]): number` — suma de subtotales
  - [ ] 3.1.2 `calcularSubtotal(precio: number, cantidad: number): number`
- [ ] 3.2 Crear `utils/formatCurrency.ts`
  - [ ] 3.2.1 `formatCurrency(value: number): string` — formato moneda local
- [ ] 3.3 Tests unitarios y de propiedades — `__tests__/utils/calcularTotal.test.ts`
  - [ ] 3.3.1 `calcularTotal` retorna 0 con carrito vacío
  - [ ] 3.3.2 `calcularTotal` suma subtotales correctamente
  - [ ] 3.3.3 `calcularSubtotal` multiplica precio por cantidad
  - [ ] 3.3.4 `calcularSubtotal` retorna 0 con cantidad 0
  - [ ] 3.3.5 PBT: `calcularTotal` siempre equivale a `reduce` de subtotales (fast-check)
  - [ ] 3.3.6 PBT: `calcularTotal` es monótonamente creciente al agregar items con subtotal > 0
- [ ] 3.4 Tests unitarios — `__tests__/utils/formatCurrency.test.ts`
  - [ ] 3.4.1 `formatCurrency` formatea números positivos correctamente
  - [ ] 3.4.2 `formatCurrency` formatea cero correctamente

---

## 4. API Client y Servicios HTTP

- [ ] 4.1 Crear `services/apiClient.ts`
  - [ ] 4.1.1 Instancia de Axios con `baseURL` desde `VITE_API_URL`
  - [ ] 4.1.2 Interceptor de request: inyectar `Authorization: Bearer <token>` desde `authStore`
  - [ ] 4.1.3 Interceptor de response: llamar `authStore.logout()` y redirigir a `/login` si recibe HTTP 401
- [ ] 4.2 Crear `services/authService.ts`
  - [ ] 4.2.1 `login(data: LoginRequest): Promise<LoginResponse>` → `POST /api/auth/login`
- [ ] 4.3 Crear `services/productoService.ts`
  - [ ] 4.3.1 `listar(): Promise<Producto[]>` → `GET /api/productos`
  - [ ] 4.3.2 `obtener(id: number): Promise<Producto>` → `GET /api/productos/{id}`
  - [ ] 4.3.3 `crear(data: CrearProductoRequest): Promise<Producto>` → `POST /api/productos`
  - [ ] 4.3.4 `actualizar(id: number, data: CrearProductoRequest): Promise<Producto>` → `PUT /api/productos/{id}`
  - [ ] 4.3.5 `eliminar(id: number): Promise<void>` → `DELETE /api/productos/{id}`
- [ ] 4.4 Crear `services/ventaService.ts`
  - [ ] 4.4.1 `registrar(data: RegistrarVentaRequest): Promise<VentaResponse>` → `POST /api/ventas`
  - [ ] 4.4.2 `listar(): Promise<VentaResponse[]>` → `GET /api/ventas`
- [ ] 4.5 Tests de servicios — `__tests__/services/authService.test.ts`
  - [ ] 4.5.1 `login` retorna token cuando el backend responde 200
  - [ ] 4.5.2 `login` lanza error cuando el backend responde 401
- [ ] 4.6 Tests de servicios — `__tests__/services/productoService.test.ts`
  - [ ] 4.6.1 `listar` retorna lista de productos
  - [ ] 4.6.2 `crear` envía datos correctos al backend
  - [ ] 4.6.3 `eliminar` llama DELETE con el id correcto
- [ ] 4.7 Tests de servicios — `__tests__/services/ventaService.test.ts`
  - [ ] 4.7.1 `registrar` envía items al backend
  - [ ] 4.7.2 `registrar` lanza error cuando hay stock insuficiente (HTTP 400)

---

## 5. Store Global — Autenticación (Pinia)

- [ ] 5.1 Crear `stores/authStore.ts` con Pinia
  - [ ] 5.1.1 Estado: `token: string | null`, `username: string | null`
  - [ ] 5.1.2 Acción `setAuth(token, username)`: guarda en store y `localStorage`
  - [ ] 5.1.3 Acción `logout()`: limpia store y `localStorage`
  - [ ] 5.1.4 Inicialización desde `localStorage` al cargar la app
- [ ] 5.2 Tests del store — `__tests__/stores/authStore.test.ts`
  - [ ] 5.2.1 PBT: después de `setAuth(token, username)`, el store refleja exactamente esos valores
  - [ ] 5.2.2 Después de `logout()`, `token` y `username` son `null`

---

## 6. Composables de Lógica de Negocio

- [ ] 6.1 Crear `composables/useAuth.ts`
  - [ ] 6.1.1 `login(data: LoginRequest)`: llama a `authService.login()`, guarda token en store, navega a `/pos`
  - [ ] 6.1.2 `logout()`: llama a `authStore.logout()`, navega a `/login`
  - [ ] 6.1.3 Expone `{ login, logout, isAuthenticated, username }`
- [ ] 6.2 Crear `composables/useProductos.ts`
  - [ ] 6.2.1 Estado reactivo: `productos`, `loading`, `error`
  - [ ] 6.2.2 `cargar()`: llama a `productoService.listar()`
  - [ ] 6.2.3 `crear(data)`: llama a `productoService.crear()`, actualiza lista
  - [ ] 6.2.4 `actualizar(id, data)`: llama a `productoService.actualizar()`, actualiza lista
  - [ ] 6.2.5 `eliminar(id)`: llama a `productoService.eliminar()`, actualiza lista
- [ ] 6.3 Crear `composables/useCarrito.ts`
  - [ ] 6.3.1 Estado reactivo: `items: Ref<ItemCarrito[]>`
  - [ ] 6.3.2 `agregar(producto, cantidad)`: agrega o incrementa item, calcula subtotal con `calcularSubtotal`
  - [ ] 6.3.3 `eliminar(productoId)`: elimina item del carrito
  - [ ] 6.3.4 `vaciar()`: limpia el carrito
  - [ ] 6.3.5 `total`: `computed` que usa `calcularTotal(items.value)` (utilidad pura)
  - [ ] 6.3.6 `confirmar()`: valida carrito no vacío, llama a `ventaService.registrar()`, vacía carrito
- [ ] 6.4 Crear `composables/useVentas.ts`
  - [ ] 6.4.1 `listar()`: llama a `ventaService.listar()`
  - [ ] 6.4.2 Expone `{ ventas, loading, error }`
- [ ] 6.5 Tests unitarios — `__tests__/composables/useAuth.test.ts`
  - [ ] 6.5.1 `login` guarda token en store cuando las credenciales son válidas
  - [ ] 6.5.2 `login` expone error cuando las credenciales son inválidas
  - [ ] 6.5.3 `logout` limpia el token del store
- [ ] 6.6 Tests unitarios y de propiedades — `__tests__/composables/useCarrito.test.ts`
  - [ ] 6.6.1 `agregar` calcula subtotal correctamente
  - [ ] 6.6.2 `agregar` incrementa cantidad si el producto ya existe en el carrito
  - [ ] 6.6.3 `eliminar` quita el item del carrito
  - [ ] 6.6.4 `total` se actualiza reactivamente al agregar productos
  - [ ] 6.6.5 `confirmar` lanza error con carrito vacío
  - [ ] 6.6.6 `confirmar` vacía el carrito tras procesar la venta
  - [ ] 6.6.7 PBT: después de `agregar(producto, cantidad)`, el item existe con cantidad >= cantidad
  - [ ] 6.6.8 PBT: después de `eliminar(productoId)`, ningún item tiene ese productoId
  - [ ] 6.6.9 PBT: después de `vaciar()`, `items.value.length === 0` y `total.value === 0`
- [ ] 6.7 Tests unitarios — `__tests__/composables/useProductos.test.ts`
  - [ ] 6.7.1 `cargar` popula la lista de productos
  - [ ] 6.7.2 `crear` agrega el producto a la lista
  - [ ] 6.7.3 `eliminar` quita el producto de la lista

---

## 7. Enrutamiento

- [ ] 7.1 Crear `router/index.ts` con Vue Router 4
  - [ ] 7.1.1 Ruta pública: `/login` → `LoginView`
  - [ ] 7.1.2 Rutas protegidas con `meta: { requiresAuth: true }`: `/productos` → `ProductosView`, `/pos` → `PosView`
  - [ ] 7.1.3 Ruta raíz `/` redirige a `/pos`
- [ ] 7.2 Agregar navigation guard en `router/index.ts`
  - [ ] 7.2.1 Si la ruta requiere auth y no hay token, redirigir a `/login`
  - [ ] 7.2.2 Si el usuario ya está autenticado y accede a `/login`, redirigir a `/pos`
- [ ] 7.3 Registrar el router en `main.ts` junto con Pinia

---

## 8. Componentes Compartidos

- [ ] 8.1 Crear `components/shared/Navbar.vue`
  - [ ] 8.1.1 Muestra links a `/productos` y `/pos`
  - [ ] 8.1.2 Muestra nombre del usuario autenticado desde `authStore`
  - [ ] 8.1.3 Botón de logout que llama a `useAuth().logout()`
- [ ] 8.2 Crear `components/shared/LoadingSpinner.vue`
- [ ] 8.3 Crear `components/shared/ErrorAlert.vue` — recibe `message: string` como prop

---

## 9. Módulo de Autenticación

- [ ] 9.1 Crear `components/auth/LoginForm.vue`
  - [ ] 9.1.1 Campos: username, password (con `v-model`)
  - [ ] 9.1.2 Validación cliente: campos requeridos antes de emitir submit
  - [ ] 9.1.3 Muestra error si `useAuth().login()` falla
  - [ ] 9.1.4 Muestra `LoadingSpinner` durante la petición
- [ ] 9.2 Crear `views/LoginView.vue`
  - [ ] 9.2.1 Renderiza `LoginForm`
  - [ ] 9.2.2 Redirige a `/pos` si ya hay token al montar
- [ ] 9.3 Tests de componentes — `__tests__/components/LoginForm.test.ts`
  - [ ] 9.3.1 Renderiza campos de usuario y password
  - [ ] 9.3.2 Muestra error si los campos están vacíos al hacer submit
  - [ ] 9.3.3 Llama al composable `useAuth().login()` con los datos correctos
  - [ ] 9.3.4 Muestra spinner durante la petición

---

## 10. Módulo de Productos

- [ ] 10.1 Crear `components/productos/ProductoTable.vue`
  - [ ] 10.1.1 Tabla con columnas: nombre, precio, stock, acciones (editar, eliminar)
  - [ ] 10.1.2 Botón "Nuevo Producto" que emite evento para abrir el formulario
  - [ ] 10.1.3 Muestra `LoadingSpinner` mientras carga
- [ ] 10.2 Crear `components/productos/ProductoForm.vue`
  - [ ] 10.2.1 Campos: nombre, descripción, precio, stock (con `v-model`)
  - [ ] 10.2.2 Validaciones: nombre requerido, precio > 0, stock >= 0
  - [ ] 10.2.3 Prop opcional `producto?: Producto` para modo edición
  - [ ] 10.2.4 Llama a `useProductos().crear()` o `useProductos().actualizar()` según corresponda
- [ ] 10.3 Crear `views/ProductosView.vue`
  - [ ] 10.3.1 Usa `useProductos` para cargar y gestionar productos
  - [ ] 10.3.2 Renderiza `ProductoTable` y `ProductoForm` (modal o panel lateral)
- [ ] 10.4 Tests de componentes — `__tests__/components/ProductoForm.test.ts`
  - [ ] 10.4.1 Renderiza formulario vacío para nuevo producto
  - [ ] 10.4.2 Precarga datos cuando recibe prop `producto`
  - [ ] 10.4.3 Muestra error si precio es cero
  - [ ] 10.4.4 Muestra error si stock es negativo
  - [ ] 10.4.5 Llama al método correcto del composable con datos válidos

---

## 11. Módulo POS — Registro de Ventas

- [ ] 11.1 Crear `components/pos/ProductoSelector.vue`
  - [ ] 11.1.1 Lista de productos disponibles con stock > 0
  - [ ] 11.1.2 Input de cantidad por producto
  - [ ] 11.1.3 Botón "Agregar al carrito" que llama a `useCarrito().agregar()`
- [ ] 11.2 Crear `components/pos/CarritoItem.vue`
  - [ ] 11.2.1 Muestra nombre, cantidad, precio unitario y subtotal formateado
  - [ ] 11.2.2 Botón para eliminar el item que llama a `useCarrito().eliminar()`
- [ ] 11.3 Crear `components/pos/CarritoVenta.vue`
  - [ ] 11.3.1 Lista de `CarritoItem`
  - [ ] 11.3.2 Muestra total general formateado con `formatCurrency`
  - [ ] 11.3.3 Botón "Confirmar Venta" deshabilitado si `items.length === 0`
  - [ ] 11.3.4 Muestra `ErrorAlert` si el backend retorna stock insuficiente
- [ ] 11.4 Crear `components/pos/ResumenVenta.vue`
  - [ ] 11.4.1 Muestra confirmación tras venta exitosa con detalles de la venta
- [ ] 11.5 Crear `views/PosView.vue`
  - [ ] 11.5.1 Usa `useProductos` para cargar productos
  - [ ] 11.5.2 Usa `useCarrito` para gestionar el carrito
  - [ ] 11.5.3 Renderiza `ProductoSelector` y `CarritoVenta` en layout de dos columnas
- [ ] 11.6 Tests de componentes — `__tests__/components/CarritoVenta.test.ts`
  - [ ] 11.6.1 Renderiza carrito vacío inicialmente
  - [ ] 11.6.2 Muestra total actualizado al agregar productos
  - [ ] 11.6.3 Deshabilita botón "Confirmar" con carrito vacío
  - [ ] 11.6.4 Muestra error cuando el backend retorna 400
  - [ ] 11.6.5 Vacía el carrito tras procesar venta exitosa

---

## 12. Testing — Cobertura y Calidad

- [ ] 12.1 Ejecutar todos los tests: `npx vitest run`
- [ ] 12.2 Generar reporte de cobertura: `npx vitest run --coverage`
- [ ] 12.3 Verificar cobertura ≥ 80% en `composables/` y `utils/`
- [ ] 12.4 Verificar que ningún test de composable o utilidad hace llamadas HTTP reales
- [ ] 12.5 Verificar que los tests de componentes usan mocks de composables (no servicios reales)

---

## 13. Despliegue

- [ ] 13.1 Configurar `.env.production` con `VITE_API_URL` apuntando al backend en producción
- [ ] 13.2 Generar build de producción: `npm run build`
- [ ] 13.3 Verificar que el build en `dist/` funciona correctamente
- [ ] 13.4 Crear `Dockerfile` para servir el build con Nginx
- [ ] 13.5 Configurar Nginx para manejar rutas SPA (redirect a `index.html`)
- [ ] 13.6 Documentar variables de entorno y pasos de despliegue en `README.md`
