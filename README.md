# API-Reverde (Backend NestJS)

Esta é a API de backend para o aplicativo de hábitos sustentáveis ReVerde. Ela é construída com NestJS e gerencia o cadastro de usuários, autenticação e confirmação de e-mails.

## Funcionalidades Principais

- Autenticação: Sistema completo de Registro e Login com JWT (JSON Web Tokens).

- Verificação de E-mail: Envio de e-mail com link único para ativação de conta.

- Validação: Validação automática de dados de entrada (DTOs) usando class-validator.

- Documentação: Documentação de API interativa gerada automaticamente com Swagger (acesse em /api-docs).

## Tecnologias Utilizadas

- Framework: NestJS (v10)

- Linguagem: TypeScript

- Banco de Dados: MySQL

- ORM: Prisma (para interagir com o MySQL)

- Autenticação: JWT (com @nestjs/jwt)

- Validação: class-validator e class-transformer

- E-mail: Nodemailer (testado com Mailtrap)

- Documentação: Swagger (@nestjs/swagger)

## 1. Pré-requisitos

Antes de começar, garanta que você tenha os seguintes serviços instalados e rodando em sua máquina:

1. Node.js (v18 ou superior)

2. NPM (geralmente instalado com o Node.js)

3. Um servidor de banco de dados local ou acessível

4. (Opcional, para teste de e-mail) Uma conta no Mailtrap.io (para capturar os e-mails de ativação em um ambiente de teste)

## 2. Guia de Instalação e Execução

Siga esta ordem de comandos para configurar e rodar o projeto do zero.

### Passo 1: Clonar e Instalar as Dependências

Clone este repositório (ou descompacte o .zip) e instale todos os pacotes necessários.
```
# Entre na pasta do projeto
cd reverde-mobile

# Instale todos os pacotes listados no package.json
npm install
```

### Passo 2: Configurar as Variáveis de Ambiente (.env)

Este projeto precisa de um arquivo .env na raiz para armazenar suas senhas e chaves secretas.

1. Crie um arquivo chamado .env na pasta raiz do projeto.

2. Copie o conteúdo abaixo e cole no seu arquivo .env, substituindo os valores de placeholder pelas suas credenciais reais.
```
# --- Banco de Dados (MySQL) ---
# Troque 'usuario' e 'senha' pelos seus dados do MySQL.
# O banco 'reverde_db' será criado pelo Prisma, mas o servidor deve estar rodando.
DATABASE_URL="mysql://usuario:senha@localhost:3306/reverde_db"

# --- Segurança e Autenticação (JWT) ---
# Use um valor longo e aleatório (ex: um gerador de senha online).
JWT_SECRET="COLOQUE_SEU_SEGREDO_LONGO_E_ALEATORIO_AQUI"

# --- Configurações Gerais da API ---
# A URL base onde sua API estará rodando.
API_BASE_URL="http://localhost:3000"

# --- Configuração do Serviço de E-mail (Mailtrap.io) ---
# Cole suas credenciais de "Inboxes" -> "SMTP Settings" do Mailtrap
EMAIL_HOST="smtp.mailtrap.io"
EMAIL_PORT=2525
EMAIL_USER="SEU_USUARIO_MAILTRAP"
EMAIL_PASS="SUA_SENHA_MAILTRAP"
```

### Passo 3: Criar e "Migrar" o Banco de Dados

Com o .env configurado, o Prisma agora pode se conectar ao seu MySQL e criar as tabelas.
```
# Este comando lê o 'schema.prisma' e cria as tabelas (User, ActivationToken) no seu MySQL.
npx prisma migrate dev
```

### Passo 4: Gerar o Cliente Prisma

Gere o cliente Prisma (embora o migrate dev geralmente faça isso, é uma boa prática).
```
npx prisma generate
```

### Passo 5: Rodar a Aplicação

Se tudo foi feito corretamente, inicie o servidor da API.
```
# Inicia o servidor em modo de desenvolvimento (com auto-reload)
npm run start:dev
```

## 3. Acessando a API

Se o servidor iniciou sem erros:

API Rodando: http://localhost:3000

Documentação Swagger: http://localhost:3000/api-docs

Você pode usar o Postman ou a própria interface do Swagger para testar os endpoints de registro e login.
