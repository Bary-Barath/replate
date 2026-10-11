# RePlate Database Reference

## Current status

There is no database schema, migration, ORM model, SQL policy, or persistent backend in this repository. The current application is a browser-local demo.

## Current local data model

The persisted object contains:

```text
products: Product[]
cart: CartItem[]
favorites: string[]
orders: Order[]
```

`Product` contains pricing, eligibility, stock, seller, pathway, pickup, and food-information fields. `CartItem` references a product snapshot and quantity. `Order` contains customer information, item snapshots, subtotal, platform fee, total, timestamp, and status.

This is not a relational schema and has no foreign-key enforcement, row-level security, uniqueness constraints, or transaction guarantees. LocalStorage can be edited by the user and must not be trusted for production authorization, inventory, payment, or food-safety decisions.

## Production migration requirements

A real backend should define seller, customer, product, order, order-item, favorite, verification, and impact records with server-side ownership rules. Order creation must lock or atomically update stock. Any row-level security policies must be documented after they exist; none are claimed here.
