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
- tema temporariamente fixado em light mode

Funcionalidades ainda não implementadas de forma completa:

- autenticação final com magic link
- votos
- comentários reais
- funcional
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

Banco:

```bash
npm run db:migrate
npm run db:seed
```

## Variáveis de ambiente

### Backend-first BFF

- `BOLHATECH_API_BASE_URL`

Quando configurada, a camada `/api` tenta consumir o backend externo primeiro.

### Banco de dados

- `DATABASE_URL`
- `DATABASE_URL_UNPOOLED`
- `PGHOST`
- `PGUSER`
- `PGPASSWORD`
- `POSTGRES_URL`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_DATABASE`
- `POSTGRES_PASSWORD`

Essas são as variáveis geradas automaticamente pela integração Vercel + Neon e são o padrão esperado do projeto.

Fallbacks aceitos por compatibilidade:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `POSTGRES_*`
- `PG*`

O app prioriza `DATABASE_URL` e só cai nesses formatos quando ela não estiver definida.

### Metadata

- `NEXT_PUBLIC_SITE_URL`
- `SITE_URL`

Usadas para canonical URL, Open Graph, `robots.txt` e `sitemap.xml`.

### Email e cron

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `CRON_SECRET`

Usadas para:

- enviar o email de boas-vindas da newsletter via Resend
- proteger o endpoint de cron diário em `/api/cron/newsletter`

### Exemplo

```bash
BOLHATECH_API_BASE_URL=https://api.abolhatech.com
DATABASE_URL=postgresql://usuario:senha@host/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://usuario:senha@host-direto/neondb?sslmode=require
PGHOST=host
PGUSER=usuario
PGPASSWORD=sua-senha
POSTGRES_URL=postgresql://usuario:senha@host/neondb?sslmode=require
POSTGRES_URL_NO_SSL=postgresql://usuario:senha@host/neondb
POSTGRES_DATABASE=neondb
POSTGRES_PASSWORD=sua-senha
NEXT_PUBLIC_SITE_URL=https://abolhatech.com.br
SITE_URL=https://abolhatech.com.br
RESEND_API_KEY=re_xxxxxxxxx
RESEND_FROM_EMAIL="Margaret <newsletter@abolhatech.com.br>"
CRON_SECRET=troque-por-um-segredo-longo
```

## Vercel

O projeto está pronto para deploy na Vercel.

Arquivos relevantes:

- [`vercel.json`](/Users/adriano/Documents/adrianodev/localdev/bolhatech-frontend/bolhatech-frontend/vercel.json)
- [`src/app/api/cron/newsletter/route.js`](/Users/adriano/Documents/adrianodev/localdev/bolhatech-frontend/bolhatech-frontend/src/app/api/cron/newsletter/route.js)

Configuração atual:

- cron diário configurado para `0 12 * * *`
- isso corresponde a `09:00` no fuso `America/Sao_Paulo`
- a Vercel executa cron apenas em produção

Passos sugeridos:

1. Criar/importar o projeto na Vercel.
2. Configurar as env vars automáticas do Neon no projeto e no `.env.local`.
3. Rodar `npm run db:seed` uma vez apontando para o banco Neon.
4. Apontar o domínio `abolhatech.com.br`.
5. Publicar o `bolhatech-design-system@0.3.1` antes do deploy do frontend, se o app em produção ainda estiver resolvendo a versão publicada do pacote.
6. Fazer o primeiro deploy em produção.

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
