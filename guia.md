# 🖥️ Guía de Integración Frontend — Sistema POS API

Toda la información que necesita el frontend para conectarse a esta API REST.

---

## Configuración base

| Parámetro | Valor |
|-----------|-------|
| **Base URL (dev)** | `http://localhost:8081` |
| **Swagger UI** | `http://localhost:8081/swagger-ui.html` |
| **Formato** | JSON (`Content-Type: application/json`) |
| **Autenticación** | JWT Bearer Token |

---

## Autenticación JWT

### Cómo funciona

1. El frontend hace `POST /api/auth/login` con usuario y contraseña
2. La API devuelve un token JWT
3. Ese token se incluye en **todos** los demás requests como header:
   ```
   Authorization: Bearer <token>
   ```
4. Sin token → `401 Unauthorized`
5. Token inválido o expirado → `401 Unauthorized`

### Recomendación de almacenamiento

Guarda el token en `localStorage` o en memoria (según tu política de seguridad). No lo guardes en cookies sin `httpOnly`.

---

## Endpoints

### 🔐 Autenticación

#### `POST /api/auth/login`

No requiere token.

**Request body:**
```json
{
  "username": "string (requerido)",
  "password": "string (requerido)"
}
```

**Respuesta 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "nombre": "Administrador"
}
```

**Credenciales de prueba:** `admin` / `admin123`

---

### 📦 Productos

Todos los endpoints requieren `Authorization: Bearer <token>`.

#### `GET /api/productos`
Lista todos los productos activos.

**Respuesta 200:**
```json
[
  {
    "id": 1,
    "nombre": "Café Premium",
    "descripcion": "Café colombiano de alta calidad",
    "precio": 15000.00,
    "stock": 100,
    "activo": true
  }
]
```

> Solo devuelve productos con `activo: true`. Los eliminados no aparecen.

---

#### `GET /api/productos/{id}`
Obtiene un producto por su ID.

**Respuesta 200:** mismo objeto `ProductoResponse` de arriba.

**Respuesta 404:**
```json
{
  "success": false,
  "message": "Producto no encontrado con ID: 99",
  "timestamp": "2026-05-08T10:00:00"
}
```

---

#### `POST /api/productos`
Crea un nuevo producto.

**Request body:**
```json
{
  "nombre": "string (requerido, no vacío)",
  "descripcion": "string (opcional)",
  "precio": 15000.00,
  "stock": 100
}
```

| Campo | Tipo | Reglas |
|-------|------|--------|
| `nombre` | string | Requerido, no vacío |
| `descripcion` | string | Opcional |
| `precio` | number | Requerido, > 0 |
| `stock` | integer | ≥ 0 |

**Respuesta 201:** objeto `ProductoResponse` con el producto creado.

---

#### `PUT /api/productos/{id}`
Actualiza un producto existente. Mismas reglas de validación que el POST.

**Request body:** igual que `POST /api/productos`

**Respuesta 200:** objeto `ProductoResponse` actualizado.

---

#### `DELETE /api/productos/{id}`
Eliminación lógica — el producto queda con `activo: false`, no se borra de la BD.

**Respuesta 204:** sin body.

---

### 🛒 Ventas

Todos los endpoints requieren `Authorization: Bearer <token>`.

#### `POST /api/ventas`
Registra una nueva venta.

**Request body:**
```json
{
  "nombreCliente": "María García",
  "cedulaCliente": "0987654321",
  "items": [
    {
      "productoId": 1,
      "cantidad": 2
    }
  ],
  "pagos": [
    {
      "metodoPago": "EFECTIVO",
      "monto": 31500.00
    }
  ]
}
```

| Campo | Tipo | Reglas |
|-------|------|--------|
| `nombreCliente` | string | Requerido, 3–50 chars, solo letras/espacios/tildes/ñ, mínimo 2 palabras |
| `cedulaCliente` | string | Requerido, exactamente 10 dígitos numéricos |
| `items` | array | Requerido, al menos 1 elemento |
| `items[].productoId` | number | Requerido |
| `items[].cantidad` | integer | Requerido, ≥ 1 |
| `pagos` | array | Requerido, al menos 1 elemento |
| `pagos[].metodoPago` | string | Requerido, uno de: `EFECTIVO`, `TARJETA`, `TRANSFERENCIA` |
| `pagos[].monto` | number | Requerido, > 0 |

> ⚠️ **Regla crítica:** La suma de todos los `pagos[].monto` debe ser **exactamente igual** al total calculado por el servidor (subtotal + impuesto). Si no coincide → `400`.

> El `usuarioId` del cajero se extrae automáticamente del JWT. No lo envíes.

> La tasa de impuesto se toma de la configuración global del sistema.

**Cálculo del total (para mostrar preview en UI):**
```
subtotal = Σ (precio_producto × cantidad)
impuesto = subtotal × tasa_impuesto
total    = subtotal + impuesto
```

**Respuesta 201:**
```json
{
  "id": 1,
  "numeroFactura": "FAC-20260508-000001",
  "usuarioId": 1,
  "nombreCajero": "admin",
  "nombreCliente": "María García",
  "cedulaCliente": "0987654321",
  "detalles": [
    {
      "productoId": 1,
      "nombreProducto": "Café Premium",
      "cantidad": 2,
      "precioUnit": 15000.00,
      "subtotal": 30000.00
    }
  ],
  "pagos": [
    {
      "id": 1,
      "metodoPago": "EFECTIVO",
      "monto": 31500.00
    }
  ],
  "subtotal": 30000.00,
  "tasaImpuesto": 0.05,
  "impuesto": 1500.00,
  "total": 31500.00,
  "fecha": "2026-05-08T10:00:00",
  "reembolsada": false,
  "reembolso": null
}
```

---

#### `GET /api/ventas`
Lista ventas con filtros opcionales y paginación.

**Query params (todos opcionales):**

| Parámetro | Tipo | Descripción |
|-----------|------|-------------|
| `fecha` | string | Fecha ISO-8601: `YYYY-MM-DD` |
| `cedulaCliente` | string | Cédula exacta del cliente (10 dígitos) |
| `metodoPago` | string | `EFECTIVO`, `TARJETA` o `TRANSFERENCIA` |
| `page` | integer | Número de página (base 0). Default: `0` |
| `size` | integer | Tamaño de página. Default: `20` |

**Ejemplos:**
```
GET /api/ventas
GET /api/ventas?page=0&size=10
GET /api/ventas?fecha=2026-05-08
GET /api/ventas?cedulaCliente=0987654321
GET /api/ventas?metodoPago=EFECTIVO
GET /api/ventas?fecha=2026-05-08&metodoPago=TARJETA&page=0&size=5
```

**Respuesta 200:** array de objetos `VentaResponse` (mismo modelo que el POST).

---

#### `GET /api/ventas/{id}`
Obtiene una venta por su ID numérico.

**Respuesta 200:** objeto `VentaResponse` completo.

---

#### `GET /api/ventas/factura/{numeroFactura}`
Obtiene una venta por su número de factura.

**Ejemplo:** `GET /api/ventas/factura/FAC-20260508-000001`

**Respuesta 200:** objeto `VentaResponse` completo.

---

### 💸 Reembolsos

#### `POST /api/ventas/{id}/reembolso`
Reembolsa una venta completa. Devuelve el stock de todos los productos automáticamente.

**Request body:**
```json
{
  "motivo": "El cliente recibió un producto defectuoso"
}
```

| Campo | Tipo | Reglas |
|-------|------|--------|
| `motivo` | string | Requerido, 10–500 caracteres |

**Respuesta 200:**
```json
{
  "id": 1,
  "ventaId": 1,
  "motivo": "El cliente recibió un producto defectuoso",
  "fecha": "2026-05-08T10:30:00",
  "usuarioId": 1,
  "nombreUsuario": "admin"
}
```

**Errores posibles:**
- `400` — Venta ya fue reembolsada anteriormente
- `400` — Motivo muy corto (< 10 caracteres)
- `404` — Venta no encontrada

---

### ⚙️ Configuración

#### `GET /api/configuracion/tasa-impuesto`
Obtiene la tasa de impuesto global actual.

**Respuesta 200:**
```json
{
  "clave": "tasa_impuesto",
  "valor": "0.05",
  "valorDecimal": 0.05
}
```

> Usa `valorDecimal` para cálculos. `valor` es la representación en string.

---

#### `PUT /api/configuracion/tasa-impuesto`
Actualiza la tasa de impuesto global.

**Request body:**
```json
{
  "tasaImpuesto": 0.12
}
```

| Campo | Tipo | Reglas |
|-------|------|--------|
| `tasaImpuesto` | number | Requerido, entre `0.0` y `1.0` |

**Respuesta 200:** objeto `ConfiguracionResponse` actualizado.

---

## Modelos de datos (TypeScript)

Tipos listos para usar en tu frontend:

```typescript
// Auth
interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  username: string;
  nombre: string;
}

// Productos
interface ProductoResponse {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  activo: boolean;
}

interface CrearProductoRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
}

// Ventas
interface ItemVentaRequest {
  productoId: number;
  cantidad: number;
}

interface PagoRequest {
  metodoPago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';
  monto: number;
}

interface RegistrarVentaRequest {
  nombreCliente: string;
  cedulaCliente: string;
  items: ItemVentaRequest[];
  pagos: PagoRequest[];
}

interface DetalleVentaResponse {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnit: number;
  subtotal: number;
}

interface PagoResponse {
  id: number;
  metodoPago: string;
  monto: number;
}

interface ReembolsoResponse {
  id: number;
  ventaId: number;
  motivo: string;
  fecha: string; // ISO-8601 datetime
  usuarioId: number;
  nombreUsuario: string;
}

interface VentaResponse {
  id: number;
  numeroFactura: string;
  usuarioId: number;
  nombreCajero: string;
  nombreCliente: string;
  cedulaCliente: string;
  detalles: DetalleVentaResponse[];
  pagos: PagoResponse[];
  subtotal: number;
  tasaImpuesto: number;
  impuesto: number;
  total: number;
  fecha: string; // ISO-8601 datetime
  reembolsada: boolean;
  reembolso: ReembolsoResponse | null;
}

// Configuración
interface ConfiguracionResponse {
  clave: string;
  valor: string;
  valorDecimal: number;
}

// Errores
interface ErrorResponse {
  success: false;
  message: string;
  timestamp: string;
}

interface ValidationErrorResponse extends ErrorResponse {
  errors: Record<string, string>;
}
```

---

## Manejo de errores

Todos los errores siguen el mismo formato base:

```json
{
  "success": false,
  "message": "Descripción del error",
  "timestamp": "2026-05-08T10:00:00"
}
```

Para errores de validación (`400`), viene además el campo `errors`:

```json
{
  "success": false,
  "message": "Datos de entrada inválidos",
  "errors": {
    "cedulaCliente": "La cédula del cliente debe tener exactamente 10 dígitos",
    "nombreCliente": "El nombre del cliente solo puede contener letras, espacios y tildes"
  },
  "timestamp": "2026-05-08T10:00:00"
}
```

### Tabla de códigos HTTP

| Código | Cuándo ocurre |
|--------|---------------|
| `200` | OK — operación exitosa |
| `201` | Created — recurso creado (productos, ventas) |
| `204` | No Content — eliminación exitosa |
| `400` | Bad Request — validación fallida o regla de negocio violada |
| `401` | Unauthorized — sin token o token inválido/expirado |
| `404` | Not Found — recurso no encontrado |
| `500` | Internal Server Error — error inesperado del servidor |

---

## Ejemplo de cliente HTTP (fetch)

```typescript
const BASE_URL = 'http://localhost:8081';

// Guardar token tras login
async function login(username: string, password: string) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Login fallido');
  const data = await res.json();
  localStorage.setItem('token', data.token);
  return data;
}

// Helper para requests autenticados
async function apiFetch(path: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Token expirado — redirigir a login
    localStorage.removeItem('token');
    window.location.href = '/login';
    return;
  }

  if (!res.ok) {
    const error = await res.json();
    throw error; // lanza el objeto ErrorResponse
  }

  if (res.status === 204) return null;
  return res.json();
}

// Ejemplos de uso
const productos = await apiFetch('/api/productos');
const venta = await apiFetch('/api/ventas', {
  method: 'POST',
  body: JSON.stringify({ ... }),
});
```

---

## Reglas de negocio importantes para la UI

| Regla | Detalle |
|-------|---------|
| **Nombre cliente** | Mínimo 2 palabras, solo letras/espacios/tildes/ñ, 3–50 chars |
| **Cédula cliente** | Exactamente 10 dígitos numéricos |
| **Métodos de pago** | Solo: `EFECTIVO`, `TARJETA`, `TRANSFERENCIA` |
| **Suma de pagos** | Debe ser exactamente igual al total calculado |
| **Pago múltiple** | Se pueden combinar métodos en una misma venta |
| **Número de factura** | Formato `FAC-YYYYMMDD-NNNNNN` — generado por el servidor |
| **Cajero** | Se extrae del JWT — no se envía en el body |
| **Tasa de impuesto** | Obtenerla de `GET /api/configuracion/tasa-impuesto` antes de mostrar precios |
| **Eliminación de producto** | Es lógica — el producto sigue en BD con `activo: false` |
| **Reembolso** | Solo total, una sola vez por venta — devuelve stock automáticamente |
| **Precio en ventas** | El precio se toma del producto al momento de la venta, no se envía |

---

## Flujo típico de una venta (para guiar la UI)

```
1. GET  /api/configuracion/tasa-impuesto  → obtener tasa para calcular preview
2. GET  /api/productos                    → cargar catálogo
3. [usuario selecciona productos y cantidades]
4. [calcular subtotal, impuesto y total en el frontend para mostrar]
5. POST /api/ventas                       → enviar venta (pagos deben sumar exactamente el total)
6. Mostrar número de factura de la respuesta
```

---

## CORS

Si el frontend corre en un origen distinto (ej. `http://localhost:3000`), verifica que el backend tenga CORS habilitado para ese origen. Consulta con el equipo backend si ves errores de CORS en el navegador.
