# Requirements — POS System Frontend

**Version:** 1.0.0
**Date:** 2026-04-28
**Status:** Active
**Backend reference:** `../requerimientos.md` v2.0.0

---

## 1. Introduction

### 1.1 Purpose

This document describes the functional requirements, non-functional requirements, and architectural constraints of the POS system frontend. The frontend consumes the backend REST API (Spring Boot + JWT) and is built with Vue 3 + TypeScript, following separation of concerns principles, reusable components, and unit tests.

### 1.2 Scope

The frontend covers the following functionality:

- Login screen with JWT authentication.
- Product management module (CRUD).
- POS interface for recording sales with automatic total calculation.
- Route protection for unauthenticated users.
- Error handling and visual feedback for the user.

Out of scope: advanced reports, user management, electronic invoicing.

### 1.3 Definitions and Acronyms

| Term | Description |
|---|---|
| SPA | Single Page Application |
| JWT | JSON Web Token |
| API | Backend programming interface |
| Store | Centralized global state (Pinia) |
| Service | Module responsible for HTTP calls to the API |
| Composable | Reusable Vue 3 function (Composition API) that encapsulates logic |
| DTO | Data Transfer Object between frontend and API |
| SRP | Single Responsibility Principle |
| ISP | Interface Segregation Principle |
| DIP | Dependency Inversion Principle |

---

## 2. Functional Requirements

### FR-FE-01: Authentication (Login)

- **FR-FE-01.1** The system must display a login screen with username and password fields.
- **FR-FE-01.2** Upon submitting valid credentials, the frontend must store the JWT token received from the backend.
- **FR-FE-01.3** The JWT token must be persisted in `localStorage` to maintain the session across page reloads.
- **FR-FE-01.4** If credentials are invalid, the system must display a descriptive error message.
- **FR-FE-01.5** The user must be able to log out, removing the token and redirecting to the login page.
- **FR-FE-01.6** All routes except `/login` must be protected and redirect to login if no token is present.

### FR-FE-02: Product Management

- **FR-FE-02.1** The system must display a table with all active products retrieved from the backend.
- **FR-FE-02.2** The user can create a new product via a form with the fields: name, description, price, and stock.
- **FR-FE-02.3** The user can edit an existing product from the list.
- **FR-FE-02.4** The user can delete a product with prior confirmation.
- **FR-FE-02.5** The form must validate on the client side that the price is greater than zero and the stock is not negative before sending to the backend.
- **FR-FE-02.6** The system must display success or error messages after each CRUD operation.

### FR-FE-03: POS Interface — Sales Recording

- **FR-FE-03.1** The system must display a POS screen with the list of available products.
- **FR-FE-03.2** The user can add products to the sale cart by specifying the quantity.
- **FR-FE-03.3** The system must calculate and display in real time the line subtotal (price × quantity) and the grand total.
- **FR-FE-03.4** The user can remove a product from the cart before confirming the sale.
- **FR-FE-03.5** The user can confirm the sale by sending the cart to the backend (`POST /api/ventas`).
- **FR-FE-03.6** If the backend returns an insufficient stock error (HTTP 400), the system must display the corresponding error message.
- **FR-FE-03.7** After successfully confirming the sale, the cart must be cleared and a confirmation shown to the user.
- **FR-FE-03.8** Confirming a sale with an empty cart must not be allowed.

### FR-FE-04: Navigation and Routes

- **FR-FE-04.1** The application must have defined routes: `/login`, `/productos`, `/pos`.
- **FR-FE-04.2** After a successful login, the user must be redirected to `/pos`.
- **FR-FE-04.3** The system must include a navigation bar visible to authenticated users.
- **FR-FE-04.4** The navigation bar must display the authenticated user's name and a logout button.

---

## 3. Non-Functional Requirements

### NFR-FE-01: Security

- The JWT token must be automatically included in the `Authorization: Bearer <token>` header on all authenticated requests.
- The token must not be exposed in the URL or in browser logs.
- When the token expires (HTTP 401 response), the system must automatically redirect to login.
- Protected routes must verify the existence of the token before rendering.

### NFR-FE-02: Performance

- The application must load in under 3 seconds under normal network conditions.
- Product lists must render efficiently (avoid unnecessary re-renders).
- Cart total calculation must be reactive with no perceptible latency.

### NFR-FE-03: Usability

- The interface must be responsive and work correctly on desktop screens (minimum 1024px).
- Forms must display clear validation messages next to the field that failed.
- Asynchronous operations must show loading indicators (spinner).
- Backend errors must be shown in visible notifications or alerts.

### NFR-FE-04: Architecture and Code Quality

- **NFR-FE-04.1 (SRP)** Each component has a single responsibility. UI components do not make HTTP calls directly.
- **NFR-FE-04.2 (DIP)** Components depend on composables and abstract services, not on `axios` directly.
- **NFR-FE-04.3** Business logic (total calculation, validations) must reside in composables or utility functions, not in components.
- **NFR-FE-04.4** HTTP services must be centralized in a `services/` layer, separate from components.
- **NFR-FE-04.5** Global state (token, user) must be managed in a centralized store with Pinia.

### NFR-FE-05: Testing

- **NFR-FE-05.1** Business logic composables must have unit tests with Vitest + Vue Test Utils.
- **NFR-FE-05.2** Utility functions (total calculation, formatting) must have 100% coverage.
- **NFR-FE-05.3** Critical components (LoginForm, CartSale, ProductForm) must have rendering and behavior tests.
- **NFR-FE-05.4** HTTP services must be tested with axios mocks (no real API calls).
- **NFR-FE-05.5** Minimum coverage for composables and utilities must be 80%.

---

## 4. Business Rules

| ID | Rule | Implementation |
|---|---|---|
| BR-FE-01 | A line subtotal is `price × quantity`. | `useCart` composable / `calculateSubtotal` utility |
| BR-FE-02 | The sale total is the sum of all subtotals. | `useCart` composable / `calculateTotal` utility |
| BR-FE-03 | A sale cannot be confirmed with an empty cart. | Validation in `useCart` before calling the API |
| BR-FE-04 | Minimum quantity per product in the cart is 1. | Validation in POS form |
| BR-FE-05 | Price must be greater than zero when creating/editing a product. | Validation in `ProductForm` |
| BR-FE-06 | Stock cannot be negative when creating/editing a product. | Validation in `ProductForm` |
| BR-FE-07 | The JWT token must be sent on every authenticated request. | Interceptor in `apiClient` |
| BR-FE-08 | If the backend returns 401, the user must be automatically logged out. | Interceptor in `apiClient` |

---

## 5. Main Use Cases

### UC-FE-01: Log In

- **Actor:** Unauthenticated user
- **Precondition:** Backend available at `VITE_API_URL`.
- **Main flow:**
  1. The user navigates to `/login`.
  2. Enters username and password in the form.
  3. The frontend calls `POST /api/auth/login` via `authService.login()`.
  4. The received JWT token is stored in the Pinia store and in `localStorage`.
  5. The user is redirected to `/pos`.
- **Alternative flow:** Backend returns 401 → message "Invalid credentials" is displayed.

### UC-FE-02: Manage Products

- **Actor:** Authenticated user
- **Precondition:** Valid JWT token in the store.
- **Main flow:**
  1. The user navigates to `/productos`.
  2. The `useProducts` composable loads the list via `productService.list()`.
  3. The user creates, edits, or deletes products through forms and confirmations.
  4. Each operation calls the corresponding endpoint with the token in the header.
  5. The list updates reactively after each operation.
- **Alternative flow:** Backend error → visible error notification.

### UC-FE-03: Record POS Sale

- **Actor:** Authenticated user
- **Precondition:** Valid JWT token; at least one product in the cart.
- **Main flow:**
  1. The user navigates to `/pos`.
  2. Selects products and quantities; `useCart` calculates totals in real time.
  3. The user confirms the sale.
  4. `saleService.register()` calls `POST /api/ventas` with the cart.
  5. The cart is cleared and a successful sale confirmation is shown.
- **Alternative flow:** Insufficient stock (HTTP 400) → error message with the affected product.

---

## 6. Correctness Properties (Property-Based Testing)

These properties formalize the system invariants and must be verified using property-based tests (PBT) with Vitest + fast-check.

### CP-FE-01: Total Calculation

- **CP-FE-01.1** For any list of items with non-negative subtotals, `calculateTotal(items) === items.reduce((acc, i) => acc + i.subtotal, 0)`.
- **CP-FE-01.2** For any price `p > 0` and quantity `c > 0`, `calculateSubtotal(p, c) === p * c`.
- **CP-FE-01.3** `calculateTotal([]) === 0` (identity element).
- **CP-FE-01.4** `calculateTotal` is monotonically increasing: adding an item with subtotal > 0 always increases the total.

### CP-FE-02: Cart Invariants

- **CP-FE-02.1** After `add(product, quantity)`, the item with that `productId` exists in `items` with `quantity >= quantity`.
- **CP-FE-02.2** After `remove(productId)`, no item in `items` has that `productId`.
- **CP-FE-02.3** `confirm()` with `items.length === 0` always throws an error (never resolves successfully).
- **CP-FE-02.4** After `clear()`, `items.length === 0` and `total === 0`.

### CP-FE-03: Authentication

- **CP-FE-03.1** After `logout()`, `token === null` and `username === null` in the store.
- **CP-FE-03.2** After `setAuth(token, username)`, `authStore.token === token`.
- **CP-FE-03.3** The request interceptor always injects `Authorization: Bearer <token>` when `token !== null`.
