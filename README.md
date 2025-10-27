# 🪝 Webhook Inspector

Uma aplicação fullstack para capturar, inspecionar e gerenciar webhooks em tempo real.

## 📋 Características

- ✅ API REST com validação de tipos
- ✅ Documentação automática com Swagger
- ✅ Interface web moderna com React
- ✅ Banco de dados PostgreSQL
- ✅ CORS habilitado para múltiplas origens
- ✅ Type-safe com TypeScript e Zod

## 🛠️ Tecnologias Utilizadas

### Backend

- **[Fastify](https://www.fastify.io/)** - Framework HTTP de alta performance
- **[Drizzle ORM](https://orm.drizzle.team/)** - ORM type-safe para TypeScript
- **[PostgreSQL](https://www.postgresql.org/)** - Banco de dados relacional
- **[Zod](https://zod.dev/)** - Validação de schemas
- **[Fastify Swagger](https://github.com/fastify/fastify-swagger)** - Documentação OpenAPI
- **[Scalar API Reference](https://scalar.com/)** - Interface bonita para API docs

### Frontend

- **[React 19](https://react.dev/)** - Biblioteca UI
- **[Vite](https://vitejs.dev/)** - Build tool rápido
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[ESLint](https://eslint.org/)** - Linting

### DevOps & Ferramentas

- **[pnpm](https://pnpm.io/)** - Gerenciador de pacotes
- **[Biome](https://biomejs.dev/)** - Formatador de código
- **[tsx](https://tsx.is/)** - Executor TypeScript

## 📦 Pré-requisitos

- **Node.js** 18+ ou superior
- **pnpm** 10+
- **PostgreSQL** 12+

## 🚀 Instalação e Setup

### 1. Clone o repositório

```bash
git clone https://github.com/CrisnaldoSantos/webhook-inspector.git
cd webhook-inspector
```

### 2. Instale as dependências

```bash
pnpm install
```

### 3. Configure o banco de dados

Crie um banco de dados PostgreSQL chamado `webhook_inspector`:

```bash
createdb webhook_inspector
```

### 4. Configure as variáveis de ambiente

Crie um arquivo `.env` na pasta `api`:

```bash
# api/.env
DATABASE_URL="postgresql://postgres:password@localhost:5432/webhook_inspector"
PORT=3333
```

### 5. Execute as migrações

```bash
cd api
pnpm db:migrate
```

## 📚 Desenvolvimento

### Iniciar o servidor API

```bash
cd api
pnpm dev
```

A API estará disponível em `http://localhost:3333`
Documentação em `http://localhost:3333/docs`

### Iniciar o frontend

```bash
cd web
pnpm dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🗂️ Estrutura do Projeto

```
webhook-inspector/
├── api/                    # Backend Fastify
│   ├── src/
│   │   ├── server.ts      # Configuração do servidor
│   │   ├── env.ts         # Variáveis de ambiente
│   │   ├── routes/        # Endpoints da API
│   │   └── db/            # Configuração do banco
│   ├── drizzle.config.ts  # Config ORM
│   └── package.json
├── web/                    # Frontend React
│   ├── src/
│   │   ├── main.tsx       # Entry point
│   │   ├── app.tsx        # Componente principal
│   │   └── index.css      # Estilos
│   ├── vite.config.ts     # Config Vite
│   └── package.json
├── pnpm-workspace.yaml    # Config workspace
└── README.md
```

## 🔧 Scripts Disponíveis

### API

```bash
pnpm dev              # Iniciar em modo desenvolvimento
pnpm start            # Iniciar em produção
pnpm db:generate      # Gerar migrações
pnpm db:migrate       # Executar migrações
pnpm db:studio        # Abrir Drizzle Studio
pnpm format           # Formatar código com Biome
```

### Web

```bash
pnpm dev              # Iniciar dev server
pnpm build            # Build para produção
pnpm preview          # Preview do build
```

## 📖 Documentação da API

Após iniciar o servidor, acesse:

- **Swagger UI**: `http://localhost:3333/docs`
- **Scalar Reference**: `http://localhost:3333/reference`

## 👨‍💻 Autor

[Crisnaldo Santos](https://github.com/CrisnaldoSantos)

## 📄 Licença

ISC
