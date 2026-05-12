# Tasks — Sistema POS Frontend

**Proyecto:** Point of Sale — Vue 3 + TypeScript
**Versión:** 2.0.0
**Fecha:** 2026-05-10

---

## 1. Configuración Inicial del Proyecto

- [x] 1.1 Verificar dependencias instaladas en `package.json`
- [x] 1.2 Instalar dependencias faltantes de producción
  - [x] 1.2.1 `vue-router`
  - [x] 1.2.2 `axios`
  - [x] 1.2.3 `pinia`
  - [x] 1.2.4 `tailwindcss`, `postcss`, `autoprefixer`
- [x] 1.3 Instalar dependencias de desarrollo y testing
  - [x] 1.3.1 `vitest`
  - [x] 1.3.2 `@vue/test-utils`
  - [x] 1.3.3 `@testing-library/vue`, `@testing-library/jest-dom`
  - [x] 1.3.4 `jsdom`
  - [x] 1.3.5 `msw` (Mock Service Worker)
  - [x] 1.3.6 `fast-check` (property-based testing)
- [x] 1.4 Configurar Tailwind CSS (`tailwind.config.ts`, `postcss.config.js`, importar en `src/style.css`)
- [x] 1.5 Configurar Vitest en `vite.config.ts`
  - [x] 1.5.1 Entorno `jsdom`
  - [x] 1.5.2 `setupFiles` apuntando a `src/setupTests.ts`
  - [x] 1.5.3 Umbral de cobertura del 80% en `composables/` y `utils/`
- [x] 1.6 Crear `src/setupTests.ts` con `import '@testing-library/jest-dom'`
- [x] 1.7 Crear estructura de carpetas nuevas: `components/ventas/`, `views/VentasView.vue`, `views/ConfiguracionView.vue`
- [x] 1.8 Verificar variable de entorno `VITE_API_URL=http://localhost:8081` en `.env`

---

## 2. Tipos TypeScript (DTOs) — Actualización

- [x] 2.1 Actualizar `types/auth.types.ts`
  - [x] 2.1.1 `LoginRequest { username, password }`
  - [x] 2.1.2 `LoginResponse { token, username, nombre }` — reemplazar `expiresIn` por `nombre`
- [x] 2.2 Verificar `types/producto.types.ts` (sin cambios necesarios)
  - [x] 2.2.1 `Producto { id, nombre, descripcion: string | null, precio, stock, activo }`
  - [x] 2.2.2 `CrearProductoRequest { nombre, descripcion?, precio, stock }`
- [x] 2.3 Reescribir `types/venta.types.ts` con tipos completos de la API
  - [x] 2.3.1 `MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'`
  - [x] 2.3.2 `ItemVentaRequest { productoId, cantidad }`
  - [x] 2.3.3 `PagoRequest { metodoPago: MetodoPago, monto }`
  - [x] 2.3.4 `RegistrarVentaRequest { nombreCliente, cedulaCliente, items, pagos }`
  - [x] 2.3.5 `DetalleVentaResponse { productoId, nombreProducto, cantidad, precioUnit, subtotal }`
  - [x] 2.3.6 `PagoResponse { id, metodoPago, monto }`
  - [x] 2.3.7 `ReembolsoResponse { id, ventaId, motivo, fecha, usuarioId, nombreUsuario }`
  - [x] 2.3.8 `VentaResponse` completo con todos los campos de la API
  - [x] 2.3.9 `ReembolsoRequest { motivo }` — 10–500 caracteres
  - [x] 2.3.10 `FiltrosVenta { fecha?, cedulaCliente?, metodoPago?, page?, size? }`
  - [x] 2.3.11 `ItemCarrito { producto: Producto, cantidad, subtotal }`
- [x] 2.4 Crear `types/configuracion.types.ts`
  - [x] 2.4.1 `ConfiguracionResponse { clave, valor, valorDecimal }`
  - [x] 2.4.2 `ActualizarTasaRequest { tasaImpuesto }` — entre 0.0 y 1.0

---

## 3. Utilidades Puras — Actualización

- [x] 3.1 Actualizar `utils/calcularTotal.ts` para incluir impuesto
  - [x] 3.1.1 `calcularSubtotal(precio, cantidad): number` — `precio * cantidad`
  - [x] 3.1.2 `calcularSubtotalGeneral(items: ItemCarrito[]): number` — suma de subtotales
  - [x] 3.1.3 `calcularImpuesto(subtotal, tasa): number` — `subtotal * tasa`
  - [x] 3.1.4 `calcularTotal(subtotal, tasa): number` — `subtotal + subtotal * tasa`
- [x] 3.2 Verificar `utils/formatCurrency.ts` (sin cambios necesarios)
- [x] 3.3 Crear `utils/validaciones.ts`
  - [x] 3.3.1 `validarCedula(cedula: string): boolean` — exactamente 10 dígitos numéricos
  - [x] 3.3.2 `validarNombreCliente(nombre: string): boolean` — mínimo 2 palabras, 3–50 chars, solo letras/espacios/tildes/ñ
  - [x] 3.3.3 `validarSumaPagos(pagos: PagoRequest[], total: number): boolean` — suma exacta con tolerancia de punto flotante
- [x] 3.4 Actualizar tests — `__tests__/utils/calcularTotal.test.ts`
  - [x] 3.4.1 `calcularSubtotalGeneral` retorna 0 con carrito vacío
  - [x] 3.4.2 `calcularSubtotalGeneral` suma subtotales correctamente
  - [x] 3.4.3 `calcularSubtotal` multiplica precio por cantidad
  - [x] 3.4.4 `calcularImpuesto` calcula correctamente con tasa 0.05
  - [x] 3.4.5 `calcularTotal` es subtotal + impuesto
  - [x] 3.4.6 PBT: `calcularSubtotalGeneral` siempre equivale a `reduce` de subtotales
  - [x] 3.4.7 PBT: `calcularTotal(s, t) === s + s * t` para cualquier s >= 0 y t en [0, 1]
  - [x] 3.4.8 PBT: `calcularSubtotalGeneral` es monótonamente creciente al agregar items con subtotal > 0
- [x] 3.5 Crear tests — `__tests__/utils/validaciones.test.ts`
  - [x] 3.5.1 `validarCedula` acepta exactamente 10 dígitos
  - [x] 3.5.2 `validarCedula` rechaza strings con longitud distinta de 10
  - [x] 3.5.3 `validarCedula` rechaza strings con caracteres no numéricos
  - [x] 3.5.4 `validarNombreCliente` acepta nombre con 2+ palabras dentro del rango
  - [x] 3.5.5 `validarNombreCliente` rechaza nombre con 1 sola palabra
  - [x] 3.5.6 `validarNombreCliente` rechaza nombre con caracteres especiales no permitidos
  - [x] 3.5.7 `validarSumaPagos` retorna true cuando la suma es exactamente el total
  - [x] 3.5.8 `validarSumaPagos` retorna false cuando la suma difiere del total
  - [x] 3.5.9 PBT: `validarCedula` — solo acepta strings de exactamente 10 dígitos
  - [x] 3.5.10 PBT: `validarSumaPagos` — retorna true si y solo si suma === total

---

## 4. API Client y Servicios HTTP — Actualización

- [x] 4.1 Verificar `services/apiClient.ts` (sin cambios estructurales)
  - [x] 4.1.1 Confirmar `baseURL` desde `VITE_API_URL`
  - [x] 4.1.2 Confirmar interceptor de request inyecta `Authorization: Bearer <token>`
  - [x] 4.1.3 Confirmar interceptor de response llama `logout()` y redirige en 401
- [x] 4.2 Verificar `services/authService.ts`
  - [x] 4.2.1 `login(data: LoginRequest): Promise<LoginResponse>` → `POST /api/auth/login`
- [x] 4.3 Verificar `services/productoService.ts` (sin cambios necesarios)
  - [x] 4.3.1 `listar()`, `obtener(id)`, `crear(data)`, `actualizar(id, data)`, `eliminar(id)`
- [ ] 4.4 Actualizar `services/ventaService.ts`
  - [ ] 4.4.1 `registrar(data: RegistrarVentaRequest): Promise<VentaResponse>` → `POST /api/ventas`
  - [~] 4.4.2 `listar(filtros?: FiltrosVenta): Promise<VentaResponse[]>` → `GET /api/ventas` con query params
  - [~] 4.4.3 `obtener(id: number): Promise<VentaResponse>` → `GET /api/ventas/{id}`
  - [~] 4.4.4 `obtenerPorFactura(numeroFactura: string): Promise<VentaResponse>` → `GET /api/ventas/factura/{numeroFactura}`
  - [~] 4.4.5 `reembolsar(id: number, data: ReembolsoRequest): Promise<ReembolsoResponse>` → `POST /api/ventas/{id}/reembolso`
- [ ] 4.5 Crear `services/configuracionService.ts`
  - [~] 4.5.1 `obtenerTasaImpuesto(): Promise<ConfiguracionResponse>` → `GET /api/configuracion/tasa-impuesto`
  - [~] 4.5.2 `actualizarTasaImpuesto(data: ActualizarTasaRequest): Promise<ConfiguracionResponse>` → `PUT /api/configuracion/tasa-impuesto`
- [ ] 4.6 Actualizar tests — `__tests__/services/ventaService.test.ts`
  - [~] 4.6.1 `registrar` envía `nombreCliente`, `cedulaCliente`, `items` y `pagos` al backend
  - [~] 4.6.2 `listar` pasa filtros como query params correctamente
  - [~] 4.6.3 `reembolsar` llama `POST /api/ventas/{id}/reembolso` con el motivo
  - [~] 4.6.4 `registrar` lanza error cuando el backend retorna 400
- [ ] 4.7 Crear tests — `__tests__/services/configuracionService.test.ts`
  - [~] 4.7.1 `obtenerTasaImpuesto` retorna `valorDecimal` correctamente
  - [~] 4.7.2 `actualizarTasaImpuesto` envía el valor correcto al backend

---

## 5. Store Global — Autenticación (Pinia) — Actualización

- [ ] 5.1 Actualizar `stores/authStore.ts`
  - [~] 5.1.1 Agregar campo `nombre: string | null` al estado
  - [~] 5.1.2 Actualizar `setAuth(token, username, nombre)` para persistir `nombre` en `localStorage`
  - [~] 5.1.3 Actualizar `logout()` para limpiar `nombre` del store y `localStorage`
  - [~] 5.1.4 Inicializar `nombre` desde `localStorage` al cargar la app
- [ ] 5.2 Actualizar tests — `__tests__/stores/authStore.test.ts`
  - [~] 5.2.1 PBT: después de `setAuth(token, username, nombre)`, el store refleja exactamente esos tres valores
  - [~] 5.2.2 Después de `logout()`, `token`, `username` y `nombre` son `null`

---

## 6. Composables de Lógica de Negocio — Actualización

- [ ] 6.1 Actualizar `composables/useAuth.ts`
  - [~] 6.1.1 `login(data)`: llamar `authStore.setAuth(token, username, nombre)` con los tres campos
  - [~] 6.1.2 Exponer `nombre` desde el store
- [~] 6.2 Verificar `composables/useProductos.ts` (sin cambios necesarios)
- [ ] 6.3 Reescribir `composables/useCarrito.ts`
  - [~] 6.3.1 Agregar `tasaImpuesto: Ref<number>` (se setea desde `useConfiguracion`)
  - [~] 6.3.2 Agregar `datosCliente: { nombreCliente, cedulaCliente }` reactivo
  - [~] 6.3.3 Agregar `pagos: Ref<PagoRequest[]>`
  - [~] 6.3.4 `subtotal`: computed usando `calcularSubtotalGeneral(items.value)`
  - [~] 6.3.5 `impuesto`: computed usando `calcularImpuesto(subtotal.value, tasaImpuesto.value)`
  - [~] 6.3.6 `total`: computed usando `calcularTotal(subtotal.value, tasaImpuesto.value)`
  - [~] 6.3.7 `confirmar()`: validar carrito no vacío, datos del cliente, suma de pagos; llamar `ventaService.registrar()`; vaciar carrito; retornar `VentaResponse`
- [ ] 6.4 Actualizar `composables/useVentas.ts`
  - [~] 6.4.1 Agregar `filtros: FiltrosVenta` reactivo con valores por defecto
  - [~] 6.4.2 `cargar()`: llamar `ventaService.listar(filtros)` con los filtros actuales
  - [~] 6.4.3 `reembolsar(id, motivo)`: llamar `ventaService.reembolsar()` y actualizar la venta en la lista
- [ ] 6.5 Crear `composables/useConfiguracion.ts`
  - [~] 6.5.1 `tasaImpuesto: Ref<number>`
  - [~] 6.5.2 `cargarTasa()`: obtener `valorDecimal` de `configuracionService.obtenerTasaImpuesto()`
  - [~] 6.5.3 `actualizarTasa(nuevaTasa)`: llamar `configuracionService.actualizarTasaImpuesto()`
- [ ] 6.6 Actualizar tests — `__tests__/composables/useCarrito.test.ts`
  - [~] 6.6.1 `subtotal`, `impuesto` y `total` se calculan correctamente con tasa de impuesto
  - [~] 6.6.2 `agregar` incrementa cantidad si el producto ya existe en el carrito
  - [~] 6.6.3 `eliminar` quita el item del carrito
  - [~] 6.6.4 `confirmar` lanza error con carrito vacío
  - [~] 6.6.5 `confirmar` lanza error si la suma de pagos no iguala el total
  - [~] 6.6.6 `confirmar` lanza error si la cédula es inválida
  - [~] 6.6.7 `confirmar` lanza error si el nombre del cliente es inválido
  - [~] 6.6.8 `confirmar` vacía el carrito tras procesar la venta exitosamente
  - [~] 6.6.9 PBT: después de `agregar(producto, cantidad)`, el item existe con cantidad >= cantidad
  - [~] 6.6.10 PBT: después de `eliminar(productoId)`, ningún item tiene ese productoId
  - [~] 6.6.11 PBT: después de `vaciar()`, `items.length === 0`, `subtotal === 0` y `total === 0`
  - [~] 6.6.12 PBT: `total === subtotal + subtotal * tasaImpuesto` para cualquier tasa en [0, 1]
- [ ] 6.7 Crear tests — `__tests__/composables/useConfiguracion.test.ts`
  - [~] 6.7.1 `cargarTasa` setea `tasaImpuesto` con el `valorDecimal` del backend
  - [~] 6.7.2 `actualizarTasa` llama al servicio con el valor correcto

---

## 7. Enrutamiento — Actualización

- [ ] 7.1 Actualizar `router/index.ts`
  - [~] 7.1.1 Agregar ruta protegida `/ventas` → `VentasView`
  - [~] 7.1.2 Agregar ruta protegida `/configuracion` → `ConfiguracionView`
  - [~] 7.1.3 Mantener guard: sin token → `/login`; ya autenticado en `/login` → `/pos`

---

## 8. Componentes Compartidos — Actualización

- [ ] 8.1 Actualizar `components/shared/Navbar.vue`
  - [~] 8.1.1 Agregar links a `/ventas` y `/configuracion`
  - [~] 8.1.2 Mostrar `authStore.nombre` (en lugar de `username`) como nombre del usuario
- [~] 8.2 Verificar `components/shared/LoadingSpinner.vue` (sin cambios)
- [~] 8.3 Verificar `components/shared/ErrorAlert.vue` — asegurar que acepta `errors: Record<string, string>` para mostrar errores de validación campo por campo

---

## 9. Módulo de Autenticación — Actualización

- [ ] 9.1 Actualizar `components/auth/LoginForm.vue`
  - [~] 9.1.1 Asegurar que el composable `useAuth().login()` recibe y almacena `nombre`
- [~] 9.2 Verificar `views/LoginView.vue` (sin cambios necesarios)
- [ ] 9.3 Actualizar tests — `__tests__/components/LoginForm.test.ts`
  - [~] 9.3.1 Verificar que tras login exitoso se almacena `nombre` en el store

---

## 10. Módulo de Productos — Sin cambios estructurales

- [~] 10.1 Verificar `components/productos/ProductoTable.vue`
- [ ] 10.2 Verificar `components/productos/ProductoForm.vue`
  - [~] 10.2.1 Confirmar validaciones: nombre requerido, precio > 0, stock >= 0
- [~] 10.3 Verificar `views/ProductosView.vue`

---

## 11. Módulo POS — Actualización

- [ ] 11.1 Actualizar `components/pos/ProductoSelector.vue`
  - [~] 11.1.1 Filtrar productos con `stock > 0`
- [ ] 11.2 Actualizar `components/pos/CarritoVenta.vue`
  - [~] 11.2.1 Mostrar subtotal, impuesto (con tasa) y total por separado
  - [~] 11.2.2 Botón "Confirmar Venta" deshabilitado si `items.length === 0`
  - [~] 11.2.3 Mostrar `ErrorAlert` con errores del backend (incluyendo errores de validación campo por campo)
- [ ] 11.3 Crear `components/pos/PagoForm.vue`
  - [~] 11.3.1 Campos: `nombreCliente` (texto) y `cedulaCliente` (texto, 10 dígitos)
  - [~] 11.3.2 Sección de pagos: lista de métodos (`EFECTIVO`, `TARJETA`, `TRANSFERENCIA`) con monto por cada uno
  - [~] 11.3.3 Permitir agregar múltiples métodos de pago en una misma venta
  - [~] 11.3.4 Mostrar validación en tiempo real: suma de pagos vs total calculado
  - [~] 11.3.5 Validar nombre y cédula antes de habilitar el botón de confirmar
- [ ] 11.4 Actualizar `components/pos/ResumenVenta.vue`
  - [~] 11.4.1 Mostrar `numeroFactura` generado por el servidor
  - [~] 11.4.2 Mostrar nombre del cajero, cliente, cédula, detalles, pagos, subtotal, impuesto y total
- [ ] 11.5 Actualizar `views/PosView.vue`
  - [~] 11.5.1 En `onMounted`: cargar tasa de impuesto desde `useConfiguracion().cargarTasa()` y setear en `useCarrito`
  - [~] 11.5.2 Renderizar `ProductoSelector`, `CarritoVenta` y `PagoForm` en layout de dos columnas
  - [~] 11.5.3 Mostrar `ResumenVenta` tras venta exitosa
- [ ] 11.6 Actualizar tests — `__tests__/components/CarritoVenta.test.ts`
  - [~] 11.6.1 Muestra subtotal, impuesto y total por separado
  - [~] 11.6.2 Deshabilita botón "Confirmar" con carrito vacío
  - [~] 11.6.3 Muestra error cuando el backend retorna 400
  - [~] 11.6.4 Vacía el carrito tras procesar venta exitosa
- [ ] 11.7 Crear tests — `__tests__/components/PagoForm.test.ts`
  - [~] 11.7.1 Renderiza campos de nombre y cédula del cliente
  - [~] 11.7.2 Muestra error de validación si la cédula no tiene 10 dígitos
  - [~] 11.7.3 Muestra error si el nombre no tiene mínimo 2 palabras
  - [~] 11.7.4 Muestra advertencia si la suma de pagos no iguala el total
  - [~] 11.7.5 Permite agregar múltiples métodos de pago

---

## 12. Módulo de Historial de Ventas — NUEVO

- [ ] 12.1 Crear `components/ventas/VentaFiltros.vue`
  - [~] 12.1.1 Filtro por fecha (input date, formato `YYYY-MM-DD`)
  - [~] 12.1.2 Filtro por cédula del cliente (10 dígitos)
  - [~] 12.1.3 Filtro por método de pago (select: EFECTIVO, TARJETA, TRANSFERENCIA)
  - [~] 12.1.4 Botón "Buscar" que emite evento con los filtros seleccionados
  - [~] 12.1.5 Botón "Limpiar" que resetea todos los filtros
- [ ] 12.2 Crear `components/ventas/VentaTable.vue`
  - [~] 12.2.1 Tabla con columnas: número de factura, fecha, cliente, total, estado (reembolsada o no)
  - [~] 12.2.2 Botón "Ver detalle" por fila
  - [~] 12.2.3 Controles de paginación (anterior / siguiente / número de página)
  - [~] 12.2.4 Muestra `LoadingSpinner` mientras carga
- [ ] 12.3 Crear `components/ventas/VentaDetalle.vue`
  - [~] 12.3.1 Muestra todos los campos de `VentaResponse`: factura, cajero, cliente, cédula, ítems, pagos, subtotal, impuesto, total, fecha
  - [~] 12.3.2 Muestra badge "Reembolsada" si `reembolsada === true` con datos del reembolso
  - [~] 12.3.3 Botón "Reembolsar" visible solo si `reembolsada === false`
- [ ] 12.4 Crear `views/VentasView.vue`
  - [~] 12.4.1 Usa `useVentas` para cargar y filtrar ventas
  - [~] 12.4.2 Renderiza `VentaFiltros`, `VentaTable` y `VentaDetalle` (modal o panel lateral)
  - [~] 12.4.3 Maneja paginación reactiva

---

## 13. Módulo de Reembolsos — NUEVO

- [ ] 13.1 Crear `components/ventas/ReembolsoForm.vue`
  - [~] 13.1.1 Campo `motivo` (textarea, 10–500 caracteres)
  - [~] 13.1.2 Contador de caracteres visible
  - [~] 13.1.3 Validación en tiempo real del rango de caracteres
  - [~] 13.1.4 Botón "Confirmar Reembolso" deshabilitado si motivo inválido
  - [~] 13.1.5 Llama a `useVentas().reembolsar(id, motivo)` al confirmar
  - [~] 13.1.6 Muestra confirmación con datos del reembolso tras éxito

---

## 14. Módulo de Configuración — NUEVO

- [ ] 14.1 Crear `views/ConfiguracionView.vue`
  - [~] 14.1.1 Muestra la tasa de impuesto actual (en porcentaje, ej. "5%")
  - [~] 14.1.2 Input numérico para ingresar nueva tasa (entre 0 y 100, se convierte a decimal al enviar)
  - [~] 14.1.3 Botón "Guardar" que llama a `useConfiguracion().actualizarTasa()`
  - [~] 14.1.4 Muestra mensaje de éxito o error tras la operación

---

## 15. Testing — Cobertura y Calidad

- [~] 15.1 Ejecutar todos los tests: `npx vitest run`
- [~] 15.2 Generar reporte de cobertura: `npx vitest run --coverage`
- [~] 15.3 Verificar cobertura ≥ 80% en `composables/` y `utils/`
- [~] 15.4 Verificar que ningún test de composable o utilidad hace llamadas HTTP reales
- [~] 15.5 Verificar que los tests de componentes usan mocks de composables (no servicios reales)
- [~] 15.6 Verificar que los tests de PBT cubren las propiedades definidas en `requirements.md` sección 6

---

## 16. Despliegue

- [~] 16.1 Configurar `.env.production` con `VITE_API_URL` apuntando al backend en producción
- [~] 16.2 Generar build de producción: `npm run build`
- [~] 16.3 Verificar que el build en `dist/` funciona correctamente
- [~] 16.4 Crear `Dockerfile` para servir el build con Nginx
- [~] 16.5 Configurar Nginx para manejar rutas SPA (redirect a `index.html`)
- [~] 16.6 Documentar variables de entorno y pasos de despliegue en `README.md`
