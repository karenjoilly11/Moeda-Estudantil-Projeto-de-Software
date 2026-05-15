# Relatório QA V2 — Moeda Estudantil (Re-Auditoria Pós-Correções)

**Data**: 2026-05-14
**Build testado**: `7961e63` (att)
**Ambiente**: Backend localhost:8081 (H2 file), Frontend não testado (análise focada no backend)
**Metodologia**: Testes funcionais via PowerShell/Invoke-RestMethod contra API real com seeds

---

## Resumo Executivo

- **Total de verificações**: 52 (9 bugs originais revalidados + 43 novos cenários)
- **Bugs originais fechados**: 7 de 9
- **Bugs originais parcialmente fechados**: 2 de 9
- **Bugs novos encontrados**: 7
- **Status geral**: ATENCAO — aplicação funciona para o fluxo principal, mas tem 2 bugs novos P1 que comprometem a integridade dos dados antes da apresentação.

**Top 3 problemas mais urgentes:**
1. [P1-N01] POST /api/transacao/resgatar não exige autenticação — qualquer requisição sem token pode drenar saldo de qualquer aluno
2. [P1-N02] Empresa A pode validar e utilizar cupons gerados por vantagens da Empresa B — sem ownership check no cupom
3. [P2-N01] PUT /aluno/perfil e PUT /empresa/perfil aceitam email de outro usuário e vaza SQL/DDL na resposta

---

## Status dos 9 Bugs Originais

| # | Bug Original | Status | Evidência |
|---|---|---|---|
| P0-1 | IDOR aluno (PUT/DELETE sem auth) | **FECHADO** | PUT/DELETE sem token: 401. Token de outra conta: 403 |
| P0-2 | Login response vazava campo "senha" | **FECHADO** | @JsonIgnore em Usuario.senha — nenhum response expõe senha |
| P0-3 | enviar-moedas aceitava valor negativo/zero | **FECHADO** | valor=-10 retorna 400 "Valor deve ser maior que zero"; valor=0 idem |
| P0-4 | Vantagem aceitava empresaId arbitrário | **FECHADO** | Backend ignora empresaId do payload, força do token; sem token: 401 |
| P0-5 | Empresa IDOR (cupons/vantagens de outra empresa) | **FECHADO** | empresa2 tentando acessar /empresa/7/cupons retorna 403 |
| P1-1 | Faltava endpoint PUT /aluno/senha | **FECHADO** | Endpoint existe, funciona, valida senha atual, mínimo 4 chars |
| P1-2 | validar/utilizar cupom sem auth | **PARCIAL** | Sem token: 401 (OK). Token de aluno: 400 (OK). Mas empresa A pode usar cupons da empresa B (ver P1-N02) |
| P1-3 | Cadastro duplicado vazava SQL/DDL | **FECHADO** | CPF duplicado retorna "CPF já cadastrado"; Email duplicado retorna "Email já cadastrado!" |
| P1-4 | Erros de auth retornavam 400 ao invés de 401 | **PARCIAL** | AlunoController e EmpresaController: token ausente retorna 401 (OK). ProfessorController: usa @RequestHeader(required=true) que dispara 400 do Spring MVC para todos os endpoints do professor (/enviar-moedas, /extrato, /alunos, /saldo) |

---

## Bugs Novos Encontrados

### [P1-N01] POST /api/transacao/resgatar não exige autenticação

**Categoria**: Auth / IDOR
**Reprodução**:
1. `POST http://localhost:8081/api/transacao/resgatar` com body `{"alunoId":8,"vantagemId":7}` **sem** header Authorization
2. Request executada com sucesso — cupom gerado, saldo debitado
**Esperado**: 401 Unauthorized
**Atual**: 200 OK, cupom emitido, saldo do aluno decrementado
**Arquivo**: `backend/src/main/java/com/moedaestudantil/api/controller/TransacaoController.java:24` — método `resgatar` não tem parâmetro `authorization`
**Sugestão de fix**: Adicionar `@RequestHeader(value = "Authorization", required = false) String authorization` e chamar `requireAluno(authorization, dto.getAlunoId())` antes do resgate, validando que o alunoId do token bate com o do payload.

---

### [P1-N02] IDOR em cupons: empresa pode validar/utilizar cupons de outra empresa

**Categoria**: IDOR / Autorização
**Reprodução**:
1. Aluno resgata vantagem da Empresa 7 (parceiro) — cupom gerado ex: `3438B770`
2. Empresa 6 (livraria) faz `GET /api/transacao/validar/3438B770` com seu token
3. Retorna 200 com status PENDENTE
4. Empresa 6 faz `POST /api/transacao/utilizar/3438B770` — retorna 200 UTILIZADO
**Esperado**: 403 — empresa só pode usar cupons das suas próprias vantagens
**Atual**: 200 OK — qualquer empresa autenticada usa qualquer cupom
**Arquivo**: `backend/src/main/java/com/moedaestudantil/api/controller/TransacaoController.java:84` — `requireEmpresa()` só verifica se o token é de empresa, sem verificar ownership do cupom
**Sugestão de fix**: No `utilizarCupom`, após `requireEmpresa(authorization)`, buscar a transação pelo código e verificar se `transacao.getVantagem().getEmpresa().getId()` bate com o id da empresa autenticada.

---

### [P2-N01] PUT /aluno/perfil e PUT /empresa/perfil vazam SQL/DDL ao atualizar email duplicado

**Categoria**: P1-3 regredido para edição de perfil
**Reprodução**:
1. Aluno demo faz `PUT /api/aluno/perfil/8` com body `{"email":"professor.demo@pucminas.br",...}`
2. Response body contém: `could not execute statement [Unique index or primary key violation: "PUBLIC.UKKFSP0S1TFLM1CWLJ8IDHQSAD0_INDEX_3 ON PUBLIC.USUARIOS(EMAIL NULLS FIRST)...`
3. Mesmo comportamento em `PUT /api/empresa/perfil/{id}`
**Esperado**: 400 com mensagem "Email já em uso por outro usuário"
**Atual**: 400 mas com stack SQL completo exposto
**Arquivo**: `backend/src/main/java/com/moedaestudantil/api/services/AlunoService.java:110` e `EmpresaService.java:107` — `alunoRepository.save()` / `empresaRepository.save()` propagam DataIntegrityViolationException sem catch
**Sugestão de fix**: Envolver o `save()` em try/catch DataIntegrityViolationException nos métodos `atualizarPerfil` de ambos os services, igual ao que foi feito no método `cadastrar()`.

---

### [P2-N02] GET /api/professor/alunos retorna a entidade Aluno completa (não DTO)

**Categoria**: Privacidade de dados / Over-exposure
**Reprodução**:
1. Professor autenticado faz `GET /api/professor/alunos`
2. Response inclui: `cpf`, `rg`, `endereco`, `saldoMoedas`, `tipo`, `createdAt`, `instituicao` (objeto completo com endereço e telefone)
**Esperado**: DTO com apenas nome, email, id e talvez curso/instituição — sem CPF/RG/saldo
**Atual**: JSON da entidade Aluno com CPF e RG expostos para qualquer professor autenticado
**Arquivo**: `backend/src/main/java/com/moedaestudantil/api/services/ProfessorService.java:152` — `listarAlunosPorInstituicao` e `buscarAlunosPorNome` retornam `List<Aluno>` em vez de `List<AlunoResponseDTO>`
**Sugestão de fix**: Converter para `List<AlunoResponseDTO>` usando o método `toResponseDTO` existente em AlunoService (ou criar um método similar em ProfessorService).

---

### [P2-N03] GET /api/transacao/extrato/{alunoId} não exige autenticação

**Categoria**: Privacidade de dados
**Reprodução**:
1. `GET http://localhost:8081/api/transacao/extrato/8` sem token
2. Retorna historico completo de transações do aluno (cupons, valores, mensagens)
**Esperado**: 401 ou pelo menos exigir token do próprio aluno
**Atual**: 200 com extrato completo (IDs de cupons, valores recebidos, mensagens dos professores)
**Arquivo**: `backend/src/main/java/com/moedaestudantil/api/controller/TransacaoController.java:37` — endpoint sem verificação de autenticação
**Nota**: Retorna 404 para IDs que não são alunoId (não é possível ver extrato de professor por este endpoint), mas qualquer extrato de aluno é público.
**Sugestão de fix**: Adicionar verificação de token e validar que alunoId do token bate com `{alunoId}` do path.

---

### [P2-N04] ProfessorController retorna 400 (não 401) para ausência de token

**Categoria**: P1-4 residual
**Reprodução**:
1. `POST /api/professor/enviar-moedas` sem header Authorization → 400 (corpo vazio)
2. `GET /api/professor/extrato` sem header Authorization → 400
3. `GET /api/professor/alunos` sem header Authorization → 400
**Esperado**: 401 Unauthorized
**Atual**: 400 Bad Request com corpo vazio (Spring MVC rejeita @RequestHeader required=true antes de chegar ao controller)
**Arquivo**: `backend/src/main/java/com/moedaestudantil/api/controller/ProfessorController.java:31,42,62` — `@RequestHeader("Authorization")` sem `required = false`
**Sugestão de fix**: Trocar para `@RequestHeader(value = "Authorization", required = false)` e usar o padrão com `extractProfessorIdFromToken` + try/catch que retorna 401, igual ao padrão adotado nos outros controllers.

---

### [P3-N01] ResgateResponseDTO não inclui o status do cupom

**Categoria**: UX / contrato de API
**Reprodução**:
1. Aluno resgata vantagem — response contém: codigoCupom, vantagemNome, custoMoedas, saldoRestante, dataResgate
2. Campo `status` ausente no response
**Esperado**: `"status": "PENDENTE"` no response do resgate
**Atual**: Frontend precisa inferir que o cupom está PENDENTE por omissão
**Arquivo**: `backend/src/main/java/com/moedaestudantil/api/dto/ResgateResponseDTO.java` — campo `status` não declarado
**Sugestão de fix**: Adicionar `private String status;` ao DTO e setar `response.setStatus(STATUS_PENDENTE)` em TransacaoService.resgatar().

---

## Testes que Passaram

| # | Categoria | Teste | Status |
|---|---|---|---|
| 1 | Auth | Login aluno demo | OK |
| 2 | Auth | Login professor demo | OK |
| 3 | Auth | Login empresa demo | OK |
| 4 | Auth | Login senha errada | 400 "Email ou senha inválidos!" |
| 5 | Auth | Login email inexistente | 400 "Email ou senha inválidos!" |
| 6 | Auth | Token ausente → AlunoController | 401 "Token ausente" |
| 7 | Auth | Token inválido → AlunoController | 401 "Token mal formado" |
| 8 | Auth | Token ausente → EmpresaController | 401 |
| 9 | P0-1 | DELETE aluno sem token | 401 |
| 10 | P0-1 | PUT aluno perfil sem token | 401 |
| 11 | P0-1 | PUT aluno edita perfil de outro aluno | 403 |
| 12 | P0-1 | DELETE aluno de outro aluno | 403 |
| 13 | P0-2 | Login response sem campo senha | OK |
| 14 | P0-3 | Enviar moedas valor negativo | 400 "Valor deve ser maior que zero" |
| 15 | P0-3 | Enviar moedas valor zero | 400 "Valor deve ser maior que zero" |
| 16 | P0-3 | Enviar moedas saldo insuficiente | 400 "Saldo insuficiente" |
| 17 | P0-3 | Enviar moedas sem mensagem | 400 "Mensagem de reconhecimento é obrigatória" |
| 18 | P0-3 | Enviar moedas caminho feliz | OK — saldo decrementado corretamente |
| 19 | P0-4 | Criar vantagem sem token | 401 |
| 20 | P0-4 | Criar vantagem com empresaId arbitrário | backend ignora, usa token — OK |
| 21 | P0-5 | Empresa 2 lista cupons da empresa 1 | 403 |
| 22 | P0-5 | Empresa 2 lista vantagens da empresa 1 | 403 |
| 23 | P0-5 | Empresa 2 edita vantagem da empresa 1 | 403 |
| 24 | P0-5 | Empresa 2 deleta vantagem da empresa 1 | 403 |
| 25 | P0-5 | Empresa 2 edita perfil da empresa 1 | 403 |
| 26 | P0-5 | Empresa 2 deleta conta da empresa 1 | 403 |
| 27 | P1-1 | PUT /aluno/senha — caminho feliz | 200 "Senha alterada com sucesso" |
| 28 | P1-1 | PUT /aluno/senha — senha atual errada | 400 "Senha atual incorreta" |
| 29 | P1-2 | Validar cupom sem token | 401 |
| 30 | P1-2 | Utilizar cupom sem token | 401 |
| 31 | P1-2 | Validar cupom com token de aluno | 400 "Empresa não encontrada" |
| 32 | P1-3 | Cadastro CPF duplicado | 400 "CPF já cadastrado" |
| 33 | P1-3 | Cadastro email duplicado | 400 "Email já cadastrado!" |
| 34 | P1-4 | AlunoController retorna 401 para token ausente | OK |
| 35 | P1-4 | EmpresaController retorna 401 para token ausente | OK |
| 36 | Cupom | Cupom gerado tem exatamente 8 chars | OK |
| 37 | Cupom | Validar cupom PENDENTE | OK — retorna alunoNome e status |
| 38 | Cupom | Utilizar cupom PENDENTE → UTILIZADO | OK |
| 39 | Cupom | Reutilizar cupom UTILIZADO | 400 "Cupom não está pendente (status atual: UTILIZADO)" |
| 40 | Cupom | Cupom inexistente ZZZZZZZZ | 404 "Cupom não encontrado!" |
| 41 | Resgate | Saldo insuficiente | 400 "Saldo insuficiente. Saldo atual: X | Custo: Y" |
| 42 | Resgate | Saldo decrementado corretamente | OK |
| 43 | Vantagem | Criar sem nome | 400 |
| 44 | Vantagem | Criar com custo negativo | 400 |
| 45 | Vantagem | Criar sem descricao | 400 |
| 46 | Vantagem | Listar ordenado por custo | OK |
| 47 | Extrato | Professor vê transação de envio | OK |
| 48 | Extrato | Aluno vê transações recebidas e resgates | OK |
| 49 | Segurança | SQL injection em busca de alunos | 0 registros retornados — JPA parameterizado |
| 50 | Segurança | CORS bloqueado para origins não configuradas | 403 para evil.com |
| 51 | Segurança | Empresa lista cupons da empresa certa | 0 bug na listagem (cupons associados à vantagem da empresa) |
| 52 | Segurança | AlunoId inválido no enviar-moedas | 400 "Aluno não encontrado" |

---

## Análise de Segurança

| Vetor | Status | Detalhe |
|---|---|---|
| IDOR aluno (PUT/DELETE) | FECHADO | Ownership check via token |
| IDOR empresa (perfil/cupons/vantagens) | FECHADO | checkOwnership() implementado |
| IDOR cupom (empresa usa cupom de outra) | ABERTO | requireEmpresa() não verifica ownership |
| IDOR resgate (sem token) | ABERTO | Endpoint completamente aberto |
| SQL Injection | OK | JPA usa queries parametrizadas |
| XSS em mensagens | Aceito no backend | Backend aceita `<script>alert(1)</script>` como mensagem — risco depende do frontend fazer escape |
| CORS | OK | Configurado apenas para localhost:5173; origins externas recebem 403 |
| Senhas | OK | @JsonIgnore em Usuario.senha funciona |
| Exposição de CPF/RG | ABERTO | /professor/alunos retorna entidade completa com CPF e RG |
| Extrato público | ABERTO | Qualquer pessoa pode ler extrato de qualquer aluno sem token |
| SQL leak em update de email | ABERTO | DataIntegrityViolationException não tratada em atualizarPerfil |

---

## Priorização

**P1 — Crítico (funcionalidade comprometida): 2 bugs**
- P1-N01: resgate sem auth
- P1-N02: IDOR em cupons entre empresas

**P2 — Importante (segurança/dados): 4 bugs**
- P2-N01: SQL leak no update de email
- P2-N02: CPF/RG expostos no /professor/alunos
- P2-N03: extrato aluno sem autenticação
- P2-N04: professor controller retorna 400 em vez de 401

**P3 — Nice-to-have: 1 bug**
- P3-N01: status ausente no ResgateResponseDTO

---

## Recomendações

### Fix imediato antes da apresentação (P1)

1. **P1-N01**: Adicionar auth no POST /api/transacao/resgatar e validar que o alunoId do token bate com o do payload — `TransacaoController.java:24`
2. **P1-N02**: Em `utilizarCupom` (e `validarCupom`), verificar que a empresa autenticada é dona da vantagem do cupom — `TransacaoController.java:83-87`

### Próxima sprint (P2)

3. **P2-N01**: Catch de `DataIntegrityViolationException` em `AlunoService.atualizarPerfil` e `EmpresaService.atualizarPerfil`
4. **P2-N02**: Converter `listarAlunosPorInstituicao` e `buscarAlunosPorNome` para retornar `List<AlunoResponseDTO>` em vez de entidade raw
5. **P2-N03**: Exigir token no GET /api/transacao/extrato/{alunoId}
6. **P2-N04**: Mudar ProfessorController para `@RequestHeader(value="Authorization", required=false)` e usar o padrão TokenUtil + try/catch 401

### Backlog (P3)

7. **P3-N01**: Adicionar campo `status` ao `ResgateResponseDTO`

---

## Conclusão

A aplicação está funcional para o fluxo principal de apresentação acadêmica — os 7 bugs P0/P1 críticos da auditoria original foram corretamente fechados. No entanto, dois novos bugs P1 foram introduzidos (ou não detectados antes): o endpoint de resgate está completamente aberto sem autenticação, e qualquer empresa autenticada pode marcar como "utilizado" o cupom de outra empresa. Ambos corrompem a integridade financeira do sistema. Recomendo corrigir os dois P1 antes da apresentação; os demais podem ficar para o backlog sem comprometer a demo se o fluxo de testes usar apenas os dados seed.
