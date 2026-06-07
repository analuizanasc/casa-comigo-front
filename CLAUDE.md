# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # dev server on port 4000
npm run build     # tsc -b && vite build
npm run lint      # eslint .
npm run preview   # preview production build
```

No test framework is installed.

## Architecture

### API layer (`src/api/`)
- `client.ts` — Axios instance with `baseURL: '/api'`. Automatically injects `Authorization: Bearer <token>` from `localStorage`. Unwraps API error messages from `error.response.data.error` before rejecting.
- One file per domain: `auth`, `catalog`, `houses`, `members`, `preferences`, `reports`, `schedule`. All call `apiClient` directly and return typed Axios responses.
- The Vite dev server proxies `/api` → `http://localhost:3000`.

### Contexts
- `AuthContext` — holds `user` + `token` (persisted to `localStorage`). Provides `login()`, `logout()`, `isAuthenticated`.
- `HouseContext` — holds the currently selected `HouseSummary`. Set when a user navigates into a house.
- `ToastProvider` (in `components/UI/Toast.tsx`) — provides `useToast()` hook that accepts `(message, type?)` with 4-second auto-dismiss.

### Routing (`App.tsx`)
Public routes (`/login`, `/register`) sit outside `AppLayout`. All `/houses/*` routes are nested inside `AppLayout`, which redirects to `/login` if `!isAuthenticated`. The catch-all `*` also redirects to `/login`.

### Types (`src/types/index.ts`)
Single source of truth for all domain interfaces: `User`, `House`, `HouseSummary`, `Member`, `Task`, `TaskDetail`, `Assignment`, `Preference`, `DistributionResult`, `PerformanceReport`, `BalanceReport`, and the union types `Role`, `Frequency`, `EffortLevel`, `AssignmentStatus`, `PreferenceLevel`.

### Pages
- `pages/` — `Login`, `Register`, `Houses` (house picker)
- `pages/house/` — `Members`, `Catalog`, `Preferences`, `Schedule`, `Reports` (all scoped to a `houseId` URL param)

### Design system
All styling is plain CSS in `src/index.css` using CSS custom properties — no CSS modules, no Tailwind. CSS variables are declared in `:root`.

**Palette tokens:**
- `--terracotta: #C05A38` — primary brand / CTA
- `--canvas: #F5F0EA` — page background
- `--surface: #FDFAF5` — sidebar
- `--surface-raised: #FFFFFF` — cards, modals
- `--sage: #5A7D63` — secondary accent
- `--ink / --ink-2 / --ink-3 / --ink-muted` — text hierarchy

**Spacing** is `--sp-{n}` where n maps to `n×4px` (e.g. `--sp-4 = 16px`).

**Component classes follow a BEM-like pattern:**
- Buttons: `.btn .btn--{primary|secondary|ghost|danger} .btn--{sm|md|lg}`
- Badges: `.badge .badge--{success|danger|warning|info|sage|terracotta|default}`
- Fields: `.field > .field__label + .field__input`
- Cards: `.task-card`, `.member-card`, `.house-card`, `.assignment-card`
- Assignment cards have a 3px left border colored by status (`--success`, `--danger`, `--warning`, `--border-mid`)
- Modals: `.modal-backdrop > .modal > .modal__header / .modal__body / .modal__footer`
