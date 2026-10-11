# RePlate Architecture

```text
React entrypoint
  ├─ AuthProvider          demo identity and role state
  ├─ AppProvider           local products/cart/favorites/orders
  ├─ AppErrorBoundary      render-failure recovery
  └─ React Router
       ├─ Public marketplace and information pages
       ├─ Customer route group + CustomerLayout
       ├─ Verified seller route group
       └─ Admin demo route group

Pure business logic
  ├─ discountEngine        date-based discount recommendation
  ├─ eligibility            human-food purchase gate
  ├─ rescueEngine          urgency and seller-floor recommendation
  ├─ marketplaceEngine     search/filter/sort rules
  ├─ impactEngine          personal impact aggregation
  └─ cartEngine             quantity and subtotal calculations
```

All current data operations run in the browser. There is no trusted backend boundary. Route guards improve the demo experience but are not a substitute for server authorization. `AppErrorBoundary` handles unexpected render failures; request, form, and event errors require normal local validation and should be handled by future service modules.
