# Sistema de Gestão de Projetos - Backend

API REST para gerenciamento de projetos e tarefas com autenticação JWT.

## Tecnologias

- **Node.js** 20
- **Fastify** 5 - Framework web
- **TypeScript** - Tipagem estática
- **Drizzle ORM** - ORM para PostgreSQL
- **PostgreSQL** 15 - Banco de dados
- **Zod** - Validação de dados
- **bcrypt** - Hash de senhas
- **JWT** - Autenticação

## Estrutura do Projeto

```
backend/
├── src/
│   ├── controllers/      # Controladores das rotas
│   ├── services/         # Lógica de negócio
│   ├── repositories/     # Acesso ao banco de dados
│   ├── models/           # Schemas do Drizzle ORM
│   ├── middlewares/      # Autenticação e validação
│   ├── routes/           # Definição de rotas
│   ├── utils/            # Funções auxiliares
│   ├── env/              # Validação de variáveis de ambiente
│   └── server.ts         # Arquivo principal
├── drizzle/              # Migrations geradas
├── Dockerfile
├── docker-compose.yml
└── start.sh              # Script de inicialização
```

## Instalação e Execução

### Usando Docker (Recomendado)

1. Clone o repositório e navegue até a pasta backend:
```bash
cd backend
```

2. Suba os containers:
```bash
docker compose up --build -d
```

3. Verifique os logs:
```bash
docker compose logs -f backend
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

Edite o arquivo `.env` com suas configurações.

3. Inicie o PostgreSQL (Docker):
```bash
docker compose up postgres -d
```

4. Gere as migrations:
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

- `npm run dev` - Inicia o servidor em modo desenvolvimento com watch
- `npm run build` - Compila o TypeScript para JavaScript
- `npm start` - Inicia o servidor em modo produção
- `npm run migrate` - Executa as migrations do banco
- `npm run generate` - Gera novas migrations baseadas nos schemas
- `npm run studio` - Abre o Drizzle Studio para visualizar o banco

## Variáveis de Ambiente

```env
NODE_ENV=development
PORT=3333
HOST=0.0.0.0

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=gestao_projetos

JWT_SECRET=your-secret-key-here
```

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

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "password": "senha123"
}
```

Resposta:
```json
{
  "user": {
    "id": "uuid",
    "name": "João Silva",
    "email": "joao@example.com",
    "createdAt": "2025-12-23T00:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Projetos

**Todas as rotas de projetos requerem autenticação via header:**
```
Authorization: Bearer {token}
```

#### Listar Projetos
```http
GET /projects
```

#### Criar Projeto
```http
POST /projects
Content-Type: application/json

{
  "name": "Meu Projeto",
  "description": "Descrição do projeto"
}
```

#### Detalhes do Projeto
```http
GET /projects/:id
```

#### Atualizar Projeto
```http
PUT /projects/:id
Content-Type: application/json

{
  "name": "Projeto Atualizado",
  "description": "Nova descrição"
}
```

#### Deletar Projeto
```http
DELETE /projects/:id
```

### Tarefas

**Todas as rotas de tarefas requerem autenticação via header:**
```
Authorization: Bearer {token}
```

#### Listar Tarefas do Projeto
```http
GET /projects/:id/tasks
```

#### Criar Tarefa
```http
POST /projects/:id/tasks
Content-Type: application/json

{
  "title": "Minha tarefa"
}
```

#### Atualizar Tarefa
```http
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Tarefa atualizada",
  "completed": true
}
```

#### Deletar Tarefa
```http
DELETE /tasks/:id
```

## Modelagem de Dados

### Usuário
```typescript
{
  id: uuid
  name: string
  email: string (único)
  password: string (hash)
  createdAt: datetime
}
```

### Projeto
```typescript
{
  id: uuid
  name: string
  description: string (opcional)
  ownerId: uuid (FK → Usuário)
  createdAt: datetime
}
```

### Tarefa
```typescript
{
  id: uuid
  title: string
  completed: boolean (padrão: false)
  projectId: uuid (FK → Projeto)
  createdAt: datetime
}
```

## Relacionamentos

- Um Usuário possui vários Projetos (1:N)
- Um Projeto possui várias Tarefas (1:N)
- Um usuário não pode acessar projetos ou tarefas de outro usuário

## Segurança

- Senhas armazenadas com hash bcrypt
- Autenticação via JWT
- Validação de dados com Zod
- Rotas protegidas por middleware de autenticação
- Isolamento de dados por usuário

## Comandos Docker Úteis

```bash
# Parar containers
docker compose down

# Remover volumes (apaga banco de dados)
docker compose down -v

# Ver logs
docker compose logs -f

# Rebuild completo
docker compose up --build --force-recreate
```

## Troubleshooting

### Erro de conexão com banco
Verifique se o PostgreSQL está rodando:
```bash
docker compose ps
```

### Migrations não executam
Execute manualmente:
```bash
docker compose exec backend npm run migrate
```

### Porta 3333 ou 5432 em uso
Altere as portas no `docker-compose.yml` ou pare o serviço que está usando a porta.
