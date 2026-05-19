# Sistema de Moeda Estudantil

> Plataforma para reconhecimento de mérito estudantil através de moeda virtual, com integração entre alunos, professores e empresas parceiras.

---

## 👥 Autores

| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 💼 LinkedIn | 📤 Gmail |
|---------|----------|-----------------|-------------|-----------|
| Josué Carlos Goulart dos Reis | <div align="center"><img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/user2"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/user2"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:user2@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |
| Karen Joilly | <img src="https://raw.githubusercontent.com/karenjoilly11/Resenha-de-Artigos-Projeto-de-Software/main/assets/fotokaren.jpg" width="70px" height="70px"> | <div align="center"><a href="https://github.com/vcaraujo"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/karen-joilly-araujo-gregorio-de-almeida/"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px"></a></div> | <div align="center"><a href="mailto:karenjoilly@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px"></a></div> |
| Luiz Fernando Batista Moreira | <div align="center"><img src="https://joaopauloaramuni.github.io/image/aramunilogo.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/user2"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="https://www.linkedin.com/in/user2"><img src="https://joaopauloaramuni.github.io/image/linkedin2.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:user2@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

---

## 📋 Histórias de Usuário

### 👨‍🎓 Aluno

| ID | História | Prioridade |
|----|----------|------------|
| **H01** | Eu, como **aluno**, quero me cadastrar no sistema informando nome, email, CPF, RG, endereço, instituição e curso, **para que** eu possa participar do programa de moeda estudantil. | Alta |
| **H02** | Eu, como **aluno**, quero consultar meu extrato completo (saldo + histórico), **para que** eu possa controlar minhas moedas. | Alta |
| **H03** | Eu, como **aluno**, quero selecionar uma vantagem e resgatar usando minhas moedas, **para que** eu possa obter descontos ou produtos. | Alta |
| **H04** | Eu, como **aluno**, quero receber um email com código de cupom após resgatar uma vantagem, **para que** eu possa apresentá-lo na empresa parceira. | Média |

### 👨‍🏫 Professor

| ID | História | Prioridade |
|----|----------|------------|
| **H05** | Eu, como **professor**, quero consultar meu extrato (saldo + histórico de envios), **para que** eu possa gerenciar minha distribuição. | Alta |
| **H06** | Eu, como **professor**, quero enviar moedas para um aluno com motivo de reconhecimento, **para que** eu possa estimular o mérito estudantil. | Alta |
| **H07** | Eu, como **professor**, quero que o sistema verifique meu saldo antes de cada envio, **para que** eu não possa enviar mais do que possuo. | Alta |
| **H08** | Eu, como **professor**, quero que o saldo não utilizado seja somado às 1.000 novas moedas do próximo semestre, **para que** eu não perca moedas. | Média |

### 🏢 Empresa Parceira

| ID | História | Prioridade |
|----|----------|------------|
| **H09** | Eu, como **empresa parceira**, quero cadastrar vantagens com nome, descrição, foto e custo em moedas, **para que** os alunos possam resgatar. | Alta |
| **H10** | Eu, como **empresa parceira**, quero receber um email com o código do cupom no resgate, **para que** eu possa conferir a troca. | Média |
| **H11** | Eu, como **empresa parceira**, quero editar ou remover minhas vantagens, **para que** eu mantenha as ofertas atualizadas. | Baixa |

### 🔐 Geral

| ID | História | Prioridade |
|----|----------|------------|
| **H12** | Eu, como **usuário**, quero fazer login com email e senha antes de acessar o sistema, **para que** apenas pessoas autorizadas utilizem a plataforma. | Alta |

---

## 📊 Matriz de Rastreabilidade

| Requisito | Histórias Relacionadas |
|-----------|------------------------|
| Cadastro de aluno | H01 |
| Cadastro de vantagem | H09 |
| Distribuição de moedas | H05, H06, H07, H08 |
| Troca de moedas | H02, H03, H04 |
| Notificações por email | H04, H10 |
| Autenticação | H12 |

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
|--------|-------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Radix UI, Framer Motion |
| **Backend** | Java 21, Spring Boot 3.4.4, Spring Data JPA |
| **Banco** | PostgreSQL 16 (produção/Docker) · H2 file-based (dev local sem Docker) |
| **Testes** | JUnit 5 + Mockito (backend, 19 testes) · Cypress 13 (E2E, 3 specs) |
| **Infra** | Docker + Docker Compose · Nginx (serve SPA + proxy `/api`) |
| **CI/CD** | GitHub Actions (workflows JUnit, Cypress, e stack dockerizada) |
| **Ferramentas** | Maven, Git, npm |

---

## 🐳 Rodando com Docker (recomendado)

**Pré-requisitos:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) ou Docker Engine + plugin Compose (Linux). ~4 GB de RAM disponíveis.

### Modo demo / apresentação

Sobe Postgres + backend Spring Boot + frontend buildado servido por Nginx:

```powershell
docker compose up --build
```

- 🌐 Frontend: **http://localhost**
- 🔌 Backend:  **http://localhost:8081/api**

Em ~40 s o stack está pronto. Faça login com qualquer seed da seção [Credenciais de seed](#-credenciais-de-seed).

### Modo desenvolvimento (com hot reload)

Sobe o mesmo stack, mas com o Vite dev server em vez do Nginx — editar arquivos em `frontend/src/` reflete no browser em <2 s:

```powershell
docker compose -f docker-compose.dev.yml up --build
```

- 🌐 Frontend: **http://localhost:5173** (Vite + HMR)
- 🔌 Backend:  **http://localhost:8081/api**
- 🗄️ Postgres: **localhost:5432** (acessível via DBeaver/psql — user `moeda`, db `moeda_estudantil`, senha `moeda`)

### Resetar dados

Os dados persistem em volume nomeado `moeda-postgres-data` entre reinícios. Pra zerar:

```powershell
docker compose down -v       # remove volume
docker compose up --build    # DataInitializer recria seeds
```

### 🔑 Credenciais de seed

Carregados automaticamente pelo `DataInitializer.java` na primeira subida:

| Perfil      | E-mail                          | Senha            |
|-------------|---------------------------------|------------------|
| Aluno       | `aluno.demo@pucminas.br`        | `aluno@2024`     |
| Professor   | `professor.demo@pucminas.br`    | `professor@2024` |
| Empresa A   | `empresa.demo@parceiro.com`     | `empresa@2024`   |
| Empresa B   | `empresa.demo@livraria.com`     | `empresa@2024`   |

### Arquitetura em produção

```
Browser ──:80──▶ nginx (SPA + proxy /api/*) ──▶ Spring Boot :8081 ──JDBC──▶ PostgreSQL 16
```

O bundle do frontend é buildado com `VITE_API_URL=/api` (path relativo). O Nginx faz reverse-proxy de `/api/*` → `backend:8081/api/*` na network do compose — resultado: **zero CORS preflight em produção** (same-origin).

Em dev (Vite em :5173), o backend libera CORS pra `http://localhost:5173` via `WebConfig.java` (origens configuráveis pela env `CORS_ALLOWED_ORIGINS`).

### Variáveis de ambiente

Defaults sensatos no compose. Pra customizar, copie `.env.example` → `.env`:

| Variável                | Default              |
|-------------------------|----------------------|
| `POSTGRES_DB`           | `moeda_estudantil`   |
| `POSTGRES_USER`         | `moeda`              |
| `POSTGRES_PASSWORD`     | `moeda`              |
| `CORS_ALLOWED_ORIGINS`  | depende do compose   |
| `MAIL_ENABLED`          | `false`              |

---

## 📋 Pré-requisitos (rodando SEM Docker)

Antes de começar, você vai precisar ter instalado em sua máquina:

- Java JDK 21+
- Maven (ou usar o wrapper `./mvnw` que já vem no repo)
- Node.js 20+
- npm
- Git

> Sem Docker, o backend usa **H2 file-based** em `~/.moeda-estudantil/` (não precisa instalar PostgreSQL).

---

## ⚙️ Instalação e Execução

### 1️⃣ Clone o repositório

```bash
git clone https://github.com/seu-usuario/moeda-estudantil.git
cd moeda-estudantil
```

### 2️⃣ Backend (Spring Boot)

```bash
cd backend

# Primeira execução
./mvnw spring-boot:run

# Ou usando Maven instalado
mvn spring-boot:run
```

### 3️⃣ Frontend (React + Vite)

```bash
# Em outro terminal
cd frontend

# Instale as dependências
npm install

# Execute o projeto
npm run dev
```

---

## 📁 Estrutura do Projeto

```text
moeda-estudantil/
├── backend/
│   ├── src/main/java/com/moedaestudantil/api/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── entities/
│   │   └── dto/
│   └── src/main/resources/
│       └── application.properties
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   ├── services/
│   │   ├── types/
│   │   ├── hooks/
│   │   └── lib/
│   └── package.json
│
└── README.md
```

---

## 📎 Documentos Complementares

- [Diagrama de Casos de Uso](./Modelagem/Caso%20de%20Uso/Caso%20de%20Uso%20-%20Sprint%203%20-%20Projeto%20de%20Software.png)
- [Diagrama de Classe](./Modelagem/Classe/Moeda%20Estudantil%20-%20Diagrama%20de%20Classe%20-%20Sprint%203.png)
- [Diagrama de Componentes](./Modelagem/Componentes/Componentes%20-%20Moeda%20Estudantil%20-%20Sprint%203.drawio.png)
- [Apresentação com Slides](./Apresentação/Moeda%20Estudantil%20-%20Slide%20Apresentac%CC%A7a%CC%83o%20-%20Projeto%20de%20Software.pdf)
