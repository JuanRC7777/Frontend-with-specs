# Design — POS System Frontend

**Version:** 1.0.0
**Date:** 2026-04-28
**Backend reference:** `../diseno.md` v2.0.0

---

## 1. Frontend Architecture

The frontend applies a layered separation of concerns: UI components have no knowledge of the API, services have no knowledge of global state, and business logic lives in composables and pure utilities.

```
┌──────────────────────────────────────────────────────────────┐
│                           VIEWS                              │
│         LoginView  │  ProductsView  │  PosView              │
└──────────────┬───────────────────────────────────────────────┘
               │ use
┌──────────────▼───────────────────────────────────────────────┐
│                       UI COMPONENTS                          │
│   LoginForm │ ProductForm │ ProductTable │ CartSale          │
└──────────────┬───────────────────────────────────────────────┘
               │ use
┌──────────────▼───────────────────────────────────────────────┐
│              COMPOSABLES (Business Logic)                    │
│   useAuth │ useProducts │ useCart │ useSales                 │
└──────────────┬───────────────────────────────────────────────┘
               │ use
┌──────────────▼───────────────────────────────────────────────┐
│                  HTTP SERVICES (API Layer)                   │
│   authService │ productService │ saleService                │
└──────────────┬───────────────────────────────────────────────┘
               │ use
┌──────────────▼───────────────────────────────────────────────┐
│                  API CLIENT (JWT Interceptor)                │
│                       apiClient.ts                           │
└──────────────┬───────────────────────────────────────────────┘
               │ HTTP/JSON
┌──────────────▼───────────────────────────────────────────────┐
│              BACKEND REST API (Spring Boot)                  │
│         POST /api/auth/login                                 │
│         GET|POST|PUT|DELETE /api/productos                   │
│         POST|GET /api/ventas                                 │
└──────────────────────────────────────────────────────────────┘
```

---

## 2. Applied Design Principles

### SRP — Single Responsibility

- Components only render UI and delegate events to composables.
- Composables only orchestrate logic and call services.
- Services only perform HTTP calls.
- Utilities only execute pure calculations (no side effects).

### DIP — Dependency Inversion

- Components depend on composables (abstractions), not on `axios` directly.
- Composables depend on services (abstractions), not on `fetch` directly.
- In tests, services are replaced by mocks without modifying components or composables.

### ISP — Interface Segregation

- Each composable exposes only what the component needs.
- `useCart` exposes `{ items, add, remove, clear, total, confirm }`.
- `useProducts` exposes `{ products, create, update, delete, loading, error }`.

### State Separation

- Global state (token, user): `authStore` (Pinia).
- Domain state (products, cart): local composables with `ref`/`reactive`.
- UI state (loading, errors): inside each composable.

---

## 3. Technology Stack

| Technology | Version | Usage |
|---|---|---|
| Vue | 3.x | UI Framework (Composition API) |
| TypeScript | 5.x | Static typing |
| Vite | 5.x | Build tool and dev server |
| Vue Router | 4.x | SPA routing |
| Axios | 1.x | HTTP client |
| Pinia | 2.x | Global state (auth) |
| Tailwind CSS | 3.x | Utility-first styles |
| Vitest | 1.x | Testing framework |
| Vue Test Utils | 2.x | Vue component tests |
| @testing-library/vue | 8.x | Component tests (semantic queries) |
| fast-check | 3.x | Property-based testing |
| MSW (Mock Service Worker) | 2.x | API mocking in tests |

---

## 4. Folder Structure

```
pos-frontend/
├── src/
│   ├── main.ts                         ← Entry point
│   ├── App.vue                         ← Main router outlet
│   │
│   ├── views/                          ← Page-level views
│   │   ├── LoginView.vue
│   │   ├── ProductsView.vue
│   │   └── PosView.vue
│   │
│   ├── components/                     ← Reusable UI components
│   │   ├── auth/
│   │   │   └── LoginForm.vue
│   │   ├── products/
│   │   │   ├── ProductTable.vue
│   │   │   ├── ProductForm.vue
│   │   │   └── ProductRow.vue
│   │   ├── pos/
│   │   │   ├── CartSale.vue
│   │   │   ├── CartItem.vue
│   │   │   ├── ProductSelector.vue
│   │   │   └── SaleSummary.vue
│   │   └── shared/
│   │       ├── Navbar.vue
│   │       ├── LoadingSpinner.vue
│   │       └── ErrorAlert.vue
│   │
│   ├── composables/                    ← Business logic (Composition API)
│   │   ├── useAuth.ts
│   │   ├── useProducts.ts
│   │   ├── useCart.ts
│   │   └── useSales.ts
│   │
│   ├── services/                       ← HTTP layer (API calls)
│   │   ├── apiClient.ts               ← Axios instance + JWT interceptors
│   │   ├── authService.ts
│   │   ├── productService.ts
│   │   └── saleService.ts
│   │
│   ├── stores/                         ← Global state (Pinia)
│   │   └── authStore.ts               ← token, username, setAuth, logout
│   │
│   ├── types/                          ← TypeScript types (DTOs)
│   │   ├── auth.types.ts
│   │   ├── product.types.ts
│   │   └── sale.types.ts
│   │
│   ├── router/                         ← Route configuration
│   │   └── index.ts
│   │
│   └── utils/                          ← Pure functions
│       ├── calculateTotal.ts
│       └── formatCurrency.ts
│
├── src/__tests__/
│   ├── utils/
│   │   ├── calculateTotal.test.ts
│   │   └── formatCurrency.test.ts
│   ├── composables/
│   │   ├── useCart.test.ts
│   │   ├── useProducts.test.ts
│   │   └── useAuth.test.ts
│   ├── stores/
│   │   └── authStore.test.ts
│   ├── services/
│   │   ├── authService.test.ts
│   │   ├── productService.test.ts
│   │   └── saleService.test.ts
│   └── components/
│       ├── LoginForm.test.ts
│       ├── ProductForm.test.ts
│       └── CartSale.test.ts
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
└── package.json
```

---

## 5. TypeScript Types (DTOs)

Aligned with backend responses:

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

// types/product.types.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
}

// types/sale.types.ts
export interface SaleItem {
  productId: number;
  quantity: number;
}

export interface RegisterSaleRequest {
  items: SaleItem[];
}

export interface SaleResponse {
  id: number;
  total: number;
  date: string;
  details: SaleDetailResponse[];
}

export interface SaleDetailResponse {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

// Cart item (local state, not from backend)
export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}
```

---

## 6. API Client — JWT Interceptor

```typescript
// services/apiClient.ts
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Inject token into every request
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }
  return config;
});

// Redirect to login if token expired (401)
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

## 7. Main Composables

### useCart

```typescript
// composables/useCart.ts
export function useCart() {
  const items = ref<CartItem[]>([]);

  const add = (product: Product, quantity: number) => { /* ... */ };
  const remove = (productId: number) => { /* ... */ };
  const clear = () => { items.value = []; };
  const total = computed(() => calculateTotal(items.value)); // pure function
  const confirm = async () => {
    if (items.value.length === 0) throw new Error('Cart is empty');
    await saleService.register({ items: items.value.map(/* ... */) });
    clear();
  };

  return { items, add, remove, clear, total, confirm };
}
```

### useProducts

```typescript
// composables/useProducts.ts
export function useProducts() {
  const products = ref<Product[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async () => { /* GET /api/productos */ };
  const create = async (data: CreateProductRequest) => { /* ... */ };
  const update = async (id: number, data: CreateProductRequest) => { /* ... */ };
  const remove = async (id: number) => { /* ... */ };

  return { products, loading, error, load, create, update, remove };
}
```

---

## 8. Routes and Navigation

```typescript
// router/index.ts
const routes = [
  { path: '/login', component: LoginView },
  {
    path: '/',
    component: AppLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'productos', component: ProductsView },
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

## 9. Testing Strategy

```
┌──────────────────────────────────────────────────────────┐
│  Unit Tests (no DOM, no real API)                        │
│  - utils/: pure functions — Vitest                       │
│  - composables/: direct call + service mocks             │
│  - services/: axios mocks (vi.mock)                      │
├──────────────────────────────────────────────────────────┤
│  Property-Based Tests (PBT)                              │
│  - utils/: fast-check for mathematical invariants        │
│  - composables/: fast-check for cart invariants          │
├──────────────────────────────────────────────────────────┤
│  Component Tests (virtual DOM)                           │
│  - @testing-library/vue + jsdom                          │
│  - Composable mocks to isolate UI from logic             │
└──────────────────────────────────────────────────────────┘
```

### Example: Pure utility test with PBT

```typescript
// __tests__/utils/calculateTotal.test.ts
import { calculateTotal } from '../../utils/calculateTotal';
import fc from 'fast-check';

describe('calculateTotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(calculateTotal([])).toBe(0);
  });

  it('correctly sums subtotals', () => {
    const items = [{ subtotal: 30 }, { subtotal: 20 }];
    expect(calculateTotal(items)).toBe(50);
  });

  it('PBT: always equals reduce of subtotals', () => {
    fc.assert(
      fc.property(
        fc.array(fc.record({ subtotal: fc.float({ min: 0, max: 1000 }) })),
        (items) => {
          const expected = items.reduce((acc, i) => acc + i.subtotal, 0);
          expect(calculateTotal(items)).toBeCloseTo(expected);
        }
      )
    );
  });
});
```

### Example: Composable test

```typescript
// __tests__/composables/useCart.test.ts
import { useCart } from '../../composables/useCart';

vi.mock('../../services/saleService');

describe('useCart', () => {
  it('calculates total when adding products', () => {
    const { add, total } = useCart();
    const product = { id: 1, name: 'Coffee', price: 10, stock: 5 } as Product;

    add(product, 3);

    expect(total.value).toBe(30);
  });

  it('does not confirm sale with empty cart', async () => {
    const { confirm } = useCart();
    await expect(confirm()).rejects.toThrow('Cart is empty');
  });
});
```

---

## 10. System Flows

### 10.1 Login Flow

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

### 10.2 POS Sale Flow

```
PosView → ProductSelector → useCart.add(product, quantity)
                                        │
                              calculateTotal(items)  ← pure utility (computed)
                                        │
                              CartSale displays items + total
                                        │
                              [Confirm Sale]
                                        │
                              useCart.confirm()
                                        │
                              saleService.register(items)
                                        │
                              POST /api/ventas  (JWT in header)
                                        │
                              ◄── SaleResponse (201)
                                        │
                              useCart.clear()
                              show confirmation
```
