# 📊 Relatório de Análise Crítica do Projeto 👨‍💻

## 1. Informações do grupo
- **📚 Curso:** Engenharia de Software
- **📘 Disciplina:** Laboratório de Desenvolvimento de Software
- **📅 Período:** 4º Período
- **👨‍🏫 Professor(a):** Prof. Dr. João Paulo Carneiro Aramuni
- **👥 Membros do Grupo (analisadores):** Luiz Fernando Moreira

---

## 📁 2. Identificação do Projeto
- **Nome do projeto:** PUCPay — Sistema de Moeda Estudantil
- **Integrantes do outro grupo:** Davi Nunes Carvalho ([@Davii13](https://github.com/Davii13)) e João Victor Russo Marquito ([@joaovictorz10](https://github.com/joaovictorz10))
- **Link do repositório:** https://github.com/Davii13/PUCPay
- **Pull requests submetidos pelo seu grupo:**

  | 👤 Integrante | 🔧 Refatoração | 🔗 Link do PR |
  |--------------|---------------|----------------|
  | :octocat: <a href="https://github.com/LuizFMoreira">Luiz Fernando Moreira</a> | Extract Method (validação de envio de moedas) | https://github.com/Davii13/PUCPay/pull/1 |
  | :octocat: <a href="https://github.com/LuizFMoreira">Luiz Fernando Moreira</a> | Tratamento de erros centralizado (@RestControllerAdvice) | https://github.com/Davii13/PUCPay/pull/3 |
  | :octocat: <a href="https://github.com/LuizFMoreira">Luiz Fernando Moreira</a> | Exceções de domínio (BusinessException / status HTTP) | https://github.com/Davii13/PUCPay/pull/2 |

> [!NOTE]
> Os PRs foram submetidos via **fork** (Opção 1): `LuizFMoreira/PUCPay` → `Davii13/PUCPay:main`. Os donos não precisam aceitar.

---

## 🧱 3. Arquitetura e Tecnologias Utilizadas

O PUCPay é um sistema de mérito estudantil baseado em uma moeda virtual (**PUCCoins**), dividido em **backend** (API REST) e **frontend** (SPA), com boa separação de responsabilidades.

### 🏛️ Backend — Spring Boot
Desenvolvido em **Java 21** com **Spring Boot 3.2.5**, seguindo um padrão em camadas próximo ao **MVC**:

- **Controllers:** endpoints REST (`AuthController`, `TransacaoController`, `VantagemController`, `AdminController`, etc.).
- **Services:** regras de negócio (`TransacaoService`, `AuthService`, `VantagemService`, `GamificacaoService`, `EmailService`).
- **DAO próprio:** o grupo optou por um **padrão DAO manual** com `GenericDAO<T>` / `GenericDAOImpl<T>` sobre `EntityManager`, em vez de usar apenas Spring Data JPA. Decisão interessante e alinhada ao enunciado (que sugere ORM/DAO), embora aumente o boilerplate.
- **Models:** entidades JPA com herança **`JOINED`** do Hibernate (`Usuario` como base de `Aluno`, `Professor`, `Empresa`, `Admin`).

Tecnologias empregadas:
- Spring Boot 3.2.5, Spring Web, Spring Data JPA / Hibernate
- **PostgreSQL** (produção/dev via Docker) e **H2** (testes)
- **RabbitMQ** (Spring AMQP) — envio de e-mail de cupom de forma **assíncrona** (produtor em `TransacaoService`, consumidor em `EmailQueueConsumer`)
- **Spring Mail** (`JavaMailSender`) com _fallback_ para modo simulado (log em console) quando o SMTP não está configurado — bom para desenvolvimento
- **Lombok**

### 🎨 Frontend — React + Vite (não Next.js)
Diferente do exemplo do template, o frontend **não** usa Next.js nem Thymeleaf: é uma **SPA React 18 + Vite + TypeScript**, com:
- Context API para estado global (autenticação/perfil)
- React Router para rotas protegidas por `role`
- Tailwind CSS + Radix UI + Lucide + Framer Motion
- **`react-qr-code`** para renderizar o QR Code do cupom (validação presencial)

### 🐳 Infraestrutura
- `docker-compose.yml` completo: PostgreSQL, RabbitMQ, backend e frontend, com healthchecks e volumes persistentes.
- Dockerfiles multi-stage para backend (Maven → Temurin JRE) e frontend (Node → Nginx).

### 🔗 Integração entre camadas
O frontend consome a API REST do backend; o QR Code é gerado a partir da URL de validação do cupom. O envio de e-mails de cupom é desacoplado via fila RabbitMQ.

**Pontos fortes:** separação clara de camadas, uso de fila para desacoplar e-mail, Docker Compose funcional, gamificação (XP/badges) e QR Code implementados.

---

## 🗂️ 4. Organização do GitHub e Fluxo de Trabalho Colaborativo

### 4.1. Estrutura do Repositório e Documentação
- **Estrutura de pastas:** clara — `codigo/back-end/...` e `codigo/front-end/...` separados, `modelagem/` com diagramas (UML, ER, casos de uso, componentes, implantação) e diagramas de sequência em `.puml`.
- **Documentação:** o `README.md` é **completo e bem escrito** (descrição, arquitetura, ERD em Mermaid, stack com versões, endpoints, como executar, autores).
- ⚠️ **Divergência doc × código:** o README descreve um pacote `exception/` de tratamento de erros que **não existia** no código (corrigido pela Refatoração 2/3). O README ainda repete a seção "Estrutura de Pastas" duas vezes.

### 4.2. Gerenciamento de Tarefas (Issues)
- Não há uso visível de **Issues**, **labels** ou **milestones** para rastrear backlog e priorização.

### 4.3. Fluxo de Trabalho (Pull Requests e Branches)
- O histórico é majoritariamente de commits diretos na `main`; não há evidência de _feature branches_ ou revisão de código via PR interno.

### 4.4. Padrões de Commits e Versionamento
- **Sem padrão de commits:** mensagens como `att`, `docker`, `front e back` não seguem **Conventional Commits**, prejudicando rastreabilidade.
- **Sem Tags/Releases** marcando versões estáveis (ex.: `v1.0.0`).

> **Sugestão:** adotar Conventional Commits e passar a usar branches + PRs internos melhoraria muito a rastreabilidade e a geração de changelogs.

---

## 🖥️ 5. Dificuldade para Configuração do Ambiente

### 5.1. Requisitos de Linguagem e Ferramentas de Build
- **Java 21** (documentado no README e no `pom.xml`) — atenção para quem tenta rodar com JDKs mais antigos.
- Build com **Maven Wrapper** (`./mvnw`), sem necessidade de instalar Maven globalmente. O `compile` resolveu as dependências sem problemas.

### 5.2. Persistência e Variáveis de Ambiente
- Há `.env.example` na raiz cobrindo banco (PostgreSQL), e-mail (SMTP) e RabbitMQ — bom ponto de partida.
- **PostgreSQL + RabbitMQ** são necessários; a forma mais simples é subir tudo via `docker-compose up --build`.
- O **e-mail cai em modo simulado** (log em console) se `spring.mail.username` não estiver configurado — evita falha de startup em ambiente de laboratório. Bem resolvido.

### 5.3. Passos para subir (verificados)
1. `git clone` + configurar `.env` a partir de `.env.example`.
2. `docker-compose up --build` (sobe Postgres, RabbitMQ, backend e frontend) **ou**, para rodar só o backend: `cd codigo/back-end/WebSystem/WebSystem && ./mvnw spring-boot:run` (exige Postgres/RabbitMQ acessíveis).
3. Frontend local: `cd codigo/front-end && npm install && npm run dev` (porta 5173).

Conclusão: o ambiente é **relativamente fácil de subir** graças ao Docker Compose e ao `.env.example`, desde que o Docker esteja disponível.

---

## 🐛 6. Análise de Qualidade do Código e Testes

### 6.1. Design e Princípios SOLID
- **Long Method / SRP:** `TransacaoService.enviarMoedas` mistura validação, movimentação de saldo, persistência e notificação num só método. → **Refatoração 1**.
  - Evidência: `service/TransacaoService.java` (método `enviarMoedas`, ~linhas 48–106).
- **Código duplicado:** o mesmo bloco `catch (RuntimeException e)` com JSON montado por String aparece em vários controllers. → **Refatoração 2**.
  - Evidência: `controller/TransacaoController.java` (4×), `controller/AdminController.java`, `controller/AuthController.java`.
- **Exceções pouco expressivas:** uso de `RuntimeException` genérica para toda regra de negócio, impedindo distinguir 400/401/500. → **Refatoração 3**.

### 6.2. Testabilidade e Cobertura
- **Cobertura praticamente nula:** o único teste é `WebSystemApplicationTests.contextLoads()` (vazio). Não há testes unitários da camada Service nem de integração de endpoints.
  - Evidência: `src/test/java/br/PUCPay/WebSystem/WebSystemApplicationTests.java`.
- A extração de validação (Refatoração 1) já facilita escrever testes unitários da regra de negócio.

### 6.3. Segurança e Tratamento de Erros (OWASP)
- **JSON de erro frágil:** montar `"{\"error\": \"" + e.getMessage() + "\"}"` gera **JSON inválido** se a mensagem tiver aspas/quebra de linha. → corrigido na **Refatoração 2** (serialização via Jackson).
- **Senhas em texto puro:** `AuthService.login` compara `usuario.getSenha().equals(dto.getSenha())` — indica senha **não criptografada** no banco. Recomenda-se **BCrypt** (`PasswordEncoder`).
  - Evidência: `service/AuthService.java` (~linha 23).
- **Logging:** uso de `System.err.println` / `System.out.println` em vez de um logger (SLF4J), dificultando controle de nível e observabilidade.
- **Tratamento de exceções:** antes das refatorações, todo erro virava 400/401 improvisado; agora há mapeamento explícito por tipo (400/401/500).

---

## 🚀 7. Sugestões de Melhorias

1. **Segurança de credenciais:** aplicar **BCrypt** para hash de senha em cadastro e login (hoje a comparação é em texto puro).
2. **Testes automatizados:** cobrir a camada **Service** (ex.: `TransacaoService`) com JUnit + Mockito e endpoints com `@SpringBootTest`/MockMvc, mirando ≥ 80% nas funcionalidades críticas.
3. **Padronização:** adotar **Conventional Commits** e ferramentas como **Spotless/Checkstyle/SonarLint** para consistência e detecção automática de code smells.
4. **Tratamento de erros unificado:** estender o `@RestControllerAdvice` (introduzido nas Refatorações 2 e 3) a **todos** os controllers restantes (`Professor`, `Empresa`, `Vantagem`, `Gamificacao`), removendo os `try/catch` locais.
5. **Logging estruturado:** trocar `System.out/err.println` por **SLF4J** com níveis apropriados.
6. **Organização do repositório:** usar **branches + PRs internos**, **Issues** com labels/milestones e **Tags/Releases** para marcar versões.
7. **CI/CD:** criar pipeline no **GitHub Actions** para build, testes e verificação de estilo a cada PR.

---

## 🔧 8. Refatorações Propostas (3 partes do código)

### 1️⃣ Refatoração 1 — Extract Method (validação de envio de moedas)

**Arquivo:** `codigo/back-end/WebSystem/WebSystem/src/main/java/br/PUCPay/WebSystem/service/TransacaoService.java`
**Pull Request:** https://github.com/Davii13/PUCPay/pull/1

#### 🔴 Antes
```java
public Transacao enviarMoedas(EnviarMoedasDTO dto) {
    // ... busca professor e aluno ...
    if (dto.getMensagem() == null || dto.getMensagem().isBlank()) {
        throw new RuntimeException("A mensagem é obrigatória");
    }
    if (dto.getValor() <= 0) {
        throw new RuntimeException("O valor enviado deve ser maior que zero");
    }
    if (professor.getSaldo() < dto.getValor()) {
        throw new RuntimeException("Saldo insuficiente. Saldo atual: " + professor.getSaldo());
    }
    // ... movimenta saldo, persiste, notifica ...
}
```

#### 🟢 Depois
```java
public Transacao enviarMoedas(EnviarMoedasDTO dto) {
    // ... busca professor e aluno ...
    validarEnvioMoedas(dto, professor);
    // ... movimenta saldo, persiste, notifica ...
}

private void validarEnvioMoedas(EnviarMoedasDTO dto, Professor professor) {
    if (dto.getMensagem() == null || dto.getMensagem().isBlank()) {
        throw new RuntimeException("A mensagem é obrigatória");
    }
    if (dto.getValor() <= 0) {
        throw new RuntimeException("O valor enviado deve ser maior que zero");
    }
    if (professor.getSaldo() < dto.getValor()) {
        throw new RuntimeException("Saldo insuficiente. Saldo atual: " + professor.getSaldo());
    }
}
```

#### ✅ Tipo de refatoração aplicada
- **Extract Method**

#### 📝 Justificativa
Melhora a clareza, separa validação da lógica de persistência/notificação (SRP) e torna as regras testáveis isoladamente.

---

### 2️⃣ Refatoração 2 — Remoção de Código Duplicado (tratamento de erro centralizado)

**Arquivos:** `controller/TransacaoController.java`, `controller/AdminController.java` + novo `exception/GlobalExceptionHandler.java`
**Pull Request:** https://github.com/Davii13/PUCPay/pull/3

#### 🔴 Antes (repetido em vários controllers)
```java
@PostMapping("/enviar")
public ResponseEntity<?> enviarMoedas(@RequestBody EnviarMoedasDTO dto) {
    try {
        return ResponseEntity.ok(transacaoService.enviarMoedas(dto));
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body("{\"error\": \"" + e.getMessage() + "\"}");
    }
}
```

#### 🟢 Depois
```java
// Controller: focado no caso de sucesso
@PostMapping("/enviar")
public ResponseEntity<Transacao> enviarMoedas(@RequestBody EnviarMoedasDTO dto) {
    return ResponseEntity.ok(transacaoService.enviarMoedas(dto));
}

// Novo GlobalExceptionHandler (@RestControllerAdvice)
@ExceptionHandler(RuntimeException.class)
public ResponseEntity<ErrorResponseDTO> handle(RuntimeException ex, HttpServletRequest req) {
    ErrorResponseDTO body = new ErrorResponseDTO(
        HttpStatus.BAD_REQUEST.value(), ex.getMessage(),
        HttpStatus.BAD_REQUEST.getReasonPhrase(), LocalDateTime.now(), req.getRequestURI());
    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
}
```

#### ✅ Tipo de refatoração aplicada
- **Replace Duplicated Code / Introduce Global Error Handling**

#### 📝 Justificativa
Elimina duplicação (DRY), padroniza o formato de erro e **corrige o JSON quebrado** (a concatenação de String falhava com aspas/quebras de linha na mensagem). Reusa o `ErrorResponseDTO` já existente e cria o pacote `exception` documentado no README.

---

### 3️⃣ Refatoração 3 — Exceções de Domínio no lugar de RuntimeException genérica

**Arquivos:** `exception/BusinessException.java`, `exception/UnauthorizedException.java`, `exception/GlobalExceptionHandler.java`, `service/TransacaoService.java`, `service/AuthService.java`, `controller/AuthController.java`
**Pull Request:** https://github.com/Davii13/PUCPay/pull/2

#### 🔴 Antes
```java
// Service
throw new RuntimeException("Saldo insuficiente...");        // regra de negócio
throw new RuntimeException("Senha incorreta");              // autenticação

// AuthController
} catch (RuntimeException e) {
    return ResponseEntity.status(401).body("{\"error\": \"" + e.getMessage() + "\"}");
}
```

#### 🟢 Depois
```java
// Service
throw new BusinessException("Saldo insuficiente...");       // -> HTTP 400
throw new UnauthorizedException("Senha incorreta");         // -> HTTP 401

// AuthController: sem try/catch; status vem do handler
@PostMapping("/login")
public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO dto) {
    return ResponseEntity.ok(authService.login(dto));
}

// GlobalExceptionHandler mapeia:
// BusinessException -> 400 | UnauthorizedException -> 401 | RuntimeException -> 500
```

#### ✅ Tipo de refatoração aplicada
- **Replace Generic Exception with Domain Exception**

#### 📝 Justificativa
Torna o código mais expressivo e garante **status HTTP corretos**, evitando que falhas internas (500) sejam mascaradas como erro de cliente (400) e preservando o 401 do login de forma explícita.

---

## 9. 📚 Conclusão

O PUCPay é um projeto **maduro e bem estruturado**: arquitetura em camadas clara, uso acertado de DAO e herança JPA `JOINED`, desacoplamento de e-mail via RabbitMQ, QR Code para cupons, gamificação e um ambiente reprodutível via Docker Compose. A documentação (README) é um destaque positivo.

Os principais pontos de melhoria estão na **qualidade interna e segurança**: ausência de testes automatizados, senhas em texto puro, logging via `System.out/err`, e tratamento de erros duplicado/frágil. As três refatorações propostas atacam justamente a **manutenibilidade** (Extract Method, DRY) e a **robustez/semântica** (exceções de domínio + status HTTP corretos + JSON de erro válido), sem alterar o comportamento externo esperado. Complementadas pelas sugestões da Seção 7 (BCrypt, testes, CI/CD, padronização de commits), elevam o projeto a um padrão profissional.

---

## 10. 🔗 Referências
- Revisando alterações em Pull Requests:
  https://docs.github.com/pt/pull-requests/collaborating-with-pull-requests/reviewing-changes-in-pull-requests/commenting-on-a-pull-request
- Conventional Commits:
  https://www.conventionalcommits.org/pt-br/v1.0.0/
- Documentação do Spring Boot:
  https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/
- OWASP Cheat Sheets:
  https://cheatsheetseries.owasp.org/

---
