# Design — Sistema POS Frontend

**Versión:** 2.0.0
**Fecha:** 2026-05-10
**Referencia API:** `guia.md` — Sistema POS API (base URL `http://localhost:8081`)

---

## 1. Arquitectura del Frontend

El frontend aplica una separación de responsabilidades en capas: los componentes de UI no conocen la API, los servicios no conocen el estado global, y la lógica de negocio vive en composables y utilidades puras.

```
┌──────────────────────────────────────────────────────────────────────┐
│                          VISTAS (Views)                              │
│   LoginView │ ProductosView │ PosView │ VentasView │ ConfigView      │
└──────────────┬───────────────────────────────────────────────────────┘
               │ usan
┌──────────────▼───────────────────────────────────────────────────────┐
│                       COMPONENTES UI                                 │
│  LoginForm │ ProductoForm │ ProductoTable │ CarritoVenta             │
│  PagoForm  │ VentaDetalle │ ReembolsoForm │ VentaFiltros             │
└──────────────┬───────────────────────────────────────────────────────┘
               │ usan
┌──────────────▼───────────────────────────────────────────────────────┐
│              COMPOSABLES (Lógica de negocio)                         │
│  useAuth │ useProductos │ useCarrito │ useVentas │ useConfiguracion  │
└──────────────┬───────────────────────────────────────────────────────┘
               │ usan
┌──────────────▼───────────────────────────────────────────────────────┐
│                  SERVICIOS HTTP (API Layer)                          │
│  authService │ productoService │ ventaService │ configuracionService │
└──────────────┬───────────────────────────────────────────────────────┘
               │ usan
┌──────────────▼───────────────────────────────────────────────────────┐
│                  API CLIENT (Interceptor JWT)                        │
│                         apiClient.ts                                 │
└──────────────┬───────────────────────────────────────────────────────┘
               │ HTTP/JSON
┌──────────────▼───────────────────────────────────────────────────────┐
│              BACKEND API REST (Spring Boot)                          │
│  POST /api/auth/login                                                │
│  GET|POST|PUT|DELETE /api/productos                                  │
│  POST|GET /api/ventas  │  POST /api/ventas/{id}/reembolso            │
│  GET|PUT /api/configuracion/tasa-impuesto                            │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 2. Principios de Diseño Aplicados

### SRP — Single Responsibility

- Los componentes solo renderizan UI y delegan eventos a composables.
- Los composables solo orquestan lógica y llaman a servicios.
- Los servicios solo realizan llamadas HTTP.
- Las utilidades solo ejecutan cálculos puros (sin efectos secundarios).

### DIP — Dependency Inversion

- Los componentes dependen de composables (abstracciones), no de `axios` directamente.
- Los composables dependen de servicios (abstracciones), no de `fetch` directamente.
- En tests, los servicios se reemplazan por mocks sin modificar componentes ni composables.

### ISP — Interface Segregation

- Cada composable expone solo lo que el componente necesita.
- `useCarrito` expone `{ items, agregar, eliminar, vaciar, subtotal, impuesto, total, tasaImpuesto, confirmar }`.
- `useProductos` expone `{ productos, crear, actualizar, eliminar, loading, error }`.
- `useVentas` expone `{ ventas, cargar, filtros, pagina, totalPaginas, loading, error }`.

### Separación de estado

- Estado global (token, usuario, nombre): `authStore` (Pinia).
- Estado de dominio (productos, carrito, ventas): composables locales con `ref`/`reactive`.
- Estado de UI (loading, errores): dentro de cada composable.

---

## 3. Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| Vue | 3.x | Framework UI (Composition API) |
| TypeScript | 5.x | Tipado estático |
| Vite | 5.x | Build tool y dev server |
| Vue Router | 4.x | Enrutamiento SPA |
| Axios | 1.x | Cliente HTTP |
| Pinia | 2.x | Estado global (auth) |
| Tailwind CSS | 3.x | Estilos utilitarios |
| Vitest | 1.x | Framework de testing |
| Vue Test Utils | 2.x | Tests de componentes Vue |
| @testing-library/vue | 8.x | Tests de componentes (queries semánticas) |
| fast-check | 3.x | Property-based testing |
| MSW (Mock Service Worker) | 2.x | Mock de API en tests |

---

## 4. Estructura de Carpetas

```
pos-frontend/
├── src/
│   ├── main.ts
│   ├── App.vue
│   │
│   ├── views/
│   │   ├── LoginView.vue
│   │   ├── ProductosView.vue
│   │   ├── PosView.vue
│   │   ├── VentasView.vue
│   │   └── ConfiguracionView.vue
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   └── LoginForm.vue
│   │   ├── productos/
│   │   │   ├── ProductoTable.vue
│   │   │   ├── ProductoForm.vue
│   │   │   └── ProductoRow.vue
│   │   ├── pos/
│   │   │   ├── CarritoVenta.vue
│   │   │   ├── CarritoItem.vue
│   │   │   ├── ProductoSelector.vue
│   │   │   ├── PagoForm.vue           ← NUEVO: datos cliente + métodos de pago
│   │   │   └── ResumenVenta.vue
│   │   ├── ventas/
│   │   │   ├── VentaTable.vue         ← NUEVO: lista paginada de ventas
│   │   │   ├── VentaDetalle.vue       ← NUEVO: detalle completo de una venta
│   │   │   ├── VentaFiltros.vue       ← NUEVO: filtros por fecha/cédula/método
│   │   │   └── ReembolsoForm.vue      ← NUEVO: formulario de reembolso
│   │   └── shared/
│   │       ├── Navbar.vue
│   │       ├── LoadingSpinner.vue
│   │       └── ErrorAlert.vue
│   │
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── useProductos.ts
│   │   ├── useCarrito.ts              ← actualizado: impuesto, cliente, pagos
│   │   ├── useVentas.ts               ← actualizado: filtros, paginación, reembolso
│   │   └── useConfiguracion.ts        ← NUEVO: tasa de impuesto
│   │
│   ├── services/
│   │   ├── apiClient.ts
│   │   ├── authService.ts
│   │   ├── productoService.ts
│   │   ├── ventaService.ts            ← actualizado: filtros, reembolso
│   │   └── configuracionService.ts    ← NUEVO
│   │
│   ├── stores/
│   │   └── authStore.ts               ← actualizado: campo `nombre`
│   │
│   ├── types/
│   │   ├── auth.types.ts              ← actualizado: LoginResponse con `nombre`
│   │   ├── producto.types.ts
│   │   └── venta.types.ts             ← actualizado: tipos completos de la API
│   │
│   ├── router/
│   │   └── index.ts                   ← actualizado: rutas /ventas y /configuracion
│   │
│   └── utils/
│       ├── calcularTotal.ts           ← actualizado: incluye impuesto
│       ├── formatCurrency.ts
│       └── validaciones.ts            ← NUEVO: validarCedula, validarNombreCliente
│
├── src/__tests__/
│   ├── utils/
│   │   ├── calcularTotal.test.ts
│   │   ├── formatCurrency.test.ts
│   │   └── validaciones.test.ts       ← NUEVO
│   ├── composables/
│   │   ├── useCarrito.test.ts
│   │   ├── useProductos.test.ts
│   │   ├── useAuth.test.ts
│   │   ├── useVentas.test.ts
│   │   └── useConfiguracion.test.ts   ← NUEVO
│   ├── stores/
│   │   └── authStore.test.ts
│   ├── services/
│   │   ├── authService.test.ts
│   │   ├── productoService.test.ts
│   │   ├── ventaService.test.ts
│   │   └── configuracionService.test.ts ← NUEVO
│   └── components/
│       ├── LoginForm.test.ts
│       ├── ProductoForm.test.ts
│       ├── CarritoVenta.test.ts
│       └── PagoForm.test.ts           ← NUEVO
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## 5. Tipos TypeScript (DTOs)

Alineados exactamente con los contratos de la API:

```typescript
// types/auth.types.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  nombre: string;           // nombre display del usuario (ej. "Administrador")
}

// types/producto.types.ts
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number;
  stock: number;
  activo: boolean;
}

export interface CrearProductoRequest {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
}

// types/venta.types.ts
export type MetodoPago = 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA';

export interface ItemVentaRequest {
  productoId: number;
  cantidad: number;
}

export interface PagoRequest {
  metodoPago: MetodoPago;
  monto: number;
}

export interface RegistrarVentaRequest {
  nombreCliente: string;      // mínimo 2 palabras, 3–50 chars, solo letras/espacios/tildes/ñ
  cedulaCliente: string;      // exactamente 10 dígitos numéricos
  items: ItemVentaRequest[];
  pagos: PagoRequest[];
}

export interface DetalleVentaResponse {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnit: number;
  subtotal: number;
}

export interface PagoResponse {
  id: number;
  metodoPago: string;
  monto: number;
}

export interface ReembolsoResponse {
  id: number;
  ventaId: number;
  motivo: string;
  fecha: string;              // ISO-8601 datetime
  usuarioId: number;
  nombreUsuario: string;
}

export interface VentaResponse {
  id: number;
  numeroFactura: string;      // formato FAC-YYYYMMDD-NNNNNN
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
  fecha: string;              // ISO-8601 datetime
  reembolsada: boolean;
  reembolso: ReembolsoResponse | null;
}

export interface ReembolsoRequest {
  motivo: string;             // 10–500 caracteres
}

export interface FiltrosVenta {
  fecha?: string;             // YYYY-MM-DD
  cedulaCliente?: string;
  metodoPago?: MetodoPago;
  page?: number;              // base 0
  size?: number;              // default 20
}

// Carrito (estado local, no viene del backend)
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}

// types/configuracion.types.ts
export interface ConfiguracionResponse {
  clave: string;
  valor: string;
  valorDecimal: number;
}

export interface ActualizarTasaRequest {
  tasaImpuesto: number;       // entre 0.0 y 1.0
}

// Errores
export interface ErrorResponse {
  success: false;
  message: string;
  timestamp: string;
}

export interface ValidationErrorResponse extends ErrorResponse {
  errors: Record<string, string>;
}
```

---

## 6. API Client — Interceptor JWT

```typescript
// services/apiClient.ts
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Inyecta el token en cada request
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

// Redirige al login si el token expiró (401)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore();
      authStore.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 7. Servicios HTTP

### ventaService

```typescript
// services/ventaService.ts
export const ventaService = {
  registrar(data: RegistrarVentaRequest): Promise<VentaResponse>,
  listar(filtros?: FiltrosVenta): Promise<VentaResponse[]>,
  obtener(id: number): Promise<VentaResponse>,
  obtenerPorFactura(numeroFactura: string): Promise<VentaResponse>,
  reembolsar(id: number, data: ReembolsoRequest): Promise<ReembolsoResponse>,
};
```

### configuracionService

```typescript
// services/configuracionService.ts
export const configuracionService = {
  obtenerTasaImpuesto(): Promise<ConfiguracionResponse>,
  actualizarTasaImpuesto(data: ActualizarTasaRequest): Promise<ConfiguracionResponse>,
};
```

---

## 8. Composables Principales

### useCarrito

```typescript
// composables/useCarrito.ts
export function useCarrito() {
  const items = ref<ItemCarrito[]>([]);
  const tasaImpuesto = ref<number>(0);
  const datosCliente = reactive({ nombreCliente: '', cedulaCliente: '' });
  const pagos = ref<PagoRequest[]>([]);

  const subtotal = computed(() => calcularSubtotalGeneral(items.value));
  const impuesto = computed(() => calcularImpuesto(subtotal.value, tasaImpuesto.value));
  const total    = computed(() => calcularTotal(subtotal.value, tasaImpuesto.value));

  const agregar  = (producto: Producto, cantidad: number) => { /* ... */ };
  const eliminar = (productoId: number) => { /* ... */ };
  const vaciar   = () => { items.value = []; pagos.value = []; };

  const confirmar = async () => {
    if (items.value.length === 0) throw new Error('El carrito está vacío');
    validarDatosCliente(datosCliente);   // lanza si nombre/cédula inválidos
    validarSumaPagos(pagos.value, total.value); // lanza si suma != total
    const resultado = await ventaService.registrar({
      nombreCliente: datosCliente.nombreCliente,
      cedulaCliente: datosCliente.cedulaCliente,
      items: items.value.map(i => ({ productoId: i.producto.id, cantidad: i.cantidad })),
      pagos: pagos.value,
    });
    vaciar();
    return resultado;
  };

  return { items, tasaImpuesto, datosCliente, pagos, subtotal, impuesto, total, agregar, eliminar, vaciar, confirmar };
}
```

### useVentas

```typescript
// composables/useVentas.ts
export function useVentas() {
  const ventas  = ref<VentaResponse[]>([]);
  const loading = ref(false);
  const error   = ref<string | null>(null);
  const filtros = reactive<FiltrosVenta>({ page: 0, size: 20 });

  const cargar   = async () => { /* GET /api/ventas con filtros */ };
  const reembolsar = async (id: number, motivo: string) => {
    /* POST /api/ventas/{id}/reembolso */
  };

  return { ventas, loading, error, filtros, cargar, reembolsar };
}
```

### useConfiguracion

```typescript
// composables/useConfiguracion.ts
export function useConfiguracion() {
  const tasaImpuesto = ref<number>(0);
  const loading = ref(false);

  const cargarTasa = async () => {
    const config = await configuracionService.obtenerTasaImpuesto();
    tasaImpuesto.value = config.valorDecimal;
  };

  const actualizarTasa = async (nuevaTasa: number) => {
    await configuracionService.actualizarTasaImpuesto({ tasaImpuesto: nuevaTasa });
    tasaImpuesto.value = nuevaTasa;
  };

  return { tasaImpuesto, loading, cargarTasa, actualizarTasa };
}
```

---

## 9. Utilidades Puras

```typescript
// utils/calcularTotal.ts
export function calcularSubtotal(precio: number, cantidad: number): number {
  return precio * cantidad;
}

export function calcularSubtotalGeneral(items: ItemCarrito[]): number {
  return items.reduce((acc, i) => acc + i.subtotal, 0);
}

export function calcularImpuesto(subtotal: number, tasa: number): number {
  return subtotal * tasa;
}

export function calcularTotal(subtotal: number, tasa: number): number {
  return subtotal + subtotal * tasa;
}

// utils/validaciones.ts
export function validarCedula(cedula: string): boolean {
  return /^\d{10}$/.test(cedula);
}

export function validarNombreCliente(nombre: string): boolean {
  if (nombre.length < 3 || nombre.length > 50) return false;
  if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return false;
  return nombre.trim().split(/\s+/).length >= 2;
}

export function validarSumaPagos(pagos: PagoRequest[], total: number): boolean {
  const suma = pagos.reduce((acc, p) => acc + p.monto, 0);
  return Math.abs(suma - total) < 0.001; // tolerancia de punto flotante
}
```

---

## 10. Store Global — Autenticación (Pinia)

```typescript
// stores/authStore.ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    token:    localStorage.getItem('token'),
    username: localStorage.getItem('username'),
    nombre:   localStorage.getItem('nombre'),   // ← campo nuevo
  }),
  actions: {
    setAuth(token: string, username: string, nombre: string) {
      this.token    = token;
      this.username = username;
      this.nombre   = nombre;
      localStorage.setItem('token',    token);
      localStorage.setItem('username', username);
      localStorage.setItem('nombre',   nombre);
    },
    logout() {
      this.token    = null;
      this.username = null;
      this.nombre   = null;
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('nombre');
    },
  },
});
```

---

## 11. Rutas y Navegación

```typescript
// router/index.ts
const routes = [
  { path: '/login', component: LoginView },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'productos',      component: ProductosView },
      { path: 'pos',            component: PosView },
      { path: 'ventas',         component: VentasView },
      { path: 'configuracion',  component: ConfiguracionView },
      { path: '',               redirect: '/pos' },
    ],
  },
];

router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token) return { path: '/login' };
  if (to.path === '/login' && authStore.token)  return { path: '/pos' };
});
```

---

## 12. Flujos del Sistema

### 12.1 Flujo de Login

```
LoginView → LoginForm → useAuth.login()
                            │
                    authService.login(credentials)
                            │
                    POST /api/auth/login
                            │
                    ◄── { token, username, nombre }
                            │
                    authStore.setAuth(token, username, nombre)
                            │
                    router.push('/pos')
```

### 12.2 Flujo de Venta POS

```
PosView (onMounted)
  │
  ├── GET /api/configuracion/tasa-impuesto  → tasaImpuesto
  └── GET /api/productos                   → catálogo

ProductoSelector → useCarrito.agregar(producto, cantidad)
                              │
                    calcularSubtotalGeneral(items)
                    calcularImpuesto(subtotal, tasa)
                    calcularTotal(subtotal, tasa)
                              │
                    CarritoVenta muestra items + subtotal + impuesto + total

PagoForm → datosCliente (nombreCliente, cedulaCliente)
         → pagos[] (metodoPago, monto)
         → validarCedula / validarNombreCliente / validarSumaPagos

[Confirmar Venta]
  │
  useCarrito.confirmar()
  │
  ventaService.registrar({ nombreCliente, cedulaCliente, items, pagos })
  │
  POST /api/ventas  (JWT en header)
  │
  ◄── VentaResponse (201) con numeroFactura
  │
  useCarrito.vaciar()
  ResumenVenta muestra numeroFactura
```

### 12.3 Flujo de Reembolso

```
VentasView → VentaDetalle (venta.reembolsada === false)
                │
                [Reembolsar]
                │
            ReembolsoForm → motivo (10–500 chars)
                │
            useVentas.reembolsar(id, motivo)
                │
            POST /api/ventas/{id}/reembolso
                │
            ◄── ReembolsoResponse (200)
                │
            venta.reembolsada = true
            mostrar datos del reembolso
```

---

## 13. Estrategia de Tests

```
┌──────────────────────────────────────────────────────────┐
│  Tests Unitarios (sin DOM, sin API real)                 │
│  - utils/: funciones puras — Vitest                      │
│  - composables/: mountComposable + mocks de servicios    │
│  - services/: mocks de axios (vi.mock)                   │
├──────────────────────────────────────────────────────────┤
│  Tests de Propiedades (PBT)                              │
│  - utils/: fast-check para invariantes matemáticos       │
│  - utils/validaciones: fast-check para reglas de negocio │
│  - composables/: fast-check para invariantes del carrito │
├──────────────────────────────────────────────────────────┤
│  Tests de Componentes (DOM virtual)                      │
│  - @testing-library/vue + jsdom                          │
│  - Mocks de composables para aislar UI de lógica         │
└──────────────────────────────────────────────────────────┘
```

### Ejemplo: Test de validaciones con PBT

```typescript
// __tests__/utils/validaciones.test.ts
import { validarCedula, validarNombreCliente, validarSumaPagos } from '../../utils/validaciones';
import fc from 'fast-check';

describe('validarCedula', () => {
  it('PBT: acepta exactamente 10 dígitos', () => {
    fc.assert(
      fc.property(fc.stringOf(fc.constantFrom('0','1','2','3','4','5','6','7','8','9'), { minLength: 10, maxLength: 10 }), (cedula) => {
        expect(validarCedula(cedula)).toBe(true);
      })
    );
  });

  it('PBT: rechaza strings con longitud != 10', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1, maxLength: 20 }).filter(s => s.length !== 10), (cedula) => {
        expect(validarCedula(cedula)).toBe(false);
      })
    );
  });
});

describe('validarSumaPagos', () => {
  it('PBT: retorna true cuando la suma es exactamente el total', () => {
    fc.assert(
      fc.property(fc.float({ min: 1, max: 10000 }), (total) => {
        const pagos = [{ metodoPago: 'EFECTIVO' as const, monto: total }];
        expect(validarSumaPagos(pagos, total)).toBe(true);
      })
    );
  });
});
```

### Ejemplo: Test de useCarrito con impuesto

```typescript
// __tests__/composables/useCarrito.test.ts
import { useCarrito } from '../../composables/useCarrito';

vi.mock('../../services/ventaService');
vi.mock('../../services/configuracionService');

describe('useCarrito', () => {
  it('calcula impuesto y total correctamente', () => {
    const { agregar, subtotal, impuesto, total, tasaImpuesto } = useCarrito();
    tasaImpuesto.value = 0.05;
    const producto = { id: 1, nombre: 'Café', precio: 10000, stock: 5 } as Producto;

    agregar(producto, 2);

    expect(subtotal.value).toBe(20000);
    expect(impuesto.value).toBeCloseTo(1000);
    expect(total.value).toBeCloseTo(21000);
  });

  it('PBT: total siempre es subtotal + subtotal * tasa', () => {
    fc.assert(
      fc.property(fc.float({ min: 0, max: 1 }), (tasa) => {
        const { tasaImpuesto, subtotal, total } = useCarrito();
        tasaImpuesto.value = tasa;
        expect(total.value).toBeCloseTo(subtotal.value + subtotal.value * tasa);
      })
    );
  });
});
```
