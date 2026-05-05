# Tasks — POS System Frontend

**Project:** Point of Sale — Vue 3 + TypeScript
**Version:** 1.0.0

---

## 1. Project Setup

- [ ] 1.1 Create project with Vite: `npm create vite@latest pos-frontend -- --template vue-ts`
- [ ] 1.2 Install production dependencies
  - [ ] 1.2.1 `vue-router`
  - [ ] 1.2.2 `axios`
  - [ ] 1.2.3 `pinia`
  - [ ] 1.2.4 `tailwindcss`, `postcss`, `autoprefixer`
- [ ] 1.3 Install development and testing dependencies
  - [ ] 1.3.1 `vitest`
  - [ ] 1.3.2 `@vue/test-utils`
  - [ ] 1.3.3 `@testing-library/vue`, `@testing-library/jest-dom`
  - [ ] 1.3.4 `jsdom`
  - [ ] 1.3.5 `msw` (Mock Service Worker)
  - [ ] 1.3.6 `fast-check` (property-based testing)
- [ ] 1.4 Configure Tailwind CSS (`tailwind.config.ts`, `postcss.config.js`, import in `src/style.css`)
- [ ] 1.5 Configure Vitest in `vite.config.ts`
  - [ ] 1.5.1 Set environment to `jsdom`
  - [ ] 1.5.2 `setupFiles` pointing to `src/setupTests.ts`
  - [ ] 1.5.3 Coverage threshold of 80% for `composables/` and `utils/`
- [ ] 1.6 Create `src/setupTests.ts` with `import '@testing-library/jest-dom'`
- [ ] 1.7 Create folder structure: `views/`, `components/`, `composables/`, `services/`, `stores/`, `types/`, `router/`, `utils/`, `__tests__/`
- [ ] 1.8 Configure `VITE_API_URL` environment variable in `.env` and `.env.example`

---

## 2. TypeScript Types (DTOs)

- [ ] 2.1 Create `types/auth.types.ts`
  - [ ] 2.1.1 `LoginRequest { username, password }`
  - [ ] 2.1.2 `LoginResponse { token, username, expiresIn }`
- [ ] 2.2 Create `types/product.types.ts`
  - [ ] 2.2.1 `Product { id, name, description, price, stock, active }`
  - [ ] 2.2.2 `CreateProductRequest { name, description, price, stock }`
- [ ] 2.3 Create `types/sale.types.ts`
  - [ ] 2.3.1 `SaleItem { productId, quantity }`
  - [ ] 2.3.2 `RegisterSaleRequest { items: SaleItem[] }`
  - [ ] 2.3.3 `SaleResponse { id, total, date, details }`
  - [ ] 2.3.4 `SaleDetailResponse { productId, productName, quantity, unitPrice, subtotal }`
  - [ ] 2.3.5 `CartItem { product: Product, quantity, subtotal }`

---

## 3. Pure Utilities

- [ ] 3.1 Create `utils/calculateTotal.ts`
  - [ ] 3.1.1 `calculateTotal(items: CartItem[]): number` — sum of subtotals
  - [ ] 3.1.2 `calculateSubtotal(price: number, quantity: number): number`
- [ ] 3.2 Create `utils/formatCurrency.ts`
  - [ ] 3.2.1 `formatCurrency(value: number): string` — local currency format
- [ ] 3.3 Unit and property tests — `__tests__/utils/calculateTotal.test.ts`
  - [ ] 3.3.1 `calculateTotal` returns 0 for an empty cart
  - [ ] 3.3.2 `calculateTotal` correctly sums subtotals
  - [ ] 3.3.3 `calculateSubtotal` multiplies price by quantity
  - [ ] 3.3.4 `calculateSubtotal` returns 0 when quantity is 0
  - [ ] 3.3.5 PBT: `calculateTotal` always equals `reduce` of subtotals (fast-check)
  - [ ] 3.3.6 PBT: `calculateTotal` is monotonically increasing when adding items with subtotal > 0
- [ ] 3.4 Unit tests — `__tests__/utils/formatCurrency.test.ts`
  - [ ] 3.4.1 `formatCurrency` correctly formats positive numbers
  - [ ] 3.4.2 `formatCurrency` correctly formats zero

---

## 4. API Client and HTTP Services

- [ ] 4.1 Create `services/apiClient.ts`
  - [ ] 4.1.1 Axios instance with `baseURL` from `VITE_API_URL`
  - [ ] 4.1.2 Request interceptor: inject `Authorization: Bearer <token>` from `authStore`
  - [ ] 4.1.3 Response interceptor: call `authStore.logout()` and redirect to `/login` on HTTP 401
- [ ] 4.2 Create `services/authService.ts`
  - [ ] 4.2.1 `login(data: LoginRequest): Promise<LoginResponse>` → `POST /api/auth/login`
- [ ] 4.3 Create `services/productService.ts`
  - [ ] 4.3.1 `list(): Promise<Product[]>` → `GET /api/productos`
  - [ ] 4.3.2 `get(id: number): Promise<Product>` → `GET /api/productos/{id}`
  - [ ] 4.3.3 `create(data: CreateProductRequest): Promise<Product>` → `POST /api/productos`
  - [ ] 4.3.4 `update(id: number, data: CreateProductRequest): Promise<Product>` → `PUT /api/productos/{id}`
  - [ ] 4.3.5 `remove(id: number): Promise<void>` → `DELETE /api/productos/{id}`
- [ ] 4.4 Create `services/saleService.ts`
  - [ ] 4.4.1 `register(data: RegisterSaleRequest): Promise<SaleResponse>` → `POST /api/ventas`
  - [ ] 4.4.2 `list(): Promise<SaleResponse[]>` → `GET /api/ventas`
- [ ] 4.5 Service tests — `__tests__/services/authService.test.ts`
  - [ ] 4.5.1 `login` returns token when backend responds 200
  - [ ] 4.5.2 `login` throws error when backend responds 401
- [ ] 4.6 Service tests — `__tests__/services/productService.test.ts`
  - [ ] 4.6.1 `list` returns product list
  - [ ] 4.6.2 `create` sends correct data to backend
  - [ ] 4.6.3 `remove` calls DELETE with the correct id
- [ ] 4.7 Service tests — `__tests__/services/saleService.test.ts`
  - [ ] 4.7.1 `register` sends items to backend
  - [ ] 4.7.2 `register` throws error when stock is insufficient (HTTP 400)

---

## 5. Global Store — Authentication (Pinia)

- [ ] 5.1 Create `stores/authStore.ts` with Pinia
  - [ ] 5.1.1 State: `token: string | null`, `username: string | null`
  - [ ] 5.1.2 Action `setAuth(token, username)`: saves to store and `localStorage`
  - [ ] 5.1.3 Action `logout()`: clears store and `localStorage`
  - [ ] 5.1.4 Initialize from `localStorage` on app load
- [ ] 5.2 Store tests — `__tests__/stores/authStore.test.ts`
  - [ ] 5.2.1 PBT: after `setAuth(token, username)`, the store reflects exactly those values
  - [ ] 5.2.2 After `logout()`, `token` and `username` are `null`

---

## 6. Business Logic Composables

- [ ] 6.1 Create `composables/useAuth.ts`
  - [ ] 6.1.1 `login(data: LoginRequest)`: calls `authService.login()`, saves token to store, navigates to `/pos`
  - [ ] 6.1.2 `logout()`: calls `authStore.logout()`, navigates to `/login`
  - [ ] 6.1.3 Exposes `{ login, logout, isAuthenticated, username }`
- [ ] 6.2 Create `composables/useProducts.ts`
  - [ ] 6.2.1 Reactive state: `products`, `loading`, `error`
  - [ ] 6.2.2 `load()`: calls `productService.list()`
  - [ ] 6.2.3 `create(data)`: calls `productService.create()`, updates list
  - [ ] 6.2.4 `update(id, data)`: calls `productService.update()`, updates list
  - [ ] 6.2.5 `remove(id)`: calls `productService.remove()`, updates list
- [ ] 6.3 Create `composables/useCart.ts`
  - [ ] 6.3.1 Reactive state: `items: Ref<CartItem[]>`
  - [ ] 6.3.2 `add(product, quantity)`: adds or increments item, calculates subtotal with `calculateSubtotal`
  - [ ] 6.3.3 `remove(productId)`: removes item from cart
  - [ ] 6.3.4 `clear()`: empties the cart
  - [ ] 6.3.5 `total`: `computed` using `calculateTotal(items.value)` (pure utility)
  - [ ] 6.3.6 `confirm()`: validates cart is not empty, calls `saleService.register()`, clears cart
- [ ] 6.4 Create `composables/useSales.ts`
  - [ ] 6.4.1 `load()`: calls `saleService.list()`
  - [ ] 6.4.2 Exposes `{ sales, loading, error }`
- [ ] 6.5 Unit tests — `__tests__/composables/useAuth.test.ts`
  - [ ] 6.5.1 `login` saves token to store when credentials are valid
  - [ ] 6.5.2 `login` exposes error when credentials are invalid
  - [ ] 6.5.3 `logout` clears the token from the store
- [ ] 6.6 Unit and property tests — `__tests__/composables/useCart.test.ts`
  - [ ] 6.6.1 `add` correctly calculates subtotal
  - [ ] 6.6.2 `add` increments quantity if product already exists in cart
  - [ ] 6.6.3 `remove` removes the item from the cart
  - [ ] 6.6.4 `total` updates reactively when products are added
  - [ ] 6.6.5 `confirm` throws error with empty cart
  - [ ] 6.6.6 `confirm` clears the cart after processing the sale
  - [ ] 6.6.7 PBT: after `add(product, quantity)`, item exists with quantity >= quantity
  - [ ] 6.6.8 PBT: after `remove(productId)`, no item has that productId
  - [ ] 6.6.9 PBT: after `clear()`, `items.value.length === 0` and `total.value === 0`
- [ ] 6.7 Unit tests — `__tests__/composables/useProducts.test.ts`
  - [ ] 6.7.1 `load` populates the product list
  - [ ] 6.7.2 `create` adds the product to the list
  - [ ] 6.7.3 `remove` removes the product from the list

---

## 7. Routing

- [ ] 7.1 Create `router/index.ts` with Vue Router 4
  - [ ] 7.1.1 Public route: `/login` → `LoginView`
  - [ ] 7.1.2 Protected routes with `meta: { requiresAuth: true }`: `/productos` → `ProductsView`, `/pos` → `PosView`
  - [ ] 7.1.3 Root route `/` redirects to `/pos`
- [ ] 7.2 Add navigation guard in `router/index.ts`
  - [ ] 7.2.1 If route requires auth and no token, redirect to `/login`
  - [ ] 7.2.2 If user is already authenticated and accesses `/login`, redirect to `/pos`
- [ ] 7.3 Register router in `main.ts` alongside Pinia

---

## 8. Shared Components

- [ ] 8.1 Create `components/shared/Navbar.vue`
  - [ ] 8.1.1 Shows links to `/productos` and `/pos`
  - [ ] 8.1.2 Shows authenticated user's name from `authStore`
  - [ ] 8.1.3 Logout button that calls `useAuth().logout()`
- [ ] 8.2 Create `components/shared/LoadingSpinner.vue`
- [ ] 8.3 Create `components/shared/ErrorAlert.vue` — receives `message: string` as prop

---

## 9. Authentication Module

- [ ] 9.1 Create `components/auth/LoginForm.vue`
  - [ ] 9.1.1 Fields: username, password (with `v-model`)
  - [ ] 9.1.2 Client validation: required fields before emitting submit
  - [ ] 9.1.3 Shows error if `useAuth().login()` fails
  - [ ] 9.1.4 Shows `LoadingSpinner` during the request
- [ ] 9.2 Create `views/LoginView.vue`
  - [ ] 9.2.1 Renders `LoginForm`
  - [ ] 9.2.2 Redirects to `/pos` if token already exists on mount
- [ ] 9.3 Component tests — `__tests__/components/LoginForm.test.ts`
  - [ ] 9.3.1 Renders username and password fields
  - [ ] 9.3.2 Shows error if fields are empty on submit
  - [ ] 9.3.3 Calls `useAuth().login()` composable with correct data
  - [ ] 9.3.4 Shows spinner during the request

---

## 10. Products Module

- [ ] 10.1 Create `components/products/ProductTable.vue`
  - [ ] 10.1.1 Table with columns: name, price, stock, actions (edit, delete)
  - [ ] 10.1.2 "New Product" button that emits event to open the form
  - [ ] 10.1.3 Shows `LoadingSpinner` while loading
- [ ] 10.2 Create `components/products/ProductForm.vue`
  - [ ] 10.2.1 Fields: name, description, price, stock (with `v-model`)
  - [ ] 10.2.2 Validations: name required, price > 0, stock >= 0
  - [ ] 10.2.3 Optional prop `product?: Product` for edit mode
  - [ ] 10.2.4 Calls `useProducts().create()` or `useProducts().update()` accordingly
- [ ] 10.3 Create `views/ProductsView.vue`
  - [ ] 10.3.1 Uses `useProducts` to load and manage products
  - [ ] 10.3.2 Renders `ProductTable` and `ProductForm` (modal or side panel)
- [ ] 10.4 Component tests — `__tests__/components/ProductForm.test.ts`
  - [ ] 10.4.1 Renders empty form for new product
  - [ ] 10.4.2 Pre-fills data when receiving `product` prop
  - [ ] 10.4.3 Shows error if price is zero
  - [ ] 10.4.4 Shows error if stock is negative
  - [ ] 10.4.5 Calls the correct composable method with valid data

---

## 11. POS Module — Sales Recording

- [ ] 11.1 Create `components/pos/ProductSelector.vue`
  - [ ] 11.1.1 List of available products with stock > 0
  - [ ] 11.1.2 Quantity input per product
  - [ ] 11.1.3 "Add to cart" button that calls `useCart().add()`
- [ ] 11.2 Create `components/pos/CartItem.vue`
  - [ ] 11.2.1 Shows name, quantity, unit price, and formatted subtotal
  - [ ] 11.2.2 Remove button that calls `useCart().remove()`
- [ ] 11.3 Create `components/pos/CartSale.vue`
  - [ ] 11.3.1 List of `CartItem` components
  - [ ] 11.3.2 Shows grand total formatted with `formatCurrency`
  - [ ] 11.3.3 "Confirm Sale" button disabled when `items.length === 0`
  - [ ] 11.3.4 Shows `ErrorAlert` if backend returns insufficient stock
- [ ] 11.4 Create `components/pos/SaleSummary.vue`
  - [ ] 11.4.1 Shows confirmation after successful sale with sale details
- [ ] 11.5 Create `views/PosView.vue`
  - [ ] 11.5.1 Uses `useProducts` to load products
  - [ ] 11.5.2 Uses `useCart` to manage the cart
  - [ ] 11.5.3 Renders `ProductSelector` and `CartSale` in a two-column layout
- [ ] 11.6 Component tests — `__tests__/components/CartSale.test.ts`
  - [ ] 11.6.1 Renders empty cart initially
  - [ ] 11.6.2 Shows updated total when products are added
  - [ ] 11.6.3 Disables "Confirm" button with empty cart
  - [ ] 11.6.4 Shows error when backend returns 400
  - [ ] 11.6.5 Clears cart after processing successful sale

---

## 12. Testing — Coverage and Quality

- [ ] 12.1 Run all tests: `npx vitest run`
- [ ] 12.2 Generate coverage report: `npx vitest run --coverage`
- [ ] 12.3 Verify coverage ≥ 80% in `composables/` and `utils/`
- [ ] 12.4 Verify no composable or utility test makes real HTTP calls
- [ ] 12.5 Verify component tests use composable mocks (not real services)

---

## 13. Deployment

- [ ] 13.1 Configure `.env.production` with `VITE_API_URL` pointing to the production backend
- [ ] 13.2 Generate production build: `npm run build`
- [ ] 13.3 Verify the build in `dist/` works correctly
- [ ] 13.4 Create `Dockerfile` to serve the build with Nginx
- [ ] 13.5 Configure Nginx to handle SPA routes (redirect to `index.html`)
- [ ] 13.6 Document environment variables and deployment steps in `README.md`
