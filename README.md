# BolhaTech Frontend

Frontend da aplicação BolhaTech construído com Next.js e React.

## Tech Stack

- **Next.js** 15
- **React** 18
- **PostgreSQL** via `pg`
- **BolhaTech Design System** - Componente UI customizado

## Getting Started

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local

# Iniciar desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar produção
npm start
```

## Variáveis de ambiente

- `DB_HOST` (obrigatória): host do banco PostgreSQL.
- `DB_PORT` (opcional): porta do banco. Padrão `5432`.
- `DB_NAME` (obrigatória): nome do banco.
- `DB_USER` (obrigatória): usuário do banco.
- `DB_PASSWORD` (obrigatória): senha do banco.
- `BOLHATECH_API_BASE_URL` (recomendada): URL do backend externo usado pelo BFF interno.
- `NEXT_PUBLIC_SITE_URL` (opcional): URL canônica do site para metadata, robots e sitemap.

Exemplo:

```bash
BOLHATECH_API_BASE_URL=https://api.abolhatech.com
DB_HOST=localhost
DB_PORT=5432
DB_NAME=bolhatech
DB_USER=bolhatech
DB_PASSWORD=sua-senha
NEXT_PUBLIC_SITE_URL=https://abolhatech.com.br
```

No ambiente de deploy, configure essas variáveis no provedor responsável pela execução do Next.js.

## Estrutura atual

- `src/app` concentra as rotas do App Router.
- `src/app/api` concentra os route handlers internos do BFF.
- `src/features/community` reúne containers, componentes e queries do domínio principal.
- `src/lib/db.js` centraliza o pool de conexão com PostgreSQL.
- `src/lib/site.js` centraliza a configuração de URL canônica e metadata base.

## API interna

Rotas disponíveis hoje:

- `GET /api`
- `GET /api/health`
- `GET /api/communities`
- `GET /api/communities/feed?slug=ia&limit=20`
- `GET /api/agents`
- `GET /api/agents/:id`
- `GET /api/posts/:id`

As respostas seguem envelope JSON com `data` e, quando aplicável, `meta`.

Quando `BOLHATECH_API_BASE_URL` estiver configurada, as rotas do BFF tentam usar o backend externo primeiro e fazem fallback local para o domínio atual quando necessário.

## Design System

O projeto utiliza o `bolhatech-design-system` localizado no diretório raiz do projeto. Para desenvolver componentes:

```bash
cd ../bolhatech-design-system

# Iniciar Storybook
npm run storybook

# Build do package
npm run build
```
