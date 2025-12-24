# Sistema de Gestão de Projetos - Backend

API REST para gerenciamento de projetos e tarefas com autenticação JWT.

## Tecnologias

- **Node.js** 20 (Alpine)
- **Fastify** 5.2.0 - Framework web performático
- **TypeScript** 5.7.2 - Tipagem estática
- **Drizzle ORM** 0.36.4 - ORM type-safe para PostgreSQL
- **PostgreSQL** 15 (Alpine) - Banco de dados relacional
- **Zod** 3.23.8 - Validação de schemas e runtime
- **bcrypt** 5.1.1 - Hash seguro de senhas
- **@fastify/jwt** 9.0.1 - Autenticação JWT
- **@fastify/cors** 10.0.1 - Cross-Origin Resource Sharing
- **dotenv** 16.4.5 - Gerenciamento de variáveis de ambiente

## Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/          # Controladores das rotas (auth, project, task)
│   ├── services/             # Lógica de negócio e regras de autorização
│   ├── repositories/         # Acesso ao banco de dados (Drizzle ORM)
│   ├── models/               # Schemas do Drizzle ORM
│   │   ├── schema.ts         # Definição de tabelas e relações
│   │   └── drizzle/          # Migrations SQL geradas
│   ├── middlewares/          # Middleware de autenticação JWT
│   ├── routes/               # Definição de rotas da API
│   ├── utils/                # Funções auxiliares
│   │   ├── db.ts             # Configuração conexão Drizzle
│   │   ├── migrate.ts        # Script de migrations (usado em produção)
│   │   └── password.ts       # Utilities bcrypt
│   ├── env/                  # Validação de variáveis de ambiente com Zod
│   └── server.ts             # Arquivo principal (inicialização Fastify)
├── dist/                     # Código compilado (gerado pelo build)
├── Dockerfile                # Build multi-stage otimizado
├── docker-compose.yml        # Orquestração PostgreSQL + Backend
├── start.sh                  # Script de inicialização com retry de migrations
├── drizzle.config.ts         # Configuração Drizzle Kit (dev)
├── tsconfig.json             # Configuração TypeScript
├── package.json              # Dependências e scripts
├── .env.example              # Template de variáveis de ambiente
└── README.md
```

## Instalação e Execução

### Usando Docker (Recomendado)

1. Clone o repositório e navegue até a pasta backend:
```bash
cd backend
```

2. Copie o arquivo de exemplo de variáveis de ambiente:
```bash
cp .env.example .env
```

3. **(IMPORTANTE)** Se você já rodou o projeto antes e teve erros de autenticação do PostgreSQL, remova os volumes antigos:
```bash
docker-compose down -v
```

4. Suba os containers:
```bash
docker-compose up --build -d
```

5. Verifique os logs:
```bash
docker-compose logs -f backend
```

**Saída esperada:**
```
🔍 Debugging environment variables:
DB_HOST: postgres
DB_PORT: 5432
DB_USER: postgres
DB_PASSWORD: ***
DB_NAME: gestao_projetos
🚀 Starting migrations... (attempt 1/5)
✅ Migrations completed successfully!
Starting server...
🚀 ~ Server listening at http://0.0.0.0:3333
```

A API estará disponível em: `http://localhost:3333`

### Desenvolvimento Local

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` e certifique-se que `DB_HOST=localhost` (não `postgres`).

3. Inicie o PostgreSQL (Docker):
```bash
docker-compose up postgres -d
```

4. Gere as migrations (se houver mudanças no schema):
```bash
npm run generate
```

5. Execute as migrations:
```bash
npm run migrate
```

6. Inicie o servidor em modo desenvolvimento:
```bash
npm run dev
```

## Scripts Disponíveis

- `npm run dev` - Inicia o servidor em modo desenvolvimento com hot reload (tsx watch)
- `npm run build` - Compila o TypeScript para JavaScript (output: `dist/`)
- `npm start` - Inicia o servidor em modo produção (`node dist/server.js`)
- `npm run migrate` - Executa as migrations do banco de dados (usa script compilado)
- `npm run generate` - Gera novas migrations baseadas nos schemas (Drizzle Kit)
- `npm run studio` - Abre o Drizzle Studio para visualizar/editar o banco via UI

## Variáveis de Ambiente

### Desenvolvimento Local (`.env`)
```env
NODE_ENV=development
PORT=3333
HOST=0.0.0.0

DB_HOST=localhost          # localhost em dev
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gestao_projetos

JWT_SECRET=your-secret-key-here-change-in-production
```

### Docker (Injetadas via `docker-compose.yml`)
```env
NODE_ENV=production
PORT=3333
HOST=0.0.0.0

DB_HOST=postgres           # Nome do serviço no docker-compose
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gestao_projetos

JWT_SECRET=your-secret-key-change-in-production
```

**Importante:**
- Em desenvolvimento local, use `DB_HOST=localhost`
- No Docker, use `DB_HOST=postgres` (nome do serviço)
- O arquivo `src/env/index.ts` carrega `.env` automaticamente em desenvolvimento
- Em produção (Docker), as variáveis vêm diretamente do `docker-compose.yml`

## Endpoints da API

### Autenticação

#### Cadastro
```http
POST /auth/register
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta 201:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "João Silva",
  "email": "joao@example.com",
  "createdAt": "2025-12-24T00:00:00.000Z"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

**Resposta 200:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Token JWT inclui:**
- `sub`: ID do usuário
- `iat`: Timestamp de criação
- `exp`: Expiração (1 dia após criação)

### Projetos

**Todas as rotas de projetos requerem autenticação via header:**
```
Authorization: Bearer {token}
```

#### Listar Projetos do Usuário
```http
GET /projects
Authorization: Bearer {token}
```

**Resposta 200:**
```json
[
  {
    "id": "uuid",
    "name": "Meu Projeto",
    "description": "Descrição do projeto",
    "ownerId": "uuid-do-usuario",
    "createdAt": "2025-12-24T00:00:00.000Z"
  }
]
```

#### Criar Projeto
```http
POST /projects
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Meu Projeto",
  "description": "Descrição do projeto"  // opcional
}
```

**Resposta 201:** Projeto criado

#### Detalhes do Projeto
```http
GET /projects/:id
Authorization: Bearer {token}
```

**Resposta 200:** Projeto encontrado
**Resposta 404:** Projeto não encontrado ou não pertence ao usuário

#### Atualizar Projeto
```http
PUT /projects/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Projeto Atualizado",      // opcional
  "description": "Nova descrição"    // opcional
}
```

**Resposta 200:** Projeto atualizado

#### Deletar Projeto
```http
DELETE /projects/:id
Authorization: Bearer {token}
```

**Resposta 204:** Projeto deletado (e todas as tarefas associadas - cascade)

### Tarefas

**Todas as rotas de tarefas requerem autenticação via header:**
```
Authorization: Bearer {token}
```

#### Listar Tarefas do Projeto
```http
GET /projects/:id/tasks
Authorization: Bearer {token}
```

**Resposta 200:**
```json
[
  {
    "id": "uuid",
    "title": "Minha tarefa",
    "completed": false,
    "projectId": "uuid-do-projeto",
    "createdAt": "2025-12-24T00:00:00.000Z"
  }
]
```

#### Criar Tarefa
```http
POST /projects/:id/tasks
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Minha tarefa"
}
```

**Resposta 201:** Tarefa criada (padrão `completed: false`)

#### Atualizar Tarefa
```http
PUT /tasks/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Tarefa atualizada",    // opcional
  "completed": true                 // opcional
}
```

**Resposta 200:** Tarefa atualizada

#### Deletar Tarefa
```http
DELETE /tasks/:id
Authorization: Bearer {token}
```

**Resposta 204:** Tarefa deletada

## Modelagem de Dados

### Esquema do Banco (PostgreSQL)

#### Tabela `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,  -- hash bcrypt
  created_at TIMESTAMP DEFAULT now()
);
```

#### Tabela `projects`
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description VARCHAR(1000),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);
```

#### Tabela `tasks`
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);
```

### Relacionamentos

- **User → Projects**: 1:N (um usuário pode ter vários projetos)
- **Project → Tasks**: 1:N (um projeto pode ter várias tarefas)
- **Cascade Delete**:
  - Deletar usuário → deleta todos os projetos e tarefas
  - Deletar projeto → deleta todas as tarefas

### Isolamento de Dados

- Cada usuário só pode acessar seus próprios projetos
- Projetos são filtrados automaticamente por `ownerId`
- Tarefas são acessíveis apenas através dos projetos do usuário

## Arquitetura

### Camadas da Aplicação

```
┌─────────────────────────────────────┐
│         Routes (Fastify)            │  ← Define endpoints
├─────────────────────────────────────┤
│        Middlewares (JWT)            │  ← Autenticação/Autorização
├─────────────────────────────────────┤
│      Controllers (Validação)        │  ← Valida com Zod, chama services
├─────────────────────────────────────┤
│    Services (Lógica de Negócio)     │  ← Regras de autorização
├─────────────────────────────────────┤
│  Repositories (Acesso ao Banco)     │  ← Drizzle ORM queries
├─────────────────────────────────────┤
│     Database (PostgreSQL)           │  ← Persistência
└─────────────────────────────────────┘
```

### Fluxo de Requisição

1. **Cliente** → Envia request HTTP
2. **Fastify** → Roteia para handler correto
3. **Middleware** → Verifica JWT (rotas protegidas)
4. **Controller** → Valida dados com Zod
5. **Service** → Aplica regras de negócio
6. **Repository** → Executa queries no banco
7. **Database** → Retorna dados
8. **Response** → JSON serializado para cliente

### Segurança

- ✅ **Senhas**: Hash bcrypt com salt rounds = 10
- ✅ **Tokens**: JWT com expiração de 24 horas
- ✅ **Validação**: Zod valida todos os inputs
- ✅ **Autorização**: Middleware verifica ownership
- ✅ **Isolamento**: Queries filtradas por `userId`
- ✅ **CORS**: Configurado para aceitar origens permitidas
- ✅ **SQL Injection**: Prevenido pelo Drizzle ORM (prepared statements)

## Docker

### Arquitetura Multi-Stage Build

#### Stage 1: Builder
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci                    # Instala TODAS as dependências
COPY . .
RUN npm run generate          # Gera migrations SQL
RUN npm run build             # Compila TypeScript → dist/
```

#### Stage 2: Runtime
```dockerfile
FROM node:20-alpine
RUN apk add --no-cache netcat-openbsd    # Para healthcheck
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production              # APENAS production deps
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/src/models/drizzle ./dist/models/drizzle
COPY start.sh ./
RUN chmod +x start.sh
EXPOSE 3333
CMD ["./start.sh"]
```

**Vantagens:**
- Imagem final menor (~200MB vs ~500MB)
- Sem devDependencies em produção
- Mais seguro (menos superfície de ataque)

### Script de Inicialização (`start.sh`)

```bash
#!/bin/sh

# 1. Aguarda PostgreSQL aceitar conexões TCP
echo "Waiting for postgres..."
while ! nc -z postgres 5432; do
  sleep 1
done
echo "PostgreSQL started"

# 2. Executa migrations com retry (5 tentativas)
echo "Running migrations..."
npm run migrate
echo "Migrations finished"

# 3. Inicia servidor
echo "Starting server..."
node dist/server.js
```

**Retry Logic:** O script `src/utils/migrate.ts` tenta 5 vezes com backoff exponencial (2s, 4s, 6s, 8s) para lidar com PostgreSQL que aceita conexões antes de estar pronto para autenticar.

### Healthchecks

**PostgreSQL:**
```yaml
healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U postgres']
  interval: 5s
  timeout: 5s
  retries: 5
```

**Backend:**
- Depende do healthcheck do PostgreSQL (`condition: service_healthy`)
- Garante que migrations só rodam quando BD está pronto

## Comandos Docker Úteis

```bash
# Iniciar stack completo
docker-compose up --build -d

# Ver logs em tempo real
docker-compose logs -f backend
docker-compose logs -f postgres

# Parar containers
docker-compose down

# Parar e remover volumes (APAGA O BANCO!)
docker-compose down -v

# Rebuild completo forçando recriação
docker-compose up --build --force-recreate

# Executar comandos dentro do container
docker-compose exec backend sh
docker-compose exec backend npm run migrate
docker-compose exec backend npm run studio

# Acessar PostgreSQL
docker-compose exec postgres psql -U postgres -d gestao_projetos

# Ver status dos containers
docker-compose ps
```

## Troubleshooting

### ❌ Erro: `password authentication failed for user "postgres"`

**Causa:** Volumes antigos do Docker com senha diferente da configurada.

**Solução:**
```bash
docker-compose down -v  # Remove volumes
docker-compose up --build
```

### ❌ Erro: `drizzle.config.json file does not exist`

**Causa:** Tentando usar `drizzle-kit migrate` em produção (não instalado).

**Solução:** O projeto já foi corrigido para usar `node dist/utils/migrate.js`. Se ainda aparecer, verifique `package.json`:
```json
"migrate": "node dist/utils/migrate.js"  // ✅ Correto
"migrate": "drizzle-kit migrate"         // ❌ Errado
```

### ❌ Migrations não executam

**Verificar logs:**
```bash
docker-compose logs backend
```

**Executar manualmente:**
```bash
docker-compose exec backend npm run migrate
```

### ❌ Porta 3333 ou 5432 em uso

**Verificar processos:**
```bash
lsof -i :3333
lsof -i :5432
```

**Alterar portas no `docker-compose.yml`:**
```yaml
ports:
  - '3334:3333'  # Mapeia 3334 do host para 3333 do container
```

### ❌ Container não inicia

**Ver logs detalhados:**
```bash
docker-compose logs backend
```

**Rebuild completo:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Desenvolvimento

### Adicionar Nova Tabela

1. Edite `src/models/schema.ts`:
```typescript
export const minhaTabela = pgTable('minha_tabela', {
  id: uuid('id').defaultRandom().primaryKey(),
  nome: varchar('nome', { length: 255 }).notNull(),
  // ...
})
```

2. Gere a migration:
```bash
npm run generate
```

3. Aplique a migration:
```bash
npm run migrate
```

### Visualizar Banco com Drizzle Studio

```bash
npm run studio
```

Abre em: `https://local.drizzle.studio`

### Rodar Testes (Quando Implementados)

```bash
npm test
```

## Roadmap

- [ ] Implementar testes unitários (Jest/Vitest)
- [ ] Implementar testes de integração
- [ ] Adicionar rate limiting
- [ ] Implementar refresh tokens
- [ ] Adicionar paginação nas listagens
- [ ] Implementar soft delete
- [ ] Adicionar logging estruturado (Pino)
- [ ] Implementar cache (Redis)
- [ ] Adicionar webhooks
- [ ] Documentação Swagger/OpenAPI

## Licença

ISC

## Contato

Para dúvidas ou sugestões, abra uma issue no repositório.
