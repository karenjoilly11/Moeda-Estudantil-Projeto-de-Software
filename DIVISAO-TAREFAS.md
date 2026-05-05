# Divisão de Tarefas — Sistema de Moeda Estudantil (Lab03)

> Divisão equilibrada do trabalho restante entre **Josué, Karen e Luiz**, considerando apenas o que está commitado em HEAD. Cada pacote mistura backend + frontend + documentação para manter dificuldade e carga equivalentes (**10 / 10 / 10**).

---

## Estado atual (apenas HEAD commitado)

### Backend já feito
- Entities: `Usuario`, `Aluno`, `Professor`, `Instituicao`
- Controllers: `AlunoController` (cadastro, login, extrato, resgatar — *stubs*), `ProfessorController` (login, enviar-moedas, extrato, alunos — *stubs*), `InstituicaoController`, `UsuarioController`
- Services: `AlunoService` (cadastrar, login), `ProfessorService` (login)
- Repositories de Aluno, Professor, Instituicao, Usuario
- DTOs de aluno e professor
- Config: `DataInitializer`, `WebConfig`
- Enum `TipoUsuario`

### Backend faltando
- Entities `Empresa`, `Vantagem`, `Transacao` (+ repos, DTOs, enum `TipoTransacao`)
- Services `EmpresaService`, `VantagemService`, `TransacaoService` (envio, resgate, extratos, cupom)
- Controllers `EmpresaController`, `VantagemController`
- Email/notificações (recebimento de moeda; cupom para aluno e empresa no resgate)
- Distribuição semestral acumulável de 1000 moedas ao professor

### Frontend já feito
- Aluno: `AlunoAuthContext`, `AlunoLogin`, `AlunoCadastro`, `AlunoDashboard` (abas Início / Marketplace / Extrato com dados mockados)
- `App.jsx` com rotas e `PrivateRoute` (stub vazio)
- `api.js` (axios + interceptor token aluno), `instituicaoService.js`
- `Aluno.css` completo

### Frontend faltando
- Módulo Professor (context, login, dashboard, enviar moedas, extrato + CSS)
- Módulo Empresa (context, cadastro, login, dashboard, CRUD vantagens + CSS)
- Landing page na rota `/`
- `PrivateRoute` funcional
- Services: alunoService, professorService, empresaService, vantagemService
- Integração real do AlunoDashboard com endpoints de Vantagens e Transações

---

## 🟦 Pacote Josué — eixo "Empresa & Marketplace"
**Esforço estimado: 10/10**

### Backend
- Entity `Empresa` (extends Usuario) + `EmpresaRepository` + DTOs (`EmpresaCadastroDTO`, `EmpresaResponseDTO`, `EmpresaLoginResponseDTO`)
- `EmpresaService` (cadastro com validação CNPJ, login, hash de senha)
- `EmpresaController` (`POST /cadastro`, `POST /login`, `GET /{id}/vantagens`)
- Entity `Vantagem` (foto, descrição, custo, vínculo com Empresa) + `VantagemRepository` + `VantagemDTO`
- Endpoints CRUD de vantagens em EmpresaController (`POST/PUT/DELETE /vantagens`)

### Frontend
- `EmpresaAuthContext.jsx` (espelhando padrão de `AlunoAuthContext`)
- `EmpresaLogin.jsx`, `EmpresaCadastro.jsx`, `EmpresaDashboard.jsx`
- Tela CRUD de vantagens (listar, criar com upload de foto, editar, remover)
- `Empresa.css`
- `services/empresaService.js` e `services/vantagemService.js`

### Documentação
- README atualizado (instruções de execução back+front, variáveis `application.properties`, scripts npm/maven)
- Fatia da apresentação: tutorial **Spring Boot + JPA + H2/Postgres** (~7 min)

---

## 🟨 Pacote Karen — eixo "Professor & Distribuição de Moedas"
**Esforço estimado: 10/10**

### Backend
- Entity `Transacao` + Enum `TipoTransacao` (ENVIO, RESGATE) + `TransacaoRepository` — **owner** desse contrato (Luiz consome)
- DTO `EnviarMoedasDTO`, `TransacaoDTO`
- Implementar `ProfessorService.enviarMoedas` (validação de saldo, criação de Transacao, débito do professor, crédito ao aluno, mensagem obrigatória)
- Implementar `ProfessorService.extrato` (lista de transações enviadas + saldo atual)
- Lógica de **distribuição semestral acumulável** de 1000 moedas (endpoint admin ou `@Scheduled` + campo `ultimoSemestreCreditado` em `Professor`)

### Frontend
- `ProfessorAuthContext.jsx`
- `ProfessorLogin.jsx`, `ProfessorDashboard.jsx`
- Tela `EnviarMoedas.jsx` (seletor de aluno + valor + textarea de motivo obrigatório)
- Tela `ExtratoProfessor.jsx`
- `Professor.css`
- `services/professorService.js`
- **`PrivateRoute.jsx` funcional e genérico** (atende os 3 perfis — entrega que Josué e Luiz vão consumir)

### Documentação
- Atualização dos **diagramas UML** (Classes + Sequência dos casos de uso de envio e resgate) conforme implementação final
- Fatia da apresentação: tutorial **React + Context API + axios** (~7 min)

---

## 🟩 Pacote Luiz — eixo "Resgate, Notificações & Integração"
**Esforço estimado: 10/10**

### Backend
- `VantagemService` (listagem pública filtrável para marketplace)
- `VantagemController` (`GET /listar`, `GET /validar/{cupom}`)
- `TransacaoService.resgatar` (validar saldo do aluno, debitar, gerar **código de cupom único**, persistir Resgate, marcar status)
- `TransacaoService.extratoAluno`
- DTO `ResgateDTO`
- **Serviço de email/notificações** (`JavaMailSender` ou stub com log):
  - aluno notificado ao receber moeda
  - aluno recebe cupom no resgate
  - empresa recebe notificação com o código

### Frontend
- **Landing page** na rota `/` com 3 entradas (aluno / professor / empresa)
- Refatorar `AlunoDashboard`:
  - aba Marketplace consumindo endpoint real de Vantagens
  - aba Extrato consumindo endpoint real de Transações
  - fluxo de resgate exibindo cupom retornado pelo backend
- `services/alunoService.js` (extrair chamadas hoje inline)

### Documentação
- **Slides de arquitetura do sistema e camada de persistência** (entrega central do Lab03S03)
- Fatia da apresentação: tutorial **integração/notificações por email + execução local** (~7 min)

---

## 🤝 Tarefas compartilhadas (coordenação)

1. **Contrato `Transacao` + `TipoTransacao`** — Karen cria primeiro e congela os campos (origem, destino, tipo, valor, data, codigoCupom, status, mensagem). Luiz consome no resgate. Combinar antes de começar os services.
2. **Padrão de autenticação** — Josué (Empresa) e Karen (Professor) replicam o padrão JWT/interceptor já usado em `AlunoAuthContext`. Reunião de 30min para alinhar.
3. **`PrivateRoute` genérico** — Karen entrega; Josué e Luiz adotam nas suas rotas.
4. **Apresentação final ~20min** — cada um apresenta sua fatia de tutorial; Luiz amarra com os slides de arquitetura no início.

---

## 📅 Ordem de execução sugerida

### Fase 1 (paralelo, dias 1–2) — fundação, sem dependências cruzadas
- **Josué:** Entity Empresa + Vantagem + repos
- **Karen:** Entity Transacao + Enum (entrega contrato para Luiz), scaffold do módulo Professor frontend
- **Luiz:** Landing page + esqueleto de VantagemService (leitura)

### Fase 2 (paralelo, dias 3–5) — regras de negócio
- **Josué:** EmpresaController + CRUD Vantagens (back+front)
- **Karen:** enviarMoedas + distribuição semestral + tela EnviarMoedas
- **Luiz:** resgatar + cupom + notificações + integração AlunoDashboard

### Fase 3 (dias 6–7) — fechamento conjunto
- Karen finaliza UML, Luiz finaliza slides de arquitetura, Josué finaliza README
- Teste end-to-end dos 3 fluxos (professor → aluno → empresa) em conjunto
- Ensaio da apresentação

---

## ⚖️ Justificativa do equilíbrio

| Componente | Josué | Karen | Luiz |
|---|---|---|---|
| Entity nova com regra de negócio | Empresa + Vantagem | Transacao + distribuição semestral | Resgate + cupom + email |
| Módulo frontend de auth + dashboard + tela extra | Empresa CRUD | Professor EnviarMoedas + Extrato | Landing + integração AlunoDashboard |
| Entrega de documentação visível | README | UML | Slides de arquitetura |
| Fatia de tutorial na apresentação | ~7 min Spring/JPA | ~7 min React/Context | ~7 min Email/Deploy |

Nenhum pacote é "só CRUD" nem "só tela". Cargas estimadas: **10 / 10 / 10**.

---

## ✅ Verificação end-to-end

- Backend: `cd backend && ./mvnw spring-boot:run` — testar endpoints novos via Postman/Insomnia
- Frontend: `cd frontend && npm run dev`
- Fluxo completo: professor envia → aluno recebe notificação → aluno resgata vantagem → empresa recebe email com cupom
- Conferir que saldos batem após cada transação
- Conferir que a distribuição semestral credita +1000 e acumula se não usado
