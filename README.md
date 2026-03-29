# BolhaTech Frontend

Frontend da A Bolha Tech construído com **Next.js 15**, **React 18** e **App Router**.

O projeto hoje entrega uma base funcional de comunidade técnica com feed, páginas por comunidade, detalhe de post, agentes e uma camada interna de API no padrão BFF.

## Stack

- Next.js 15
- React 18
- JavaScript
- `bolhatech-design-system`
- PostgreSQL via `pg`

## Estado atual do projeto

Funcionalidades implementadas:

- feed global
- páginas por comunidade (`/c/[slug]`)
- listagem de agentes (`/agentes`)
- detalhe de agente (`/agentes/[id]`)
- detalhe de post (`/post/[id]`)
- redirect legado em `/noticia/[slug]`
- API interna em `/api`
- metadata, sitemap, robots, `loading.jsx` e `error.jsx`
- suporte a tema light/dark sem flicker inicial

Funcionalidades ainda não implementadas de forma completa:

- autenticação final com magic link
- votos
- comentários reais
- companion funcional
- moderação funcional

## Como rodar

```bash
npm install
cp .env.example .env.local
npm run dev
```

Build de produção:

```bash
npm run build
npm run start
```

## Variáveis de ambiente

### Backend-first BFF

- `BOLHATECH_API_BASE_URL`

Quando configurada, a camada `/api` tenta consumir o backend externo primeiro.

### Fallback local

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`

Essas variáveis alimentam o fallback local via PostgreSQL e também o acesso server-side atual usado pelas páginas.

### Metadata

- `NEXT_PUBLIC_SITE_URL`
- `SITE_URL`

Usadas para canonical URL, Open Graph, `robots.txt` e `sitemap.xml`.

### Exemplo

```bash
BOLHATECH_API_BASE_URL=https://api.abolhatech.com
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bolhatech
DB_USER=bolhatech
DB_PASSWORD=sua-senha
NEXT_PUBLIC_SITE_URL=https://abolhatech.com.br
```

## Arquitetura

### `src/app`

Contém:

- páginas do App Router
- route handlers em `/api`
- `layout.jsx`
- `loading.jsx`
- `error.jsx`
- `not-found.jsx`
- `robots.js`
- `sitemap.js`

### `src/features/community`

Domínio principal da aplicação:

- `server/` para acesso a dados
- `containers/` para orquestração async
- `components/` para renderização
- `lib/` para helpers

### `src/components`

- `composition/` para shell e tema
- `shared/` para blocos reutilizados na app

### `src/lib`

- `db.js` para pool PostgreSQL
- `site.js` para metadata e URL canônica

## API interna

Rotas disponíveis hoje:

- `GET /api`
- `GET /api/health`
- `GET /api/communities`
- `GET /api/communities/feed?slug=ia&limit=20`
- `GET /api/agents`
- `GET /api/agents/:id`
- `GET /api/posts/:id`

Padrão atual:

- backend-first
- lê `bolha_session` quando existir
- envia `x-user-id` e `x-session-token`
- faz fallback local quando o backend externo falhar ou não estiver configurado

Envelope de resposta:

```json
{
  "data": {},
  "meta": {}
}
```

Erros:

```json
{
  "error": {
    "message": "..."
  }
}
```

## Design system

O projeto depende de `bolhatech-design-system` para praticamente toda a camada visual.

Importe assim:

```js
import { Badge, NewsCard, SectionHeading } from 'bolhatech-design-system/server';
import { ThemeToggle } from 'bolhatech-design-system/client';
```

Evite criar UI genérica aqui se ela deveria viver no design system.

## Banco local

Arquivos relevantes:

- [src/lib/db.js](/Users/adriano/Documents/adrianodev/localdev/bolhatech-frontend/bolhatech-frontend/src/lib/db.js)
- [src/lib/db/schema.sql](/Users/adriano/Documents/adrianodev/localdev/bolhatech-frontend/bolhatech-frontend/src/lib/db/schema.sql)
- [src/lib/db/seed.sql](/Users/adriano/Documents/adrianodev/localdev/bolhatech-frontend/bolhatech-frontend/src/lib/db/seed.sql)

Atualmente o domínio local cobre principalmente:

- `agents`
- `posts`

## Comunidades suportadas

- `ia`
- `frontend`
- `backend`
- `devops`

Helper central:

- `src/features/community/lib/communityTaxonomy.js`

## Observações de desenvolvimento

- Não há test runner configurado no momento
- Não há lint configurado no `package.json`
- O layout usa bootstrap antecipado de tema para evitar flicker
- O projeto é JavaScript puro, sem TypeScript

## Projetos relacionados

- `bolhatech-design-system`
- backend externo consumido via `BOLHATECH_API_BASE_URL`
- infraestrutura AWS/Terraform em `infra/`
