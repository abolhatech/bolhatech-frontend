# AGENTS.md — bolhatech-frontend

> Documento de contexto para agentes de IA (Claude, Codex, Cursor, etc.) que trabalharem neste repositório.
> Leia este arquivo inteiro antes de qualquer implementação.

---

## O que é este projeto

Frontend web da plataforma **A Bolha Tech** — comunidade curada de IA e Programação com agentes especialistas, companions pessoais e votação estilo Hacker News / Reddit.

**Repositório:** `github.com/abolhatech/bolhatech-frontend`
**Stack:** Next.js 15 · React 18 · App Router · React Server Components · JavaScript (sem TypeScript no frontend)

---

## Stack e dependências críticas

| Pacote | Versão | Uso |
|--------|--------|-----|
| `next` | ^15 | Framework principal |
| `react` | ^18 | UI |
| `bolhatech-design-system` | ^0.2.x | **Todos** os componentes visuais e tokens |

O design system é transpilado pelo Next.js via `transpilePackages` em `next.config.mjs`.

---

## Estrutura de diretórios

```
src/
├── app/                      # Next.js App Router
│   ├── api/                  # BFF — rotas de API (proxy para o backend)
│   │   ├── _lib/backend.js   # Client HTTP compartilhado para o backend
│   │   ├── auth/             # Magic link + session + logout
│   │   ├── communities/      # Feed global e por comunidade
│   │   ├── posts/            # Detalhes, votos, comentários
│   │   ├── agents/           # Agentes e propostas de config
│   │   └── companions/       # Companion e recomendações
│   ├── page.jsx              # Home (CommunityHomeContainer)
│   ├── c/[slug]/             # Página de comunidade
│   ├── post/[id]/            # Detalhe de post
│   ├── agentes/[id]/         # Detalhe de agente
│   ├── companion/            # Companion do usuário
│   ├── login/                # Autenticação magic link
│   ├── moderacao/            # Painel de moderação
│   └── globals.css           # Estilos globais da APP (mínimos)
│
├── components/
│   ├── composition/          # Componentes estruturais (SiteChrome, ThemeProviders)
│   └── shared/               # Componentes compartilhados simples
│
└── features/
    ├── auth/                 # Formulários de login/sessão
    ├── community/            # Feed, posts, comentários, agentes, companion
    │   ├── server/           # Data fetching (communityRepository.js)
    │   ├── components/       # Componentes de apresentação
    │   ├── containers/       # Orquestradores (server components que buscam dados)
    │   └── lib/              # Utilitários (formatação de data, etc.)
    └── news/                 # Seção de notícias (dados estáticos)
```

---

## Arquitetura e padrões obrigatórios

### 1. Server Components por padrão

Todo componente é Server Component (RSC) **a menos que precise de estado ou eventos do browser**.
Só adicione `'use client'` quando for estritamente necessário.

**Regra de ouro:**
- `containers/` → sempre Server Components (buscam dados, sem estado)
- `components/` → maioria Server Components; apenas interativos usam `'use client'`

### 2. Padrão Container / Component

```
Container (server, busca dados) → Component (renderiza dados)
```

- **Containers** moram em `features/*/containers/`. São `async` e chamam o repository diretamente.
- **Components** moram em `features/*/components/`. Recebem props, não fazem fetch.
- **Nunca misture**: um container não deve ter lógica visual complexa; um component não deve fazer fetch.

### 3. Design System — importação correta

```js
// ✅ Componentes server-safe (RSC, SSR)
import { NewsCard, Badge, Button, Surface } from 'bolhatech-design-system/server';

// ✅ Componentes com interatividade (use client)
import { VoteBar, ThemeToggle } from 'bolhatech-design-system/client';

// ❌ NUNCA importe do index raiz em Server Components
import { VoteBar } from 'bolhatech-design-system'; // pode quebrar RSC
```

### 4. Estilos — somente tokens do DS

- **Nunca** crie classes CSS novas para componentes que o DS já resolve.
- `globals.css` é para estilos específicos da APP que não fazem sentido no DS (layout de página, `.news-link`, `.back-link`, `.article-content`).
- Use variáveis CSS do DS: `var(--bolha-text)`, `var(--bolha-surface)`, `var(--bolha-accent)`, etc.
- Inline styles são aceitáveis para casos pontuais usando tokens do DS.

**Tokens disponíveis:**
```css
--bolha-bg, --bolha-surface, --bolha-surface-hover
--bolha-line, --bolha-line-subtle
--bolha-text, --bolha-muted, --bolha-subtle
--bolha-accent, --bolha-accent-bg, --bolha-accent-text
--bolha-up, --bolha-up-bg, --bolha-down, --bolha-down-bg
--bolha-community-ia, --bolha-community-frontend, --bolha-community-backend, --bolha-community-devops
--bolha-radius-sm (4px), --bolha-radius-md (8px), --bolha-radius-lg (12px)
--bolha-font (Inter)
```

### 5. API layer (BFF)

O frontend **nunca** chama o backend diretamente do browser. O fluxo é:

```
Browser → Next.js API Route (/api/...) → BOLHATECH_API_BASE_URL (backend AWS)
```

- `src/app/api/_lib/backend.js` centraliza a autenticação e o fetch.
- Toda nova rota de API segue o mesmo padrão: lê sessão do cookie `bolha_session`, forwarda para o backend.
- Variável de ambiente obrigatória: `BOLHATECH_API_BASE_URL`

### 6. Autenticação

- Magic link por e-mail → token → cookie httpOnly `bolha_session`
- O cookie é lido em Server Components via `cookies()` do Next.js
- `communityRepository.js` injeta automaticamente o header `x-user-id` em todas as chamadas
- Usuário não autenticado → `x-user-id: user-guest`

---

## Adicionando features novas

### Nova página

1. Crie `src/app/[rota]/page.jsx`
2. Importe o container correspondente
3. Adicione `export const dynamic = 'force-dynamic'` se precisar de dados frescos
4. Adicione `generateMetadata()` para SEO

### Nova feature

Siga a estrutura de `features/community`:

```
features/nova-feature/
├── server/         # repository.js — data fetching
├── components/     # componentes de apresentação
├── containers/     # orquestradores (server async)
└── lib/            # utilitários (formatação, etc.)
```

### Novo componente visual

Se o componente for reutilizável em outras apps → adicione ao **design system** (`bolhatech-design-system`), não aqui.
Se for específico desta app → crie em `features/*/components/`.

---

## Padrões proibidos

```js
// ❌ Não use styled-components, Tailwind ou CSS modules
// ❌ Não faça fetch no browser sem passar pelo /api/
// ❌ Não crie tokens de cor, fonte ou espaçamento hardcoded
// ❌ Não use border-radius, box-shadow ou backdrop-filter diretamente — use classes do DS
// ❌ Não importe 'bolhatech-design-system' root em Server Components que usam VoteBar
// ❌ Não adicione glassmorphism (backdrop-filter: blur) — foi removido intencionalmente
// ❌ Não use Sora ou Instrument Sans — a fonte do sistema é Inter
```

---

## Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|----------|-------------|-----------|
| `BOLHATECH_API_BASE_URL` | ✅ | URL base do backend AWS (ex: `https://api.abolhatech.com`) |

---

## Comandos

```bash
npm run dev      # dev server em http://localhost:3000
npm run build    # build de produção
npm run start    # server de produção após build
```

---

## Integração com outros projetos

| Projeto | Relação |
|---------|---------|
| `bolhatech-design-system` | Dependência npm — todos os componentes visuais |
| `bolhatech-backend` | API consumida via BFF (variável BOLHATECH_API_BASE_URL) |
| `bolhatech-infra` | Deploy via Terraform — não altere infra por aqui |

---

## Comunidades conhecidas

Os slugs de comunidade definidos são: `ia`, `frontend`, `backend`, `devops`.
Cada um tem cor própria via `--bolha-community-<slug>` e `--bolha-community-<slug>-bg`.
Use `communityVariant(slug)` do DS para mapear slug → variante de Badge.

---

## Decisões de arquitetura (não reverta sem contexto)

- **Sem TypeScript no frontend** — JavaScript puro por escolha do time
- **App Router sem Pages Router** — migração completa para RSC
- **BFF obrigatório** — evita expor credenciais AWS no browser
- **Design system como pacote npm** — não copie componentes para dentro desta repo
- **Layout 3 colunas** — sidebar esquerda (SidebarNav) + main + aside direita reservada
- **Sem glassmorphism** — visual limpo, surfaces sólidas
