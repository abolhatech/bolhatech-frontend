# BolhaTech Frontend

Frontend da aplicação BolhaTech construído com Next.js e React.

## Tech Stack

- **Next.js** 15
- **React** 18
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

- `BOLHATECH_API_BASE_URL` (obrigatória): URL base pública da API backend.

Exemplo:

```bash
BOLHATECH_API_BASE_URL=https://xxxx.execute-api.us-east-1.amazonaws.com
```

No AWS Amplify, configure essa variável em `App settings -> Environment variables` para a branch `main`.

## Design System

O projeto utiliza o `bolhatech-design-system` localizado no diretório raiz do projeto. Para desenvolver componentes:

```bash
cd ../bolhatech-design-system

# Iniciar Storybook
npm run storybook

# Build do package
npm run build
```
