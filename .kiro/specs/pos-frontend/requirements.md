# Requirements — Sistema POS Frontend

**Versión:** 2.0.0
**Fecha:** 2026-05-10
**Estado:** Activo
**Referencia API:** `guia.md` — Sistema POS API (base URL `http://localhost:8081`)

---

## 1. Introducción

### 1.1 Propósito

Este documento describe los requerimientos funcionales, no funcionales y restricciones de arquitectura del frontend del sistema POS. El frontend consume la API REST del backend (Spring Boot + JWT) y está desarrollado con Vue 3 + TypeScript, siguiendo principios de separación de responsabilidades, componentes reutilizables y tests unitarios.

### 1.2 Alcance

El frontend cubre las siguientes funcionalidades:

- Pantalla de login con autenticación JWT.
- Módulo de gestión de productos (CRUD).
- Interfaz POS para registrar ventas con cálculo automático de totales, impuesto configurable y múltiples métodos de pago.
- Módulo de historial de ventas con filtros y paginación.
- Gestión de reembolsos de ventas.
- Configuración de tasa de impuesto global.
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
| Tasa de impuesto | Porcentaje global configurable obtenido de `GET /api/configuracion/tasa-impuesto` |
| Reembolso | Devolución total de una venta, con restauración automática de stock |

---

## 2. Requerimientos Funcionales

### RF-FE-01: Autenticación (Login)

- **RF-FE-01.1** El sistema debe mostrar una pantalla de login con campos de usuario y contraseña.
- **RF-FE-01.2** Al enviar credenciales válidas, el frontend debe almacenar el token JWT y el nombre del usuario recibidos del backend (`token`, `username`, `nombre`).
- **RF-FE-01.3** El token JWT debe persistirse en `localStorage` para mantener la sesión entre recargas.
- **RF-FE-01.4** Si las credenciales son inválidas, el sistema debe mostrar un mensaje de error descriptivo.
- **RF-FE-01.5** El usuario debe poder cerrar sesión, eliminando el token y redirigiendo al login.
- **RF-FE-01.6** Todas las rutas excepto `/login` deben estar protegidas y redirigir al login si no hay token.

### RF-FE-02: Gestión de Productos

- **RF-FE-02.1** El sistema debe mostrar una tabla con todos los productos activos obtenidos de `GET /api/productos`.
- **RF-FE-02.2** El usuario puede crear un nuevo producto mediante un formulario con los campos: nombre (requerido), descripción (opcional), precio (> 0) y stock (≥ 0).
- **RF-FE-02.3** El usuario puede editar un producto existente desde la lista.
- **RF-FE-02.4** El usuario puede eliminar un producto con confirmación previa. La eliminación es lógica en el backend (`activo: false`); el producto desaparece de la lista en el frontend.
- **RF-FE-02.5** El formulario debe validar en el cliente que el precio sea mayor a cero y el stock no sea negativo antes de enviar al backend.
- **RF-FE-02.6** El sistema debe mostrar mensajes de éxito o error tras cada operación CRUD.

### RF-FE-03: Interfaz POS — Registro de Ventas

- **RF-FE-03.1** Al cargar la vista POS, el sistema debe obtener la tasa de impuesto actual desde `GET /api/configuracion/tasa-impuesto` antes de mostrar precios.
- **RF-FE-03.2** El sistema debe mostrar la lista de productos disponibles (con stock > 0) para selección.
- **RF-FE-03.3** El usuario puede agregar productos al carrito especificando la cantidad (mínimo 1).
- **RF-FE-03.4** El sistema debe calcular y mostrar en tiempo real: subtotal por línea (`precio × cantidad`), subtotal general, impuesto (`subtotal × tasa`) y total (`subtotal + impuesto`).
- **RF-FE-03.5** El usuario debe ingresar los datos del cliente: nombre completo (mínimo 2 palabras, solo letras/espacios/tildes/ñ, 3–50 caracteres) y cédula (exactamente 10 dígitos numéricos).
- **RF-FE-03.6** El usuario debe seleccionar al menos un método de pago (`EFECTIVO`, `TARJETA` o `TRANSFERENCIA`) e ingresar el monto correspondiente. Se pueden combinar múltiples métodos en una misma venta.
- **RF-FE-03.7** La suma de todos los montos de pago debe ser exactamente igual al total calculado. El sistema debe validar esto antes de enviar la venta.
- **RF-FE-03.8** El usuario puede eliminar un producto del carrito antes de confirmar la venta.
- **RF-FE-03.9** El usuario puede confirmar la venta enviando el carrito al backend (`POST /api/ventas`).
- **RF-FE-03.10** Si el backend retorna error (HTTP 400), el sistema debe mostrar el mensaje de error correspondiente.
- **RF-FE-03.11** Tras confirmar la venta exitosamente, el carrito debe vaciarse y mostrar el número de factura generado por el servidor (formato `FAC-YYYYMMDD-NNNNNN`).
- **RF-FE-03.12** No se debe permitir confirmar una venta con el carrito vacío.
- **RF-FE-03.13** El `usuarioId` del cajero no debe enviarse en el body; el backend lo extrae del JWT automáticamente.

### RF-FE-04: Historial de Ventas

- **RF-FE-04.1** El sistema debe mostrar una lista paginada de ventas obtenidas de `GET /api/ventas`.
- **RF-FE-04.2** El usuario puede filtrar ventas por: fecha (formato `YYYY-MM-DD`), cédula del cliente (10 dígitos), y método de pago (`EFECTIVO`, `TARJETA`, `TRANSFERENCIA`).
- **RF-FE-04.3** El sistema debe soportar paginación con parámetros `page` (base 0) y `size` (default 20).
- **RF-FE-04.4** El usuario puede ver el detalle completo de una venta, incluyendo número de factura, cajero, cliente, ítems, pagos, subtotal, impuesto y total.
- **RF-FE-04.5** El sistema debe indicar visualmente si una venta ha sido reembolsada (`reembolsada: true`).

### RF-FE-05: Reembolsos

- **RF-FE-05.1** Desde el detalle de una venta no reembolsada, el usuario puede iniciar un reembolso.
- **RF-FE-05.2** El usuario debe ingresar un motivo de reembolso (entre 10 y 500 caracteres).
- **RF-FE-05.3** El sistema debe enviar `POST /api/ventas/{id}/reembolso` con el motivo.
- **RF-FE-05.4** Tras un reembolso exitoso, la venta debe marcarse como reembolsada en la UI y mostrar los datos del reembolso (fecha, usuario que lo procesó).
- **RF-FE-05.5** Si la venta ya fue reembolsada, el botón de reembolso debe estar deshabilitado.

### RF-FE-06: Configuración de Tasa de Impuesto

- **RF-FE-06.1** El sistema debe mostrar la tasa de impuesto actual obtenida de `GET /api/configuracion/tasa-impuesto`.
- **RF-FE-06.2** El usuario puede actualizar la tasa de impuesto mediante `PUT /api/configuracion/tasa-impuesto` con un valor entre 0.0 y 1.0.
- **RF-FE-06.3** Tras actualizar la tasa, el sistema debe reflejar el nuevo valor en los cálculos del POS.

### RF-FE-07: Navegación y Rutas

- **RF-FE-07.1** La aplicación debe tener rutas definidas: `/login`, `/productos`, `/pos`, `/ventas`, `/configuracion`.
- **RF-FE-07.2** Tras el login exitoso, el usuario debe ser redirigido a `/pos`.
- **RF-FE-07.3** El sistema debe incluir una barra de navegación visible para usuarios autenticados.
- **RF-FE-07.4** La barra de navegación debe mostrar el nombre del usuario autenticado (`nombre` del JWT) y un botón de logout.

---

## 3. Requerimientos No Funcionales

### RNF-FE-01: Seguridad

- El token JWT debe incluirse automáticamente en el header `Authorization: Bearer <token>` en todas las peticiones autenticadas.
- El token no debe exponerse en la URL ni en logs del navegador.
- Al expirar el token (respuesta HTTP 401), el sistema debe redirigir automáticamente al login y limpiar el store.
- Las rutas protegidas deben verificar la existencia del token antes de renderizar.

### RNF-FE-02: Rendimiento

- La aplicación debe cargar en menos de 3 segundos en condiciones normales de red.
- Las listas de productos y ventas deben renderizarse de forma eficiente (evitar re-renders innecesarios).
- El cálculo del total del carrito (incluyendo impuesto) debe ser reactivo y sin latencia perceptible.

### RNF-FE-03: Usabilidad

- La interfaz debe ser responsiva y funcionar correctamente en pantallas de escritorio (mínimo 1024px).
- Los formularios deben mostrar mensajes de validación claros junto al campo que falló.
- Las operaciones asíncronas deben mostrar indicadores de carga (spinner).
- Los errores del backend deben mostrarse en notificaciones o alertas visibles.
- Los errores de validación del backend (HTTP 400 con campo `errors`) deben mostrarse campo por campo.

### RNF-FE-04: Arquitectura y Calidad de Código

- **RNF-FE-04.1 (SRP)** Cada componente tiene una única responsabilidad. Los componentes de UI no realizan llamadas HTTP directamente.
- **RNF-FE-04.2 (DIP)** Los componentes dependen de composables y servicios abstractos, no de `axios` directamente.
- **RNF-FE-04.3** La lógica de negocio (cálculo de totales, impuesto, validaciones) debe residir en composables o funciones utilitarias, no en componentes.
- **RNF-FE-04.4** Los servicios HTTP deben estar centralizados en una capa `services/`, separada de los componentes.
- **RNF-FE-04.5** El estado global (token, usuario, nombre) debe gestionarse en un store centralizado con Pinia.

### RNF-FE-05: Testing

- **RNF-FE-05.1** Los composables de lógica de negocio deben tener tests unitarios con Vitest + Vue Test Utils.
- **RNF-FE-05.2** Las funciones utilitarias (cálculo de totales, impuesto, formateo) deben tener cobertura del 100%.
- **RNF-FE-05.3** Los componentes críticos (LoginForm, CarritoVenta, ProductoForm, PagoForm) deben tener tests de renderizado y comportamiento.
- **RNF-FE-05.4** Los servicios HTTP deben testearse con mocks de axios (sin llamadas reales a la API).
- **RNF-FE-05.5** La cobertura mínima de composables y utilidades debe ser del 80%.

---

## 4. Reglas de Negocio

| ID | Regla | Implementación |
|---|---|---|
| RN-FE-01 | El subtotal de una línea es `precio × cantidad`. | Composable `useCarrito` / utilidad `calcularSubtotal` |
| RN-FE-02 | El impuesto es `subtotal × tasaImpuesto`. | Composable `useCarrito` / utilidad `calcularImpuesto` |
| RN-FE-03 | El total de la venta es `subtotal + impuesto`. | Composable `useCarrito` / utilidad `calcularTotal` |
| RN-FE-04 | No se puede confirmar una venta con el carrito vacío. | Validación en `useCarrito` antes de llamar a la API |
| RN-FE-05 | La cantidad mínima por producto en el carrito es 1. | Validación en formulario POS |
| RN-FE-06 | El precio debe ser mayor a cero al crear/editar un producto. | Validación en `ProductoForm` |
| RN-FE-07 | El stock no puede ser negativo al crear/editar un producto. | Validación en `ProductoForm` |
| RN-FE-08 | El token JWT debe enviarse en cada petición autenticada. | Interceptor en `apiClient` |
| RN-FE-09 | Si el backend retorna 401, el usuario debe ser deslogueado automáticamente. | Interceptor en `apiClient` |
| RN-FE-10 | El nombre del cliente debe tener mínimo 2 palabras, solo letras/espacios/tildes/ñ, entre 3 y 50 caracteres. | Validación en `PagoForm` / `useCarrito` |
| RN-FE-11 | La cédula del cliente debe tener exactamente 10 dígitos numéricos. | Validación en `PagoForm` / `useCarrito` |
| RN-FE-12 | Los métodos de pago válidos son: `EFECTIVO`, `TARJETA`, `TRANSFERENCIA`. | Constante en `venta.types.ts` |
| RN-FE-13 | La suma de todos los montos de pago debe ser exactamente igual al total calculado. | Validación en `useCarrito.confirmar()` |
| RN-FE-14 | Una venta solo puede reembolsarse una vez. | Verificar `reembolsada: true` antes de mostrar botón |
| RN-FE-15 | El motivo de reembolso debe tener entre 10 y 500 caracteres. | Validación en `ReembolsoForm` |
| RN-FE-16 | La tasa de impuesto debe obtenerse del backend antes de calcular totales en el POS. | `useCarrito` / `configuracionService` |

---

## 5. Casos de Uso Principales

### CU-FE-01: Iniciar Sesión

- **Actor:** Usuario no autenticado
- **Precondición:** Backend disponible en `VITE_API_URL`.
- **Flujo principal:**
  1. El usuario accede a `/login`.
  2. Ingresa username y password en el formulario.
  3. El frontend llama a `POST /api/auth/login` via `authService.login()`.
  4. El token JWT, `username` y `nombre` recibidos se almacenan en el store de Pinia y en `localStorage`.
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
- **Precondición:** Token JWT válido; tasa de impuesto cargada; al menos un producto en el carrito.
- **Flujo principal:**
  1. El usuario navega a `/pos`.
  2. El sistema obtiene la tasa de impuesto desde `GET /api/configuracion/tasa-impuesto`.
  3. Selecciona productos y cantidades; `useCarrito` calcula subtotal, impuesto y total en tiempo real.
  4. El usuario ingresa nombre y cédula del cliente.
  5. El usuario selecciona método(s) de pago e ingresa montos que sumen exactamente el total.
  6. El usuario confirma la venta.
  7. `ventaService.registrar()` llama a `POST /api/ventas` con items, datos del cliente y pagos.
  8. El carrito se vacía y se muestra el número de factura generado.
- **Flujo alternativo:** Validación fallida (pagos no suman el total, cédula inválida, etc.) → mensaje de error específico.

### CU-FE-04: Consultar Historial de Ventas

- **Actor:** Usuario autenticado
- **Precondición:** Token JWT válido.
- **Flujo principal:**
  1. El usuario navega a `/ventas`.
  2. El sistema carga la primera página de ventas desde `GET /api/ventas`.
  3. El usuario puede aplicar filtros (fecha, cédula, método de pago) y navegar entre páginas.
  4. El usuario puede ver el detalle de una venta específica.
- **Flujo alternativo:** Sin resultados → mensaje informativo.

### CU-FE-05: Procesar Reembolso

- **Actor:** Usuario autenticado
- **Precondición:** Token JWT válido; venta no reembolsada previamente.
- **Flujo principal:**
  1. El usuario accede al detalle de una venta.
  2. Hace clic en "Reembolsar".
  3. Ingresa el motivo (10–500 caracteres).
  4. El sistema llama a `POST /api/ventas/{id}/reembolso`.
  5. La venta se marca como reembolsada y se muestran los datos del reembolso.
- **Flujo alternativo:** Venta ya reembolsada → botón deshabilitado; backend retorna 400 → mensaje de error.

---

## 6. Propiedades de Corrección (Property-Based Testing)

Estas propiedades formalizan los invariantes del sistema y deben ser verificadas mediante tests de propiedades (PBT) con Vitest + fast-check.

### PC-FE-01: Cálculo de totales con impuesto

- **PC-FE-01.1** Para cualquier lista de items con subtotales no negativos, `calcularSubtotalGeneral(items) === items.reduce((acc, i) => acc + i.subtotal, 0)`.
- **PC-FE-01.2** Para cualquier precio `p > 0` y cantidad `c > 0`, `calcularSubtotal(p, c) === p * c`.
- **PC-FE-01.3** Para cualquier subtotal `s >= 0` y tasa `t` en `[0, 1]`, `calcularImpuesto(s, t) === s * t`.
- **PC-FE-01.4** Para cualquier subtotal `s >= 0` y tasa `t` en `[0, 1]`, `calcularTotal(s, t) === s + s * t`.
- **PC-FE-01.5** `calcularSubtotalGeneral([]) === 0` (elemento neutro).
- **PC-FE-01.6** `calcularSubtotalGeneral` es monótonamente creciente: agregar un item con subtotal > 0 siempre incrementa el resultado.

### PC-FE-02: Invariantes del carrito

- **PC-FE-02.1** Después de `agregar(producto, cantidad)`, el item con ese `productoId` existe en `items` con `cantidad >= cantidad`.
- **PC-FE-02.2** Después de `eliminar(productoId)`, ningún item en `items` tiene ese `productoId`.
- **PC-FE-02.3** `confirmar()` con `items.length === 0` siempre lanza un error (nunca resuelve exitosamente).
- **PC-FE-02.4** Después de `vaciar()`, `items.length === 0`, `subtotal === 0` y `total === 0`.
- **PC-FE-02.5** Para cualquier lista de items y tasa de impuesto `t`, `total === subtotal + subtotal * t`.
- **PC-FE-02.6** `confirmar()` cuando la suma de pagos no iguala el total siempre lanza un error de validación.

### PC-FE-03: Autenticación

- **PC-FE-03.1** Después de `logout()`, `token === null`, `username === null` y `nombre === null` en el store.
- **PC-FE-03.2** Después de `setAuth(token, username, nombre)`, el store refleja exactamente esos valores.
- **PC-FE-03.3** El interceptor de request siempre inyecta `Authorization: Bearer <token>` cuando `token !== null`.

### PC-FE-04: Validaciones de datos del cliente

- **PC-FE-04.1** `validarCedula(cedula)` retorna `true` si y solo si `cedula` tiene exactamente 10 dígitos numéricos.
- **PC-FE-04.2** `validarNombreCliente(nombre)` retorna `true` si y solo si el nombre tiene al menos 2 palabras, entre 3 y 50 caracteres, y solo contiene letras, espacios, tildes y ñ.
- **PC-FE-04.3** Para cualquier conjunto de pagos, `validarSumaPagos(pagos, total)` retorna `true` si y solo si la suma de `pagos[].monto` es exactamente igual a `total`.
