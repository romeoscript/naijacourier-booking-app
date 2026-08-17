# NaijaCourier

Courier booking frontend for deliveries within Nigeria, built with React 19, TypeScript and Vite.

Flow: delivery route & package → sender/receiver details → review & pay → tracking confirmation.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

| Script              | What it does                          |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Vite dev server with HMR              |
| `npm run build`     | Typecheck, then production build       |
| `npm run preview`   | Serve the production build locally    |
| `npm run typecheck` | TypeScript only                       |
| `npm run lint`      | ESLint (type-aware, strict)           |
| `npm test`          | Vitest unit tests for the domain layer |

## Structure

```
src/
  domain/       Pure business logic — pricing, validation, formatting, types
  hooks/        useBookingFlow — the step state machine
  services/     bookingService — the checkout integration seam
  components/   UI, one CSS module per component
  styles/       Design tokens and global base styles
```

`domain/` has no React imports and is unit tested directly. The booking flow is a
discriminated union keyed on `step`, so the payment step cannot be reached without a
validated delivery plan and validated sender/receiver details.

## Pricing

`domain/pricing.ts` is the single source of truth:

```
fee = round₁₀₀((routeFare + packageTypeSurcharge) × weightMultiplier × speedMultiplier)
```

Route fares are stored once per city pair and applied in both directions; pairs with no
listed fare fall back to a flat rate. Replace the tables in that file with your real
tariff — nothing else needs to change.

## Before going live

The Paystack button is a demo: `services/bookingService.ts` confirms the booking
client-side and charges nothing. Replace `submitBooking` with a real call that
initialises the Paystack transaction, verifies it server-side, persists the booking and
returns a backend-issued tracking reference. The UI already handles its pending and
rejected states.

`legacy/` holds the original vanilla HTML/CSS/JS version this was ported from.
