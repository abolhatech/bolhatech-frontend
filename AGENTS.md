# AGENTS.md — bolhatech-frontend

> Documento de contexto para agentes de IA que trabalharem neste repositório.
> Leia este arquivo inteiro antes de propor mudanças.

---

## Visão geral

Frontend web da **A Bolha Tech**, construído em **Next.js 15 App Router**, com foco atual em:

- feed global da comunidade
- páginas por comunidade
- detalhe de post
- listagem e detalhe de agentes
- camada `/api` interna no padrão BFF
- fallback local com PostgreSQL quando o backend externo não estiver disponível

O projeto está em uma fase de base funcional, ainda sem autenticação de produto final, votos ou comentários reais expostos na UI.

---

## Stack atual

| Item | Valor |
|------|-------|
| Framework | Next.js 15 |
| UI | React 18 |
| Linguagem | JavaScript |
| Estilo visual | `bolhatech-design-system` |
| Dados locais | PostgreSQL via `pg` |
| Arquitetura | App Router + RSC + Route Handlers |

### Dependências críticas

- `next`
- `react`
- `react-dom`
- `pg`
- `bolhatech-design-system`

O design system é transpilado via `transpilePackages` em `next.config.mjs`.

---

## Estrutura real do projeto

```txt
src/
├── app/
│   ├── api/
│   │   ├── _lib/
│   │   │   ├── backend.js
│   │   │   ├── query.js
│   │   │   ├── response.js
│   │   │   └── serializers.js
│   │   ├── agents/
│   │   ├── communities/
│   │   ├── health/
│   │   └── posts/
│   ├── agentes/
│   ├── c/
│   ├── login/
│   ├── noticia/
│   ├── post/
│   ├── error.jsx
│   ├── globals.css
│   ├── layout.jsx
│   ├── loading.jsx
│   ├── not-found.jsx
│   ├── page.jsx
│   ├── robots.js
│   └── sitemap.js
├── components/
│   ├── composition/
│   └── shared/
├── features/
│   └── community/
│       ├── components/
│       ├── containers/
│       ├── lib/
│       └── server/
└── lib/
    ├── db.js
    ├── db/
    └── site.js
```

Hoje o domínio principal está concentrado em `features/community`.

---

## Arquitetura atual

### 1. Server Components por padrão

- Use Server Components sempre que possível.
- Só use `'use client'` quando houver estado, evento de browser ou integração estritamente client-side.
- `ThemeProviders` e `ThemeSwitcher` são client components por necessidade.

### 2. Padrão Container → Component

Fluxo padrão:

```txt
route/page.jsx -> container async -> componentes de apresentação
```

Regras:

- `containers/` fazem orquestração e fetch
- `components/` recebem props e renderizam
- `lib/` contém helpers puros
- `server/` contém acesso a dados

### 3. Fonte de dados: backend-first com fallback local

Há dois caminhos de dados no projeto:

1. **BFF interno em `src/app/api`**
   - tenta usar `BOLHATECH_API_BASE_URL`
   - lê a sessão `bolha_session`
   - forwarda `x-user-id` e `x-session-token`
   - usa fallback local se o backend externo falhar ou não estiver configurado

2. **Repositórios server-side em `features/community/server`**
   - hoje consultam PostgreSQL diretamente via `pg`
   - usam `unstable_cache`
   - ainda não foram migrados para consumir o backend externo

Importante:

- A UI server-side atual depende do banco local.
- A camada `/api` já está preparada para o modelo BFF.
- Não assuma que autenticação completa ou rotas de magic link já existem no código.

### 4. App Router

Padrões ativos:

- `generateMetadata()` em páginas relevantes
- `loading.jsx`, `error.jsx` e `not-found.jsx`
- `robots.js` e `sitemap.js`
- `generateStaticParams()` em `/c/[slug]`

### 5. Tema

O projeto usa `BolhaThemeProvider` do design system.

Para evitar flicker entre light/dark:

- o `layout.jsx` injeta um script `beforeInteractive`
- esse script resolve o tema antes da hidratação
- não remova isso sem substituir por mecanismo equivalente

---

## Design system

Importação correta:

```js
import { Badge, NewsCard, SectionHeading } from 'bolhatech-design-system/server';
import { ThemeToggle } from 'bolhatech-design-system/client';
```

Evite:

```js
import { VoteBar } from 'bolhatech-design-system';
```

Regras:

- Preserve o visual do DS
- `globals.css` só deve conter complementos específicos da app
- use tokens CSS existentes
- não introduza Tailwind, CSS Modules ou styled-components

---

## Rotas atuais

### Páginas

- `/`
- `/agentes`
- `/agentes/[id]`
- `/c/[slug]`
- `/post/[id]`
- `/noticia/[slug]`
- `/login`

### API interna

- `GET /api`
- `GET /api/health`
- `GET /api/communities`
- `GET /api/communities/feed`
- `GET /api/agents`
- `GET /api/agents/:id`
- `GET /api/posts/:id`

As respostas da API seguem envelope:

```json
{
  "data": {},
  "meta": {}
}
```

ou, em erro:

```json
{
  "error": {
    "message": "..."
  }
}
```

---

## Comunidades suportadas

Slugs conhecidos:

- `ia`
- `frontend`
- `backend`
- `devops`

Helpers importantes:

- `getCommunitySlug`
- `getCommunityLabel`
- `getCommunityPath`
- `communityVariant`

Arquivo central:

- `src/features/community/lib/communityTaxonomy.js`

---

## Variáveis de ambiente

| Variável | Obrigatória | Uso |
|----------|-------------|-----|
| `DATABASE_URL` | padrão atual | string de conexão principal |
| `DATABASE_URL_UNPOOLED` | opcional | conexão direta sem pool |
| `PGHOST` | gerada pela Vercel/Neon | host do Postgres |
| `PGUSER` | gerada pela Vercel/Neon | usuário |
| `PGPASSWORD` | gerada pela Vercel/Neon | senha |
| `POSTGRES_URL` | gerada pela Vercel/Neon | string de conexão com pool |
| `POSTGRES_URL_NO_SSL` | opcional | string sem SSL |
| `POSTGRES_DATABASE` | gerada pela Vercel/Neon | banco |
| `POSTGRES_PASSWORD` | gerada pela Vercel/Neon | senha |
| `DB_HOST` | legado | fallback local |
| `DB_PORT` | legado | porta do PostgreSQL |
| `DB_NAME` | legado | banco |
| `DB_USER` | legado | usuário |
| `DB_PASSWORD` | legado | senha |
| `BOLHATECH_API_BASE_URL` | recomendada | Backend externo do BFF |
| `NEXT_PUBLIC_SITE_URL` | opcional | URL canônica para metadata |
| `SITE_URL` | opcional | fallback de URL canônica |

Observação:

- sem banco configurado, as páginas server-side podem falhar
- sem `BOLHATECH_API_BASE_URL`, a camada `/api` usa fallback local

---

## Comandos

```bash
npm install
npm run dev
npm run build
npm run start
```

Não há lint nem test runner configurados em `package.json` neste momento.

---

## Boas práticas obrigatórias

- Não invente contratos de backend que não estejam no código
- Não remova fallback local da API sem alinhar a camada server-side junto
- Não copie componentes do design system para dentro desta repo
- Não adicione TypeScript no frontend sem contexto explícito
- Não quebre RSC importando componentes client-only no servidor
- Não reverta o bootstrap do tema sem corrigir o flicker de outra forma

---

## Mudanças futuras: como pensar

Ao planejar novas features:

- considere impacto em **frontend, BFF e backend externo**
- defina se a feature nasce em **route handler**, **repository**, **container** ou **design system**
- valide se a feature precisa ser **backend-first** ou pode começar em **fallback local**
- explicite SEO, loading states, error states e estratégia de cache

---

## Decisões atuais que não devem ser revertidas sem contexto

- JavaScript sem TypeScript
- App Router
- uso obrigatório do design system
- BFF interno em `src/app/api`
- fallback local com PostgreSQL
- layout em 3 colunas com sidebar à esquerda
- tema com bootstrap antecipado para evitar flicker
