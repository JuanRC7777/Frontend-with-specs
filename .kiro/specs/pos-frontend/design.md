# Design — Sistema POS Frontend

**Versión:** 1.0.0
**Fecha:** 2026-04-28
**Referencia backend:** `../diseno.md` v2.0.0

---

## 1. Arquitectura del Frontend

El frontend aplica una separación de responsabilidades en capas: los componentes de UI no conocen la API, los servicios no conocen el estado global, y la lógica de negocio vive en composables y utilidades puras.

```
┌──────────────────────────────────────────────────────────────┐
│                        VISTAS (Views)                        │
│         LoginView  │  ProductosView  │  PosView             │
└──────────────┬───────────────────────────────────────────────┘
               │ usan
┌──────────────▼───────────────────────────────────────────────┐
│                     COMPONENTES UI                           │
│   LoginForm │ ProductoForm │ ProductoTable │ CarritoVenta    │
└──────────────┬───────────────────────────────────────────────┘
               │ usan
┌──────────────▼───────────────────────────────────────────────┐
│              COMPOSABLES (Lógica de negocio)                 │
│   useAuth │ useProductos │ useCarrito │ useVentas            │
└──────────────┬───────────────────────────────────────────────┘
               │ usan
┌──────────────▼───────────────────────────────────────────────┐
│                  SERVICIOS HTTP (API Layer)                  │
│   authService │ productoService │ ventaService              │
└──────────────┬───────────────────────────────────────────────┘
               │ usan
┌──────────────▼───────────────────────────────────────────────┐
│                  API CLIENT (Interceptor JWT)                │
│                       apiClient.ts                           │
└──────────────┬───────────────────────────────────────────────┘
               │ HTTP/JSON
┌──────────────▼───────────────────────────────────────────────┐
│              BACKEND API REST (Spring Boot)                  │
│         POST /api/auth/login                                 │
│         GET|POST|PUT|DELETE /api/productos                   │
│         POST|GET /api/ventas                                 │
└──────────────────────────────────────────────────────────────┘
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
- `useCarrito` expone `{ items, agregar, eliminar, vaciar, total, confirmar }`.
- `useProductos` expone `{ productos, crear, actualizar, eliminar, loading, error }`.

### Separación de estado

- Estado global (token, usuario): `authStore` (Pinia).
- Estado de dominio (productos, carrito): composables locales con `ref`/`reactive`.
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
│   ├── main.ts                         ← Entry point
│   ├── App.vue                         ← Router principal
│   │
│   ├── views/                          ← Vistas/páginas
│   │   ├── LoginView.vue
│   │   ├── ProductosView.vue
│   │   └── PosView.vue
│   │
│   ├── components/                     ← Componentes UI reutilizables
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
│   │   │   └── ResumenVenta.vue
│   │   └── shared/
│   │       ├── Navbar.vue
│   │       ├── LoadingSpinner.vue
│   │       └── ErrorAlert.vue
│   │
│   ├── composables/                    ← Lógica de negocio (Composition API)
│   │   ├── useAuth.ts
│   │   ├── useProductos.ts
│   │   ├── useCarrito.ts
│   │   └── useVentas.ts
│   │
│   ├── services/                       ← Capa HTTP (API calls)
│   │   ├── apiClient.ts               ← Axios instance + interceptores JWT
│   │   ├── authService.ts
│   │   ├── productoService.ts
│   │   └── ventaService.ts
│   │
│   ├── stores/                         ← Estado global (Pinia)
│   │   └── authStore.ts               ← token, username, setAuth, logout
│   │
│   ├── types/                          ← Tipos TypeScript (DTOs)
│   │   ├── auth.types.ts
│   │   ├── producto.types.ts
│   │   └── venta.types.ts
│   │
│   ├── router/                         ← Configuración de rutas
│   │   └── index.ts
│   │
│   └── utils/                          ← Funciones puras
│       ├── calcularTotal.ts
│       └── formatCurrency.ts
│
├── src/__tests__/
│   ├── utils/
│   │   ├── calcularTotal.test.ts
│   │   └── formatCurrency.test.ts
│   ├── composables/
│   │   ├── useCarrito.test.ts
│   │   ├── useProductos.test.ts
│   │   └── useAuth.test.ts
│   ├── stores/
│   │   └── authStore.test.ts
│   ├── services/
│   │   ├── authService.test.ts
│   │   ├── productoService.test.ts
│   │   └── ventaService.test.ts
│   └── components/
│       ├── LoginForm.test.ts
│       ├── ProductoForm.test.ts
│       └── CarritoVenta.test.ts
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## 5. Tipos TypeScript (DTOs)

Alineados con los responses del backend:

```typescript
// types/auth.types.ts
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  expiresIn: number;
}

// types/producto.types.ts
export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  activo: boolean;
}

export interface CrearProductoRequest {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

// types/venta.types.ts
export interface ItemVenta {
  productoId: number;
  cantidad: number;
}

export interface RegistrarVentaRequest {
  items: ItemVenta[];
}

export interface VentaResponse {
  id: number;
  total: number;
  fecha: string;
  detalles: DetalleVentaResponse[];
}

export interface DetalleVentaResponse {
  productoId: number;
  nombreProducto: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// Carrito (estado local, no viene del backend)
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
  subtotal: number;
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

## 7. Composables Principales

### useCarrito

```typescript
// composables/useCarrito.ts
export function useCarrito() {
  const items = ref<ItemCarrito[]>([]);

  const agregar = (producto: Producto, cantidad: number) => { /* ... */ };
  const eliminar = (productoId: number) => { /* ... */ };
  const vaciar = () => { items.value = []; };
  const total = computed(() => calcularTotal(items.value)); // función pura
  const confirmar = async () => {
    if (items.value.length === 0) throw new Error('El carrito está vacío');
    await ventaService.registrar({ items: items.value.map(/* ... */) });
    vaciar();
  };

  return { items, agregar, eliminar, vaciar, total, confirmar };
}
```

### useProductos

```typescript
// composables/useProductos.ts
export function useProductos() {
  const productos = ref<Producto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const cargar = async () => { /* GET /api/productos */ };
  const crear = async (data: CrearProductoRequest) => { /* ... */ };
  const actualizar = async (id: number, data: CrearProductoRequest) => { /* ... */ };
  const eliminar = async (id: number) => { /* ... */ };

  return { productos, loading, error, cargar, crear, actualizar, eliminar };
}
```

---

## 8. Rutas y Navegación

```typescript
// router/index.ts
const routes = [
  { path: '/login', component: LoginView },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'productos', component: ProductosView },
      { path: 'pos', component: PosView },
      { path: '', redirect: '/pos' },
    ],
  },
];

// Navigation guard
router.beforeEach((to) => {
  const authStore = useAuthStore();
  if (to.meta.requiresAuth && !authStore.token) {
    return { path: '/login' };
  }
});
```

---

## 9. Estrategia de Tests

```
┌──────────────────────────────────────────────────────────┐
│  Tests Unitarios (sin DOM, sin API real)                 │
│  - utils/: funciones puras — Vitest                      │
│  - composables/: mountComposable + mocks de servicios    │
│  - services/: mocks de axios (vi.mock)                   │
├──────────────────────────────────────────────────────────┤
│  Tests de Propiedades (PBT)                              │
│  - utils/: fast-check para invariantes matemáticos       │
│  - composables/: fast-check para invariantes del carrito │
├──────────────────────────────────────────────────────────┤
│  Tests de Componentes (DOM virtual)                      │
│  - @testing-library/vue + jsdom                          │
│  - Mocks de composables para aislar UI de lógica         │
└──────────────────────────────────────────────────────────┘
```

### Ejemplo: Test de utilidad pura con PBT

```typescript
// __tests__/utils/calcularTotal.test.ts
import { calcularTotal } from '../../utils/calcularTotal';
import fc from 'fast-check';

describe('calcularTotal', () => {
  it('retorna 0 con carrito vacío', () => {
    expect(calcularTotal([])).toBe(0);
  });

  it('suma subtotales correctamente', () => {
    const items = [{ subtotal: 30 }, { subtotal: 20 }];
    expect(calcularTotal(items)).toBe(50);
  });

  it('PBT: siempre equivale a reduce de subtotales', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ subtotal: fc.float({ min: 0, max: 1000 }) })),
        (items) => {
          const expected = items.reduce((acc, i) => acc + i.subtotal, 0);
          expect(calcularTotal(items)).toBeCloseTo(expected);
        }
      )
    );
  });
});
```

### Ejemplo: Test de composable

```typescript
// __tests__/composables/useCarrito.test.ts
import { useCarrito } from '../../composables/useCarrito';

vi.mock('../../services/ventaService');

describe('useCarrito', () => {
  it('calcula el total al agregar productos', () => {
    const { agregar, total } = useCarrito();
    const producto = { id: 1, nombre: 'Café', precio: 10, stock: 5 } as Producto;

    agregar(producto, 3);

    expect(total.value).toBe(30);
  });

  it('no confirma venta con carrito vacío', async () => {
    const { confirmar } = useCarrito();
    await expect(confirmar()).rejects.toThrow('El carrito está vacío');
  });
});
```

---

## 10. Flujos del Sistema

### 10.1 Flujo de Login

```
LoginView → LoginForm → useAuth.login()
                            │
                            ▼
                    authService.login(credentials)
                            │
                            ▼
                    POST /api/auth/login
                            │
                    ◄── { token, username }
                            │
                    authStore.setAuth(token, username)
                            │
                    router.push('/pos')
```

### 10.2 Flujo de Venta POS

```
PosView → ProductoSelector → useCarrito.agregar(producto, cantidad)
                                        │
                              calcularTotal(items)  ← utilidad pura (computed)
                                        │
                              CarritoVenta muestra items + total
                                        │
                              [Confirmar Venta]
                                        │
                              useCarrito.confirmar()
                                        │
                              ventaService.registrar(items)
                                        │
                              POST /api/ventas  (con JWT en header)
                                        │
                              ◄── VentaResponse (201)
                                        │
                              useCarrito.vaciar()
                              mostrar confirmación
```
