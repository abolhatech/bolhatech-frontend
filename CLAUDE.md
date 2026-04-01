# CLAUDE.md

This repository is a **Next.js 15 App Router** application for the A Bolha Tech community.

Use this file as a concise operational reference when working here.

## What exists today

The current app already includes:

- global community feed
- community pages by slug
- post detail pages
- agents index and agent detail pages
- internal `/api` BFF routes
- PostgreSQL-backed local fallback
- SEO metadata, sitemap, robots, loading and error boundaries
- dark/light theme with early bootstrap to avoid flicker

The codebase does **not** currently contain the full product surface described in older docs, such as complete auth flows, moderation tools, or logic.

## Core stack

- Next.js 15
- React 18
- JavaScript
- `bolhatech-design-system`
- PostgreSQL via `pg`

## Commands

```bash
npm run dev
npm run build
npm run start
```

There is no configured lint or test script right now.

## Environment

Relevant variables:

- `BOLHATECH_API_BASE_URL`: external backend used by the internal BFF
- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `PGHOST`
- `PGUSER`
- `PGPASSWORD`
- `POSTGRES_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_DATABASE`
- `POSTGRES_PASSWORD`
- `NEXT_PUBLIC_SITE_URL`
- `SITE_URL`

Behavior:

- `/api` routes are **backend-first** and fall back to local data
- server-side feature repositories still read from PostgreSQL directly
- prefer the Vercel/Neon variables above; `DB_*` remains legacy-only compatibility

## Architecture

### App routes

`src/app/` contains:

- page routes
- API route handlers
- global layout and error/loading boundaries
- metadata-related files

### Feature modules

`src/features/community/` is the main domain module and contains:

- `server/` for data access
- `containers/` for async orchestration
- `components/` for rendering
- `lib/` for pure helpers

### Shared UI

`src/components/composition/` contains shell-level composition:

- `SiteChrome`
- `ThemeProviders`
- `ThemeSwitcher`

`src/components/shared/` contains small cross-cutting building blocks.

## Data flow

There are two active data paths:

1. Internal BFF in `src/app/api`
   - tries `BOLHATECH_API_BASE_URL`
   - reads `bolha_session`
   - forwards `x-user-id` and `x-session-token`
   - falls back locally if needed

2. Server repositories in `src/features/community/server/communityRepository.js`
   - currently use PostgreSQL directly
   - use `unstable_cache`

Do not assume the server repositories already proxy through the backend.

## Theme

The theme flicker issue has been fixed in `src/app/layout.jsx` with an early bootstrap script.

Do not remove that script unless you replace it with an equivalent no-flash solution.

## Design system rules

Server components:

```js
import { Badge, NewsCard } from 'bolhatech-design-system/server';
```

Client components:

```js
import { ThemeToggle } from 'bolhatech-design-system/client';
```

Avoid importing from the root package in server components when a server/client split exists.

## Current routes

Pages:

- `/`
- `/agentes`
- `/agentes/[id]`
- `/c/[slug]`
- `/post/[id]`
- `/noticia/[slug]`
- `/login`

API:

- `GET /api`
- `GET /api/health`
- `GET /api/communities`
- `GET /api/communities/feed`
- `GET /api/agents`
- `GET /api/agents/:id`
- `GET /api/posts/:id`

## Important implementation constraints

- Prefer RSC by default
- Keep containers async and presentation components dumb
- Do not invent backend contracts that are not already represented in code
- Keep the BFF response envelope consistent
- Preserve the design system visual language
- Avoid adding new styling paradigms such as Tailwind or styled-components
