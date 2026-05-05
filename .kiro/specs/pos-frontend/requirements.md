# Requirements — Sistema POS Frontend

**Versión:** 1.0.0
**Fecha:** 2026-04-28
**Estado:** Activo
**Referencia backend:** `../requerimientos.md` v2.0.0

---

## 1. Introducción

### 1.1 Propósito

Este documento describe los requerimientos funcionales, no funcionales y restricciones de arquitectura del frontend del sistema POS. El frontend consume la API REST del backend (Spring Boot + JWT) y está desarrollado con Vue 3 + TypeScript, siguiendo principios de separación de responsabilidades, componentes reutilizables y tests unitarios.

### 1.2 Alcance

El frontend cubre las siguientes funcionalidades:

- Pantalla de login con autenticación JWT.
- Módulo de gestión de productos (CRUD).
- Interfaz POS para registrar ventas con cálculo automático de totales.
- Protección de rutas para usuarios no autenticados.
- Manejo de errores y feedback visual al usuario.

Queda fuera del alcance: reportes avanzados, gestión de usuarios, facturación electrónica.

### 1.3 Definiciones y Acrónimos

| Término | Descripción |
|---|---|
| SPA | Single Page Application |
| JWT | JSON Web Token |
| API | Interfaz de programación del backend |
| Store | Estado global centralizado (Pinia) |
| Service | Módulo encargado de las llamadas HTTP a la API |
| Composable | Función reutilizable de Vue 3 (Composition API) que encapsula lógica |
| DTO | Objeto de transferencia de datos entre frontend y API |
| SRP | Single Responsibility Principle |
| ISP | Interface Segregation Principle |
| DIP | Dependency Inversion Principle |

---

## 2. Requerimientos Funcionales

### RF-FE-01: Autenticación (Login)

- **RF-FE-01.1** El sistema debe mostrar una pantalla de login con campos de usuario y contraseña.
- **RF-FE-01.2** Al enviar credenciales válidas, el frontend debe almacenar el token JWT recibido del backend.
- **RF-FE-01.3** El token JWT debe persistirse en `localStorage` para mantener la sesión entre recargas.
- **RF-FE-01.4** Si las credenciales son inválidas, el sistema debe mostrar un mensaje de error descriptivo.
- **RF-FE-01.5** El usuario debe poder cerrar sesión, eliminando el token y redirigiendo al login.
- **RF-FE-01.6** Todas las rutas excepto `/login` deben estar protegidas y redirigir al login si no hay token.

### RF-FE-02: Gestión de Productos

- **RF-FE-02.1** El sistema debe mostrar una tabla con todos los productos activos obtenidos del backend.
- **RF-FE-02.2** El usuario puede crear un nuevo producto mediante un formulario con los campos: nombre, descripción, precio y stock.
- **RF-FE-02.3** El usuario puede editar un producto existente desde la lista.
- **RF-FE-02.4** El usuario puede eliminar un producto con confirmación previa.
- **RF-FE-02.5** El formulario debe validar en el cliente que el precio sea mayor a cero y el stock no sea negativo antes de enviar al backend.
- **RF-FE-02.6** El sistema debe mostrar mensajes de éxito o error tras cada operación CRUD.

### RF-FE-03: Interfaz POS — Registro de Ventas

- **RF-FE-03.1** El sistema debe mostrar una pantalla POS con la lista de productos disponibles.
- **RF-FE-03.2** El usuario puede agregar productos al carrito de venta especificando la cantidad.
- **RF-FE-03.3** El sistema debe calcular y mostrar en tiempo real el subtotal por línea (precio × cantidad) y el total general.
- **RF-FE-03.4** El usuario puede eliminar un producto del carrito antes de confirmar la venta.
- **RF-FE-03.5** El usuario puede confirmar la venta enviando el carrito al backend (`POST /api/ventas`).
- **RF-FE-03.6** Si el backend retorna error de stock insuficiente (HTTP 400), el sistema debe mostrar el mensaje de error correspondiente.
- **RF-FE-03.7** Tras confirmar la venta exitosamente, el carrito debe vaciarse y mostrar confirmación al usuario.
- **RF-FE-03.8** No se debe permitir confirmar una venta con el carrito vacío.

### RF-FE-04: Navegación y Rutas

- **RF-FE-04.1** La aplicación debe tener rutas definidas: `/login`, `/productos`, `/pos`.
- **RF-FE-04.2** Tras el login exitoso, el usuario debe ser redirigido a `/pos`.
- **RF-FE-04.3** El sistema debe incluir una barra de navegación visible para usuarios autenticados.
- **RF-FE-04.4** La barra de navegación debe mostrar el nombre del usuario autenticado y un botón de logout.

---

## 3. Requerimientos No Funcionales

### RNF-FE-01: Seguridad

- El token JWT debe incluirse automáticamente en el header `Authorization: Bearer <token>` en todas las peticiones autenticadas.
- El token no debe exponerse en la URL ni en logs del navegador.
- Al expirar el token (respuesta HTTP 401), el sistema debe redirigir automáticamente al login.
- Las rutas protegidas deben verificar la existencia del token antes de renderizar.

### RNF-FE-02: Rendimiento

- La aplicación debe cargar en menos de 3 segundos en condiciones normales de red.
- Las listas de productos deben renderizarse de forma eficiente (evitar re-renders innecesarios).
- El cálculo del total del carrito debe ser reactivo y sin latencia perceptible.

### RNF-FE-03: Usabilidad

- La interfaz debe ser responsiva y funcionar correctamente en pantallas de escritorio (mínimo 1024px).
- Los formularios deben mostrar mensajes de validación claros junto al campo que falló.
- Las operaciones asíncronas deben mostrar indicadores de carga (spinner).
- Los errores del backend deben mostrarse en notificaciones o alertas visibles.

### RNF-FE-04: Arquitectura y Calidad de Código

- **RNF-FE-04.1 (SRP)** Cada componente tiene una única responsabilidad. Los componentes de UI no realizan llamadas HTTP directamente.
- **RNF-FE-04.2 (DIP)** Los componentes dependen de composables y servicios abstractos, no de `axios` directamente.
- **RNF-FE-04.3** La lógica de negocio (cálculo de totales, validaciones) debe residir en composables o funciones utilitarias, no en componentes.
- **RNF-FE-04.4** Los servicios HTTP deben estar centralizados en una capa `services/`, separada de los componentes.
- **RNF-FE-04.5** El estado global (token, usuario) debe gestionarse en un store centralizado con Pinia.

### RNF-FE-05: Testing

- **RNF-FE-05.1** Los composables de lógica de negocio deben tener tests unitarios con Vitest + Vue Test Utils.
- **RNF-FE-05.2** Las funciones utilitarias (cálculo de totales, formateo) deben tener cobertura del 100%.
- **RNF-FE-05.3** Los componentes críticos (LoginForm, CarritoVenta, ProductoForm) deben tener tests de renderizado y comportamiento.
- **RNF-FE-05.4** Los servicios HTTP deben testearse con mocks de axios (sin llamadas reales a la API).
- **RNF-FE-05.5** La cobertura mínima de composables y utilidades debe ser del 80%.

---

## 4. Reglas de Negocio

| ID | Regla | Implementación |
|---|---|---|
| RN-FE-01 | El subtotal de una línea es `precio × cantidad`. | Composable `useCarrito` / utilidad `calcularSubtotal` |
| RN-FE-02 | El total de la venta es la suma de todos los subtotales. | Composable `useCarrito` / utilidad `calcularTotal` |
| RN-FE-03 | No se puede confirmar una venta con el carrito vacío. | Validación en `useCarrito` antes de llamar a la API |
| RN-FE-04 | La cantidad mínima por producto en el carrito es 1. | Validación en formulario POS |
| RN-FE-05 | El precio debe ser mayor a cero al crear/editar un producto. | Validación en `ProductoForm` |
| RN-FE-06 | El stock no puede ser negativo al crear/editar un producto. | Validación en `ProductoForm` |
| RN-FE-07 | El token JWT debe enviarse en cada petición autenticada. | Interceptor en `apiClient` |
| RN-FE-08 | Si el backend retorna 401, el usuario debe ser deslogueado automáticamente. | Interceptor en `apiClient` |

---

## 5. Casos de Uso Principales

### CU-FE-01: Iniciar Sesión

- **Actor:** Usuario no autenticado
- **Precondición:** Backend disponible en `VITE_API_URL`.
- **Flujo principal:**
  1. El usuario accede a `/login`.
  2. Ingresa username y password en el formulario.
  3. El frontend llama a `POST /api/auth/login` via `authService.login()`.
  4. El token JWT recibido se almacena en el store de Pinia y en `localStorage`.
  5. El usuario es redirigido a `/pos`.
- **Flujo alternativo:** Backend retorna 401 → se muestra mensaje "Credenciales inválidas".

### CU-FE-02: Gestionar Productos

- **Actor:** Usuario autenticado
- **Precondición:** Token JWT válido en el store.
- **Flujo principal:**
  1. El usuario navega a `/productos`.
  2. El composable `useProductos` carga la lista via `productoService.listar()`.
  3. El usuario crea, edita o elimina productos mediante formularios y confirmaciones.
  4. Cada operación llama al endpoint correspondiente con el token en el header.
  5. La lista se actualiza reactivamente tras cada operación.
- **Flujo alternativo:** Error del backend → notificación de error visible.

### CU-FE-03: Registrar Venta POS

- **Actor:** Usuario autenticado
- **Precondición:** Token JWT válido; al menos un producto en el carrito.
- **Flujo principal:**
  1. El usuario navega a `/pos`.
  2. Selecciona productos y cantidades; `useCarrito` calcula totales en tiempo real.
  3. El usuario confirma la venta.
  4. `ventaService.registrar()` llama a `POST /api/ventas` con el carrito.
  5. El carrito se vacía y se muestra confirmación de venta exitosa.
- **Flujo alternativo:** Stock insuficiente (HTTP 400) → mensaje de error con el producto afectado.

---

## 6. Propiedades de Corrección (Property-Based Testing)

Estas propiedades formalizan los invariantes del sistema y deben ser verificadas mediante tests de propiedades (PBT) con Vitest + fast-check.

### PC-FE-01: Cálculo de totales

- **PC-FE-01.1** Para cualquier lista de items con subtotales no negativos, `calcularTotal(items) === items.reduce((acc, i) => acc + i.subtotal, 0)`.
- **PC-FE-01.2** Para cualquier precio `p > 0` y cantidad `c > 0`, `calcularSubtotal(p, c) === p * c`.
- **PC-FE-01.3** `calcularTotal([]) === 0` (elemento neutro).
- **PC-FE-01.4** `calcularTotal` es monótonamente creciente: agregar un item con subtotal > 0 siempre incrementa el total.

### PC-FE-02: Invariantes del carrito

- **PC-FE-02.1** Después de `agregar(producto, cantidad)`, el item con ese `productoId` existe en `items` con `cantidad >= cantidad`.
- **PC-FE-02.2** Después de `eliminar(productoId)`, ningún item en `items` tiene ese `productoId`.
- **PC-FE-02.3** `confirmar()` con `items.length === 0` siempre lanza un error (nunca resuelve exitosamente).
- **PC-FE-02.4** Después de `vaciar()`, `items.length === 0` y `total === 0`.

### PC-FE-03: Autenticación

- **PC-FE-03.1** Después de `logout()`, `token === null` y `username === null` en el store.
- **PC-FE-03.2** Después de `setAuth(token, username)`, `authStore.token === token`.
- **PC-FE-03.3** El interceptor de request siempre inyecta `Authorization: Bearer <token>` cuando `token !== null`.
