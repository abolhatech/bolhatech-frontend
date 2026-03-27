# Deploy AWS (Frontend)

Este frontend está preparado para deploy automático via GitHub Actions usando AWS Amplify Hosting.

## O que já está pronto

- Workflow: `.github/workflows/frontend-deploy.yml`
- Build spec do Amplify: `amplify.yml`
- Trigger automático em push para `main`

## Pré-requisitos (uma única vez)

1. Criar app no AWS Amplify conectado ao repositório `bolhatech-frontend`.
2. Criar branch no Amplify para `main`.
3. Configurar domínio customizado no Amplify com:
   - `abolhatech.com.br` (domínio raiz)
   - opcional: `www.abolhatech.com.br`
4. Garantir que a Hosted Zone do Route53 seja da mesma conta AWS do Amplify.

Observação: o registro `links.abolhatech.com.br` pode continuar apontando para o GitHub Pages sem conflito.

## Variáveis e secrets no GitHub (repo frontend)

Variables:

- `AWS_REGION` (ex.: `us-east-1`)
- `FRONTEND_AMPLIFY_APP_ID` (ex.: `dxxxxxxxxxxxx`)
- `FRONTEND_AMPLIFY_BRANCH` (ex.: `main`)

No AWS Amplify (Environment variables da branch `main`):

- `BOLHATECH_API_BASE_URL` (URL pública do backend API Gateway, ex.: `https://xxxx.execute-api.us-east-1.amazonaws.com`)

Secrets (use um dos dois):

- `FRONTEND_AWS_DEPLOY_ROLE_ARN` (recomendado)
- ou `AWS_DEPLOY_ROLE_ARN` (fallback)

## Permissões mínimas da role OIDC do frontend

A role usada pelo workflow precisa, no mínimo:

- `amplify:StartJob`
- `amplify:GetJob`
- `amplify:GetBranch`
- `amplify:ListApps` (opcional para troubleshooting)

Recursos recomendados: restringir para o app Amplify específico (`arn:aws:amplify:<region>:<account-id>:apps/<app-id>/*`).

## Fluxo

1. Push para `main` no repositório frontend.
2. Action valida build local (`npm ci` + `npm run build`).
3. Action autentica na AWS via OIDC.
4. Action dispara `amplify start-job --job-type RELEASE`.
5. Action aguarda conclusão e falha se deploy falhar no Amplify.

## Domínio raiz `abolhatech.com.br`

No Amplify Domain Management:

1. Add domain: `abolhatech.com.br`
2. Mapear apex (`@`) para branch `main`
3. (Opcional) mapear `www` para `main`
4. Aguardar status `Available`/`Verified`

Se já existir registro A/AAAA para `abolhatech.com.br` criado por outro projeto, remova-o antes para evitar conflito de alias.
