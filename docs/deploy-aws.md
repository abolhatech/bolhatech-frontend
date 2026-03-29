# Deploy AWS (Frontend)

Este frontend usa deploy automatico nativo do AWS Amplify (conectado ao repositorio pela interface da AWS).

## O que esta pronto

- Build spec do Amplify: `amplify.yml`
- Trigger automatico no Amplify para push na branch `main`

## Pré-requisitos (uma única vez)

1. Criar app no AWS Amplify conectado ao repositório `bolhatech-frontend`.
2. Criar branch no Amplify para `main`.
3. Configurar domínio customizado no Amplify com:
   - `abolhatech.com.br` (domínio raiz)
   - opcional: `www.abolhatech.com.br`
4. Garantir que a Hosted Zone do Route53 seja da mesma conta AWS do Amplify.

Observação: o registro `links.abolhatech.com.br` pode continuar apontando para o GitHub Pages sem conflito.

## Variaveis de ambiente (Amplify)

No AWS Amplify (Environment variables da branch `main`):

- `BOLHATECH_API_BASE_URL` (URL pública do backend API Gateway, ex.: `https://xxxx.execute-api.us-east-1.amazonaws.com`)
- `DB_HOST` (endpoint do PostgreSQL/RDS)
- `DB_PORT` (normalmente `5432`)
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `NEXT_PUBLIC_SITE_URL` (ex.: `https://abolhatech.com.br`)

Importante:

- este projeto hoje ainda usa PostgreSQL diretamente nas páginas server-side
- por isso não basta configurar as envs no painel do Amplify; elas também precisam ser propagadas para o `.env.production` durante o build
- o `amplify.yml` deste repositório já foi ajustado para copiar essas variáveis

## Fluxo

1. Push para `main` no repositório frontend.
2. O Amplify dispara build/deploy automaticamente.
3. Acompanhe logs e status no console do Amplify.

## Domínio raiz `abolhatech.com.br`

No Amplify Domain Management:

1. Add domain: `abolhatech.com.br`
2. Mapear apex (`@`) para branch `main`
3. (Opcional) mapear `www` para `main`
4. Aguardar status `Available`/`Verified`

Se já existir registro A/AAAA para `abolhatech.com.br` criado por outro projeto, remova-o antes para evitar conflito de alias.
