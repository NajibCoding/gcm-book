# GCM Book — Copilot Instructions

## Project Overview

GCM Book is a **Laravel 13 + Inertia.js v2 + React 18 + TypeScript + Tailwind CSS v3** service-booking and invoicing platform. It manages three services (Detailing Motor, Jasa Pindahan, Cuci Motor) with queue management, QRIS payment (Pakasir API), and PDF invoicing.

## Architecture

Strict **Clean Architecture** is enforced. Never mix layers:

```
app/
├── Domain/          # Entities (pure PHP, no Eloquent), Interfaces, DTOs
├── Application/     # Use Cases (orchestration, no HTTP concerns)
├── Infrastructure/  # Eloquent Repositories, External Services, Mail, Providers
└── Http/            # Controllers, Requests, Middleware (framework layer only)
```

## PHP Standards

- **PHP 8.4, strict types always**: Every `.php` file must start with `<?php declare(strict_types=1);`
- **Readonly properties** for DTOs and domain entities
- **Constructor promotion** preferred for DTOs
- **No business logic in Controllers** — inject and call Use Cases only
- **Dependency injection** for all services/repositories via constructor
- Repository interfaces live in `Domain/`, implementations in `Infrastructure/Repositories/`
- Always register new repository bindings in `app/Infrastructure/Providers/RepositoryServiceProvider.php`

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Use Cases | `VerbNounUseCase` | `CreateBookingUseCase` |
| Repository Interface | `NounRepositoryInterface` | `BookingRepositoryInterface` |
| Eloquent Repository | `EloquentNounRepository` | `EloquentBookingRepository` |
| DTO | `VerbNounDTO` | `CreateBookingDTO` |
| Mail | `NounMail` | `BookingReceiptMail` |
| Controller | `{Scope}/{Noun}Controller` | `Admin/BookingController` |

## Database & Models

- Migrations use `declare(strict_types=1)` and live in `database/migrations/`
- Models extend `Illuminate\Database\Eloquent\Model` with `$fillable`, `$casts`, and relationships
- Use `HasRoles` (Spatie) on `User` model — never use `$roles` array manually
- Booking code format: `BCK-YYYYMMDD-XXXXX` (5 random uppercase chars)
- Invoice number format: `INV-YYYYMMDD-XXXXX`
- Queue numbers are generated atomically with `DB::transaction` + `lockForUpdate()`

## React/TypeScript Standards

- All TypeScript types extend from `resources/js/types/index.d.ts`
- Use `import { cn } from '@/lib/utils'` for conditional classnames (never `clsx` directly)
- Use Shadcn/ui components from `@/Components/ui/` — **never recreate native HTML buttons/inputs when Shadcn exists**
- Layouts: `GuestLayout` (public pages), `AuthenticatedLayout` (customer), `AdminLayout` (admin)
- Admin pages always use `AdminLayout` — never `AuthenticatedLayout`
- Use `route()` helper for all Inertia/Link hrefs
- Form state management: `useForm` from `@inertiajs/react` for server-bound forms; `useState` for local-only UI state
- API calls (e.g., promo check) use native `fetch` with CSRF token from `<meta name="csrf-token">`
- QRIS QR code rendering: use `import('qrcode')` dynamic import to render from `qr_string`

## Services Configuration

- Pakasir API: `config('services.pakasir.project_slug')` and `config('services.pakasir.api_key')`
- Required env vars: `PAKASIR_PROJECT_SLUG`, `PAKASIR_API_KEY`
- HTTP retries: `Http::retry(3, 200)` on all Pakasir calls
- PDF generation: `barryvdh/laravel-dompdf`, view: `pdf.invoice`
- Email templates: `emails.booking-receipt`, `emails.invoice`

## Roles & Permissions

Four RBAC roles (Spatie `laravel-permission`):
- `super-admin`: all permissions
- `admin`: manage bookings, invoices, services, promos, queue
- `staff`: manage bookings, queue
- `customer`: create and view own bookings

Middleware: `role:{role1,role2}` alias registered in `bootstrap/app.php`

## Route Structure

```
GET  /                  → Welcome (public)
GET  /services          → ServiceController (public)
GET  /booking           → BookingController@create (public)
POST /booking           → BookingController@store
GET  /booking/{code}    → BookingController@show

# Customer (auth)
GET  /dashboard         → Customer\DashboardController
GET  /bookings          → Customer\BookingHistoryController

# Admin (auth + role:admin,super-admin)
GET  /admin/dashboard   → Admin\DashboardController
CRUD /admin/bookings    → Admin\BookingController
CRUD /admin/invoices    → Admin\InvoiceController (+download, +send)
CRUD /admin/services    → Admin\ServiceController
CRUD /admin/promos      → Admin\PromoController
GET  /admin/queue       → Admin\QueueController

# API (no CSRF for webhook)
POST /api/webhook/pakasir
POST /api/payment
GET  /api/payment/{id}
DELETE /api/payment/{id}
GET  /api/promo/check?code=
```

## Security

- `SecurityHeadersMiddleware` adds CSP, X-Frame-Options, etc.
- `AuditLogMiddleware` logs all non-GET admin requests
- Webhook endpoint is excluded from CSRF (api middleware group)
- Webhook validates `X-Pakasir-Signature` HMAC in `WebhookRequest`
- Never log payment credentials or full card/QR data

## Testing

```bash
php artisan test           # PHPUnit
npm run build              # TypeScript + Vite production build
npm run dev                # Vite dev server
php artisan migrate:fresh --seed   # Seed database
```

Default admin credentials (seeded): `admin@gcmbook.com` / `Admin@1234`

## Do Not

- Do not put Eloquent queries directly in controllers
- Do not skip `declare(strict_types=1)` on any PHP file
- Do not use `app()->make()` outside of service providers
- Do not create new Shadcn components if one already exists in `resources/js/Components/ui/`
- Do not hardcode the Pakasir API key anywhere — always use `config('services.pakasir.*')`
- Do not use `dd()` or `var_dump()` in production code
- Do not commit `.env` file
