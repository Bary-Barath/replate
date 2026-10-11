# RePlate API and Data Access Reference

## Current status

RePlate currently has no custom HTTP API, serverless functions, Supabase/Firebase integration, ORM, or database connection. The browser reads seed data from `src/mockData.ts` and persists demo products, cart items, favorites, and orders in `localStorage` under `replate-demo-state-v2`.

The operations below are internal React context methods, not public network endpoints:

| Operation | Location | Authorization in current demo | Side effect |
|---|---|---|---|
| `addToCart(product, quantity)` | `AppContext` | UI customer flow; backend enforcement unavailable | Updates local cart after eligibility and stock checks |
| `updateProduct(id, updates, sellerId)` | `AppContext` | Checks seller ownership in browser | Updates an owned local listing |
| `placeOrder(customer)` | `AppContext` | Customer route guard; no trusted server | Revalidates cart eligibility, creates local order, decrements local stock |
| `toggleFavorite(productId)` | `AppContext` | Customer UI flow | Updates local favorites |

## Planned production API

The following are recommendations only and are not implemented:

- `GET /api/products?category=&search=&minDiscount=` — eligible product search.
- `GET /api/products/:id` — product details.
- `POST /api/seller/listings` — verified seller listing creation.
- `PATCH /api/seller/listings/:id` — owner-only listing update.
- `POST /api/orders` — transactional stock revalidation and order creation.
- `GET /api/customer/orders` — authenticated customer order history.
- `GET /api/seller/analytics` — authenticated seller analytics.

These should be added only with server-side authorization, validation, rate limiting, and transactional stock updates.
