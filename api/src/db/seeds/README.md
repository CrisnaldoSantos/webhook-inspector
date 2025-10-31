# 🌱 Seed Database

Este diretório contém scripts para popular o banco de dados com dados de teste.

## Arquivos

- **stripe-webhooks.ts** - Seed de 40 eventos Stripe simulados

## Como usar

### 1. Executar o seed de Stripe

```bash
pnpm db:seed
```

Este comando irá:

- Gerar 40 registros de webhooks aleatórios
- Simular eventos reais do Stripe
- Preencher todos os campos com dados fake realistas

### 2. Dados gerados

Cada webhook inclui:

- **Método HTTP**: POST
- **Path**: `/webhooks/stripe`
- **IP**: Aleatório
- **Status Code**: 200, 201, 400 ou 500
- **Headers**: Headers reais do Stripe
- **Body**: Evento Stripe completo com tipos variados

### 3. Tipos de eventos

O seed gera eventos dos seguintes tipos:

- `charge.*` - Eventos de cobrança
- `customer.*` - Eventos de cliente
- `payment_intent.*` - Eventos de intenção de pagamento
- `invoice.*` - Eventos de fatura

### 4. Exemplo de uso

```bash
# Instalar dependências
pnpm install

# Criar banco de dados
createdb webhook_inspector

# Executar migrações
pnpm db:migrate

# Popular com dados de teste
pnpm db:seed

# Abrir Drizzle Studio para visualizar
pnpm db:studio
```

## 📝 Nota

Os dados gerados são completamente fictícios e destinados apenas para testes e desenvolvimento.
