# RePlate

RePlate is a React marketplace demo that helps local food businesses recover value from eligible surplus food before its applicable sale or pickup deadline.

## Problem and solution

Food that is still suitable for human consumption can lose commercial value before it becomes unsafe. RePlate gives businesses a marketplace for discounted rescue listings and gives customers a transparent way to discover, purchase, collect, and measure their impact. Inventory routed to Feed Rescue is kept out of the human-food marketplace.

## Current implementation status

Implemented in the current demo:

- Marketplace search, category/discount filters, sorting, and empty states.
- Product detail pages, wishlist, cart, checkout, order confirmation, and stock reduction.
- Date-based discount recommendations and eligibility protection.
- Live Rescue Clock and seller Smart Rescue Engine.
- Customer dashboard, order history, profile, and impact dashboard.
- Seller publishing, pause/resume, sold-out controls, orders, verification state, and Feed Rescue workflow.
- Admin demonstration console and role-based route guards.
- Persistent browser demo state and resilient product-image loading.

Important limitation: authentication, authorization, inventory, orders, and data persistence are frontend demo implementations. No production backend, payment gateway, API, or database is connected.

## Technology stack

- React 19, TypeScript, Vite
- React Router
- Tailwind CSS
- Lucide React, date-fns, Recharts
- Vitest and Oxlint

## Project structure

```text
src/components  shared layouts, navigation, cards, guards, error boundary
src/context     demo auth and application state providers
src/pages       public, customer, seller, admin, and information screens
src/utils       pure pricing, eligibility, cart, marketplace, rescue, impact logic
src/types       shared TypeScript models
src/mockData.ts seeded demonstration listings
docs/           API, database, and architecture limitations/reference
```

## Prerequisites and setup

Use Node.js compatible with the installed Vite and TypeScript versions.

```bash
npm install
npm run dev
```

The development server is normally available at `http://localhost:5173`.

## Available scripts

```bash
npm run dev        # Start Vite development server
npm run typecheck  # Run TypeScript project checks
npm run lint       # Run Oxlint
npm test           # Run Vitest once
npm run build      # Type-check and create production build
npm run preview    # Preview the production build
```

Coverage is not currently configured because the repository does not include a Vitest coverage provider. Do not claim a coverage percentage until a provider such as `@vitest/coverage-v8` is intentionally added and executed.

## Authentication and roles

`AuthContext` provides clearly labelled demo identities for customer, seller, pending seller, and admin roles. `RequireAuth` and `RequireVerifiedSeller` protect route groups in the browser. Seller ownership is checked in `AppContext.updateProduct` for the demo flow.

These checks are not production security. A production implementation must move identity, authorization, seller ownership, and session validation to a trusted backend.

## Business rules

- `discountEngine.ts` rejects non-positive prices and invalid/expired applicable dates.
- `eligibility.ts` prevents paused, sold-out, expired, ineligible, and Feed Rescue products from human-food purchasing.
- `rescueEngine.ts` scores urgency and never recommends below the seller minimum price.
- `cartEngine.ts` clamps requested quantities and calculates rescue-price subtotals.
- `marketplaceEngine.ts` centralizes search, category, discount, eligibility, and sorting rules.
- `impactEngine.ts` aggregates confirmed/ready/collected orders and labels quantity-to-weight conversion as estimated.

## Error handling

`AppErrorBoundary` provides an application-level render fallback with retry and marketplace recovery links. It logs only a generic development diagnostic and does not expose stack traces or sensitive data. Error boundaries do not catch rejected promises, event-handler errors, or backend failures; those require explicit service/request handling when a backend is added.

## Testing strategy

Tests focus on pure business logic:

- Discount boundaries and invalid inputs.
- Cart clamping and totals.
- Eligibility and Feed Rescue exclusion.
- Rescue Engine scoring and seller price floors.
- Marketplace search, combined filters, sorting, and empty results.
- Role routing.
- Personal impact aggregation.
- Error-boundary fallback state.

Run:

```bash
npm test -- --run
npm run typecheck
npm run lint
npm run build
```

## API and database documentation

- [API reference](docs/API.md): actual internal context operations and clearly labelled planned endpoints.
- [Database reference](docs/DATABASE.md): verified absence of a backend schema and current LocalStorage model.
- [Architecture reference](docs/ARCHITECTURE.md): frontend structure and trusted-boundary limitations.

## Security considerations

Do not use the demo authentication or LocalStorage state for real users, payments, food-safety decisions, or inventory authority. Do not place credentials in the repository. Production work requires secure sessions, password hashing or an identity provider, server-side authorization, validation, database transactions, audit logs, and payment-provider integration.

## Known limitations and planned improvements

- No real backend API or database.
- No real payment processing.
- No server-side seller verification.
- No transactional stock reservation.
- Nearby distances are demonstration data and map services are not connected.
- Impact weight values are estimated when product weight is unavailable.
- Production monitoring is not configured; the error boundary is ready for an approved logging adapter.

## Development workflow

1. Inspect existing state and tests before changing behavior.
2. Keep business rules in typed, testable utility modules.
3. Add or update tests for important edge cases.
4. Run typecheck, lint, tests, and build.
5. Review `git diff` and keep demo limitations explicit.
