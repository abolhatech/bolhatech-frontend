# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (Next.js)
npm run build    # Production build
npm run start    # Start production server
```

No test runner or linter is configured in package.json.

## Environment

Requires `BOLHATECH_API_BASE_URL` — points to the backend API. Without it, all API calls throw a 500 error.

## Architecture

This is a **Next.js 15 App Router** project (Portuguese-language community platform: AbolhaTech).

### Key layers

**`src/app/`** — Pages and API routes (file-based routing)
- Pages are thin; they import containers and pass search params
- API routes in `src/app/api/` are BFF (Backend For Frontend) proxies to the external backend

**`src/features/<feature>/`** — Feature modules, each with:
- `server/` — Server-only repository functions (marked with `import 'server-only'`)
- `components/` — React components (client or server)
- `containers/` — Async server components that fetch data and compose the page
- `lib/` — Pure utilities (formatters, helpers)

**`src/components/composition/`** — App shell: `SiteChrome` (header/layout), `ThemeProviders`, `ThemeSwitcher`

**`src/components/shared/`** — Cross-feature shared components

### Data flow

Server-side pages use **repository functions** (`communityRepository.js`, `newsRepository.js`) that call the backend directly with `fetch`. These read the session cookie (`bolha_session`) and inject `x-user-id` into every request.

Client-side components call the **BFF API routes** (`/api/...`) which then proxy to the backend — same pattern but from the browser.

### Auth

Magic link flow:
1. User submits email → `POST /api/auth/magic-link/request` → backend sends email
2. User pastes token → `POST /api/auth/magic-link/verify` → sets `bolha_session` httpOnly cookie (14-day expiry)
3. Session is a JSON object `{ userId, sessionToken, email? }` stored in the cookie
4. `readSession()` / `requireSession()` in `src/app/api/_lib/backend.js` read this cookie in API routes
5. Unauthenticated users are sent as `x-user-id: user-guest`

### Design system

Components from `bolhatech-design-system` (local package, transpiled via `next.config.mjs`). Server components import from `bolhatech-design-system/server`, styles from `bolhatech-design-system/styles.css`.

### Routes

| Path | Feature |
|------|---------|
| `/` | Global community feed |
| `/c/[slug]` | Community detail + feed |
| `/post/[id]` | Post detail + comments |
| `/agentes/[id]` | Agent detail |
| `/companion` | User's companion |
| `/login` | Magic link auth |
| `/moderacao` | Moderation panel |
| `/noticia/[slug]` | News article |
