# Relatório QA — Moeda Estudantil

**Data**: 2026-05-14
**Build testado**: df232bf
**Ambiente**: Backend http://localhost:8081 (Spring Boot 3.4.4 + Java 21 + H2), Frontend http://localhost:5173 (React + Vite)
**QA**: Auditoria completa em 6 fases (health, mapeamento, funcional, estática, code review, UX)

---

## Resumo Executivo

- **Total de testes executados**: 33
- **Passou**: 26
- **Falhou / com problema**: 7
- **Status**: 🔴 **CRÍTICO** — IDOR generalizado, qualquer usuário autenticado pode editar/deletar contas alheias e gastar moedas de outros alunos.

### Top 3 problemas urgentes

1. **[P0-001] IDOR generalizado em todos os endpoints de perfil / delete / resgate** — backend ignora o token e usa o `id` da URL/body. Qualquer aluno pode editar outro aluno, deletar conta alheia, ou resgatar vantagem gastando saldo de outro aluno.
2. **[P0-002] IDOR em criação de Vantagem** — empresa logada pode cadastrar vantagem com `empresaId` de outra empresa no body (POST `/api/vantagem`).
3. **[P1-003] Endpoints inexistentes referenciados no frontend** — `alunoService.alterarSenha()` chama `PUT /api/aluno/senha` que não existe; `professorService.buscarDados()` chama `GET /api/professor/{id}` que não existe.

---

## Priorização

- **P0 (bloqueante / segurança crítica)**: 2
- **P1 (crítico Lab04 / bug funcional)**: 2
- **P2 (importante)**: 3
- **P3 (cosmético / cleanup)**: 3

---

## Bugs encontrados

### [P0-001] IDOR generalizado: qualquer usuário edita/deleta/resgata em nome de outro

**Categoria**: Segurança / AuthZ

**Reprodução**:
1. Login como `aluno.demo@pucminas.br` → obter token A (id=8)
2. `PUT /api/aluno/perfil/12` com token A e body com nome novo → **200 OK**, aluno 12 alterado
3. `DELETE /api/aluno/12` com token A → **200 OK**, conta apagada
4. Criar Aluno B → login B → `POST /api/transacao/resgatar` `{alunoId:8, vantagemId:2}` usando token de B → **200 OK**, gera cupom em nome de A e debita saldo de A (411 → 272)
5. Empresa 7 logada faz `PUT /api/empresa/perfil/6` com nome="HACKED LIVRARIA" → 200 OK, empresa 6 alterada

**Esperado**: 403 Forbidden quando `id` da URL/body ≠ id do dono do token.

**Atual**: Todas as operações concluem com 200.

**Arquivos**:
- `backend/src/main/java/com/moedaestudantil/api/controller/AlunoController.java:38` (PUT /perfil/{id})
- `backend/src/main/java/com/moedaestudantil/api/controller/AlunoController.java:60` (DELETE /{id})
- `backend/src/main/java/com/moedaestudantil/api/controller/EmpresaController.java:72` (PUT /perfil/{id})
- `backend/src/main/java/com/moedaestudantil/api/controller/EmpresaController.java:81` (DELETE /{id})
- `backend/src/main/java/com/moedaestudantil/api/controller/TransacaoController.java:19` (POST /resgatar)

**Sugestão de fix**: Adotar o mesmo padrão de `ProfessorController.extractProfessorIdFromToken()` em todos os endpoints sensíveis. Extrair o id do dono via `@RequestHeader("Authorization")`, comparar com o id da URL/body e rejeitar com `ResponseEntity.status(403)` se divergir. Centralizar em um filtro / interceptor / `@PreAuthorize` para evitar duplicação.

---

### [P0-002] IDOR em criação/edição/exclusão de Vantagem (empresa)

**Categoria**: Segurança / AuthZ

**Reprodução**:
1. Login `empresa.demo@parceiro.com` (id=7) → token T7
2. `POST /api/vantagem` com `{"nome":"IDOR-attack","custoMoedas":5,"empresaId":6}` com header `Authorization: Bearer T7` → **200 OK**, criada vantagem id=10 vinculada à empresa 6 (Livraria Cultura)
3. GET `/api/empresa/6/vantagens` confirma: catálogo da Livraria contém vantagem plantada pelo Parceiro.

**Esperado**: 403 ou ignorar `empresaId` do body e derivar do token.

**Atual**: 200 OK, vantagem persiste sob empresa alheia.

**Arquivo**: `backend/src/main/java/com/moedaestudantil/api/controller/VantagemController.java:23`

**Sugestão de fix**: No `VantagemController.cadastrar()`, extrair `empresaId` do token (igual ao `ProfessorController`) e ignorar/validar o valor do DTO. Mesmo problema vale para `PUT /vantagem/{id}` e `DELETE /vantagem/{id}` — não há validação de dono.

---

### [P1-003] Frontend chama endpoints inexistentes no backend

**Categoria**: Bug funcional / 404 silencioso

**Reprodução**:
- `alunoService.alterarSenha()` → `PUT /api/aluno/senha` (linha 49 de `alunoService.ts`) — não existe no `AlunoController`. Resultará em 404 / 405 quando tela de "alterar senha" for usada.
- `professorService.buscarDados(id)` → `GET /api/professor/{id}` (linha 42 de `professorService.ts`) — `ProfessorController` não tem endpoint `/{id}`. Vai 404.

**Esperado**: ou implementar no backend, ou remover do frontend.

**Atual**: dead code / falha em runtime quando chamado.

**Arquivos**:
- `frontend/src/services/alunoService.ts:49`
- `frontend/src/services/professorService.ts:41-44`

**Sugestão de fix**: Remover `alterarSenha` e `professorService.buscarDados` enquanto os endpoints não existirem, ou adicionar `@PutMapping("/senha")` em `AlunoController` (e `@GetMapping("/{id}")` em `ProfessorController`).

---

### [P1-004] `enviar-moedas` sem header Authorization retorna 400, deveria ser 401

**Categoria**: HTTP semantics / UX

**Reprodução**:
- `POST /api/professor/enviar-moedas` sem header `Authorization` → **400 Bad Request** com body vazio
- Mesma rota com `Bearer tokenbobo123` → **400** "Professor não encontrado"

**Esperado**: 401 Unauthorized para token ausente/inválido (ou 403).

**Atual**: 400 — frontend (`ProfessorDashboard.handleSend`) só trata 401 como "sessão expirada"; nesse cenário cai no fallback genérico "Erro ao enviar moedas".

**Arquivo**: `backend/src/main/java/com/moedaestudantil/api/controller/ProfessorController.java:29-39`

**Sugestão de fix**: capturar especificamente ausência do header e token Base64 inválido / professor inexistente, retornando `ResponseEntity.status(401)`.

---

### [P2-005] Hardcoded fallback `http://localhost:8080` quando `.env.local` ausente

**Categoria**: DX / Onboarding

**Reprodução**:
- `frontend/src/lib/api.ts:4` — `API_BASE = VITE_API_URL || "http://localhost:8080/api"`
- Backend roda em **8081**. Novo desenvolvedor sem `.env.local` cai numa porta que não existe.

**Arquivo**: `frontend/src/lib/api.ts:3-4`

**Sugestão de fix**: trocar fallback para `8081`, ou criar `.env.example` versionado, ou jogar erro explícito se `VITE_API_URL` ausente em build.

---

### [P2-006] Cadastro de aluno sem Bean Validation no DTO

**Categoria**: Validação

**Reprodução**:
- `AlunoCadastroDTO.java` não tem nenhuma anotação `@NotBlank` / `@Email` / `@CPF`. Controller não usa `@Valid`. Aceita CPF de 4 dígitos, email malformado, nome vazio etc.

**Arquivo**: `backend/src/main/java/com/moedaestudantil/api/dto/AlunoCadastroDTO.java:1-16`

**Sugestão de fix**: adicionar `@NotBlank` / `@Email` / `@Size` no DTO e `@Valid` no controller (igual já existe em `VantagemCadastroDTO`). Checar unicidade de email/CPF no service.

---

### [P2-007] Dados de "teste de auditoria" anterior poluem o seed

**Categoria**: Data hygiene

**Reprodução**:
- `GET /api/vantagem` retorna vantagens id=6 ("IDOR test"), id=7 ("No Auth"), id=8 ("Carissima 99999") criadas em testes anteriores e persistidas no H2 file-based (`~/.moeda-estudantil/`).

**Arquivo**: `~/.moeda-estudantil/` (DB persistente)

**Sugestão de fix**: documentar comando pra resetar (apagar pasta `~/.moeda-estudantil/`), ou criar perfil `dev` com H2 in-memory. Reset antes de release/demo.

---

### [P3-008] `System.out.println` com emojis em controllers / data initializer

**Categoria**: Logging

**Reprodução**:
- `AlunoController.java:43, 63, 65, 68` e `DataInitializer.java` (várias) usam `System.out` com emojis (check, lixeira, X).

**Sugestão de fix**: substituir por SLF4J (`log.info(...)`).

---

### [P3-009] Sem máscara/validação de CPF no front

Já coberto pelo P2-006. Marcando separado pq aparece no front também: `AlunoCadastro.tsx` não tem máscara de CPF.

---

### [P3-010] Backend não escapa nem sanitiza mensagem com HTML

Mensagem `<script>alert(1)</script>` no envio de moedas foi persistida raw (status 200). React renderiza como texto literal por default → **XSS não-explorável via UI atual**. Mas se algum dia alguém usar `dangerouslySetInnerHTML` em `mensagem`, vira explorável.

**Arquivo**: `backend/src/main/java/com/moedaestudantil/api/controller/ProfessorController.java:29-39`

**Sugestão de fix**: sanitizar mensagem no service (Jsoup `Safelist.none()`) ou rejeitar `<` `>` no padrão. Documentar para nunca usar `dangerouslySetInnerHTML` na renderização.

---

## Testes que passaram

| ID | Cenário | Status |
|---|---|---|
| AUTH-01 | Login aluno demo válido | 200 OK |
| AUTH-02 | Login professor demo válido | 200 OK |
| AUTH-03 | Login empresa demo válido | 200 OK |
| AUTH-04 | Login senha errada → 400 "Email ou senha inválidos!" | OK |
| AUTH-05 | Login email inexistente → 400 | OK |
| AUTH-06 | Cadastro novo aluno | 200, id=12 |
| ENV-01 | Envio 10 moedas válido → saldo 989 → 979 | OK |
| ENV-02 | Envio sem mensagem → 400 "Mensagem de reconhecimento é obrigatória" | OK |
| ENV-03 | Envio 99999 → 400 "Saldo insuficiente" | OK |
| CRUD-01 | POST vantagem token empresa → 200, id=9 | OK |
| CRUD-02 | POST vantagem sem nome → 400 (Bean Validation) | OK |
| CRUD-03a | POST vantagem custoMoedas=0 → 400 (@Positive) | OK |
| CRUD-03b | POST vantagem custoMoedas=-5 → 400 | OK |
| CRUD-04 | GET /empresa/{id}/vantagens contém vantagem criada | OK |
| CRUD-05 | PUT /vantagem/{id} → 200 atualizada | OK |
| CRUD-06 | DELETE /vantagem/{id} → 204 | OK |
| RES-01 | POST resgatar → cupom 8 chars ("DD3D8924") | OK |
| RES-02 | Resgate sem saldo (custo 99999) → 400 com saldo atual no texto | OK |
| RES-03 | GET validar/{cupom} → status "PENDENTE" | OK |
| RES-04 | POST utilizar/{cupom} → status "UTILIZADO" | OK |
| RES-05 | Utilizar 2x mesmo cupom → 400 "não está pendente" | OK |
| RES-06 | Validar cupom "ZZZZZZZZ" → 404 "Cupom não encontrado" | OK |
| RES-07 | GET /empresa/{id}/cupons retorna lista | OK |
| PERF-01 | Aluno edita próprio perfil → 200 | OK (mas IDOR permite alheio) |
| PERF-02 | Empresa edita próprio perfil → 200 | OK (mas IDOR permite alheio) |
| PERF-03 | Extrato aluno → 11 items | OK |
| SEC-SQL | Busca alunos com `' OR '1'='1` → 200 `[]` (JPA parametrizado) | OK |
| SEC-CORS-1 | Origin evil.com → 403 Forbidden | OK |
| SEC-CORS-2 | Preflight legit 5173 → 200, ACAO correto | OK |

---

## Análise de Código (smell)

- **Token Base64 inseguro**: `professor:timestamp` codificado em Base64 não é JWT, não tem assinatura. Qualquer um pode forjar `Base64("email@x:0")` — porém o backend faz lookup por email, então o ataque vira "se vc sabe o email do alvo, vc é ele" (não testei explicitamente, mas o código de `extractProfessorIdFromToken` em `ProfessorController.java:72-87` confirma o formato).
- **Senha Base64**: `DataInitializer.codificarSenha()` faz `Base64.getEncoder().encodeToString(senha.getBytes())`. **Isso não é hashing**. É ofuscação reversível. Usar BCrypt.
- **`api.ts` fallback hardcoded** em porta errada (8080 vs 8081).
- **Services consistentes**: `response.data` é usado consistentemente em `alunoService`, `professorService`, `transacaoService`, `empresaService`, `authService`. Refactor recente está OK.
- **Dead code**:
  - `alunoService.alterarSenha` chama endpoint inexistente.
  - `professorService.buscarDados` chama endpoint inexistente.
  - `authService.ts` parece duplicar `alunoService.login` / `empresaService.login`. Verificar qual está em uso.
- **Logging com `System.out.println`** em controllers — usar SLF4J.
- **Sem `@Valid` em `AlunoCadastroDTO`** — não há validação Bean Validation na entrada.

---

## Análise de Segurança

| Vetor | Status |
|---|---|
| **IDOR (Insecure Direct Object Reference)** | 🔴 **CRÍTICO** — perfil aluno, perfil empresa, delete aluno, delete empresa, resgate moeda, criar/editar/deletar vantagem |
| **XSS armazenado** | 🟡 **Mitigado por React** — backend aceita raw, mas UI escapa por padrão |
| **SQL Injection** | 🟢 **Protegido** (JPA parametrizado, retorno vazio para payload SQLi) |
| **CORS** | 🟢 **Restritivo** — só origins `localhost:5173-5177`, evil.com bloqueado com 403 |
| **Senhas (storage)** | 🔴 **Base64 não é hash** — dump do H2 expõe senhas plaintext. Usar BCrypt urgente |
| **Senhas (login)** | 🟡 Resposta genérica "Email ou senha inválidos!" para ambos os casos (bom contra user enum) |
| **Token (Bearer)** | 🟡 Base64 simétrico sem assinatura, formato `email:timestamp`. Forjável; mitigado pelo lookup. Migrar para JWT assinado |
| **HTTP status semantics** | 🟡 Erros de auth retornam 400 em vez de 401/403 |
| **CSRF** | 🟢 Bearer token via localStorage, não cookies → CSRF clássico não aplicável |

---

## Análise de UX

- **Mensagens de erro**:
  - OK Resgate sem saldo: `"Saldo insuficiente. Saldo atual: 372.0 | Custo: 99999.0"` — clara, contextual.
  - OK Cupom já utilizado: `"Cupom não está pendente (status atual: UTILIZADO)"` — claro.
  - Ruim: Sem auth no envio moedas: 400 com body vazio + frontend cai em fallback genérico.
- **Loadings**:
  - OK `ProfessorDashboard`: `sendingCoins` desabilita botão, `loadingHistory` mostra spinner, `loadingStudents` exibe placeholder.
  - OK `CompanyDashboard`: `submitting` no botão criar.
  - OK `StudentDashboard`: `processandoResgate` no botão resgatar.
- **Disabled em estados inválidos**: OK professor: `disabled={!selectedStudent || amount === 0 || !reason.trim() || sendingCoins || amount > saldoMoedas}` está completo.
- **Erros (ApiError)**: OK frontend faz parse de `err.body` como string para mensagem específica do backend.
- **Saldo insuficiente UI**: OK `StudentDashboard.tsx:459` exibe "sem saldo" no botão.

---

## Recomendações priorizadas

### 1. Fix imediato (P0+P1) — antes de entregar Lab04

1. **Implementar checagem de propriedade nos endpoints sensíveis** (P0-001, P0-002): criar `@Component AuthGuard` ou helper que extraia id do token e compare com `pathVariable`/`body`. Aplicar em: `AlunoController.atualizarPerfilComId`, `AlunoController.excluirConta`, `EmpresaController.atualizarPerfil`, `EmpresaController.excluirConta`, `VantagemController.cadastrar/atualizar/remover`, `TransacaoController.resgatar`.
2. **Remover ou implementar** `alunoService.alterarSenha` e `professorService.buscarDados` (P1-003).
3. **Auth errors → 401**: trocar `badRequest()` por `status(401)` em `ProfessorController.enviarMoedas` para token inválido/ausente (P1-004).

### 2. Próxima sprint (P2)

4. Migrar senha de Base64 para **BCrypt** (`PasswordEncoder` bean) — alterar `DataInitializer.codificarSenha` e `*Service.login`.
5. Adicionar **JWT assinado** ou pelo menos HMAC no token Base64 (validar timestamp).
6. Corrigir fallback de porta em `api.ts` (P2-005) e adicionar `.env.example`.
7. Adicionar `@Valid` + Bean Validation em `AlunoCadastroDTO` e `EmpresaCadastroDTO` (P2-006).
8. Reset do H2 antes da demo (apagar `~/.moeda-estudantil/`) — P2-007.

### 3. Backlog (P3)

9. Substituir `System.out.println` por SLF4J.
10. Sanitizar HTML em mensagens de moedas (defesa em profundidade) — P3-010.
11. Máscara de CPF no front (`AlunoCadastro.tsx`).

---

## Cobertura de testes

- **JUnit backend**: 19/19 verde (informado). Não cobre os IDORs descobertos — recomendado adicionar test cases negativos por endpoint (token de A tentando acessar recurso de B).
- **Cypress E2E**: não verificado nesta auditoria; recomendar cenário de "aluno não consegue editar outro aluno".
- **Faltam**:
  - Testes de AuthZ (IDOR) — agora prioritários.
  - Teste de criação de vantagem com `empresaId` mentiroso.
  - Teste de bean validation (`@NotBlank`) para AlunoCadastroDTO.

---

## Conclusão

A aplicação **Moeda Estudantil** entrega corretamente os fluxos felizes dos Lab04S01-S03 (envio de moedas, CRUD de vantagem, resgate com cupom de 8 chars, validar/utilizar cupom). Os testes funcionais positivos passam, validações de entrada (`@NotBlank`, `@Positive`) protegem CRUD, JPA neutraliza SQLi, CORS está restritivo e a UX tem loadings, disabled-states e mensagens de erro úteis. **Porém o controle de autorização é praticamente inexistente**: qualquer usuário autenticado pode editar/deletar contas alheias e gastar saldo de outros alunos passando o `id` na URL ou body. Isso é P0 e impede uso em produção. Soma-se a isso o uso de Base64 como "hash" de senha, dead code referenciando endpoints inexistentes e fallback de porta errado no `api.ts`. **Recomendação**: bloquear release até implementar a checagem de propriedade derivada do token, e migrar senhas para BCrypt.
