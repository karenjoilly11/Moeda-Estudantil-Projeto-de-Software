# Bateria de Testes Manuais — Entrega Lab04 (Release 2)

**Objetivo**: validar TODOS os requisitos funcionais e não-funcionais antes da apresentação. Cada teste tem: o que fazer + resultado esperado + 🔴 caso falhe (causa provável).

Marque ✅ ou ❌ na coluna **Resultado** conforme for testando.

---

## ⚙️ Preparação (5 min)

### 0.1 Limpar estado anterior
- [ ] Fechar qualquer terminal/processo do backend/frontend rodando
- [ ] (Opcional, recomendado pra demo limpa) Apagar pasta `backend/data/` se existir — força DB H2 ser recriado com seeds frescos

### 0.2 Subir backend (Terminal 1)
```powershell
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"
```
Esperar até aparecer: `Started ApiApplication in X seconds`

🔴 **Se travar em "Port 8080 already in use"**: o flag `--server.port=8081` não passou — confira aspas.
🔴 **Se travar em outra coisa**: cheque se Java 21 está no `JAVA_HOME` (`java -version`).

### 0.3 Subir frontend (Terminal 2)
```powershell
cd frontend
npm run dev
```
Esperar: `Local: http://localhost:5173/`. Abrir esse endereço no navegador.

🔴 **Se aparecer "Failed to fetch" na tela de login**: o `.env.local` aponta pra porta errada. Conferir que tem `VITE_API_URL=http://localhost:8081/api`.

### 0.4 Confirmar API respondendo (Terminal 3, opcional)
```powershell
curl http://localhost:8081/api/vantagem
```
Esperado: JSON com 4 vantagens (Caderno 50, Voucher 100, Camiseta 250, Curso 400).

---

## 🧪 Bloco A — Testes Automatizados Backend (JUnit)

| # | Teste | Comando | Esperado | Resultado |
|---|---|---|---|---|
| A1 | Suite completa JUnit | `cd backend && .\mvnw.cmd test` | `Tests run: 19, Failures: 0, Errors: 0` + `BUILD SUCCESS` | ☐ |

Cobertura:
- AlunoServiceTest (3): cadastro válido, email duplicado, login senha errada
- EmpresaServiceTest (3): cadastro, email duplicado, login OK
- ProfessorServiceTest (4): envio OK, saldo insuficiente, mensagem vazia, aluno inexistente
- TransacaoServiceTest (8): resgate (4 cenários), validar (2), utilizar (2)

🔴 **Se algum falhar**: revisar log na `backend/target/surefire-reports/`.

---

## 🧪 Bloco B — Cadastro & Login (RF01, RF02, RF03)

### B1. Cadastrar novo aluno via UI
- [ ] Na tela inicial, clicar **Aluno**
- [ ] Clicar **Não tem conta? Cadastre-se**
- [ ] Preencher: Nome livre, CPF `11122233344`, RG `MG1234567`, endereço qualquer, curso, instituição (escolher uma da lista), email `teste.aluno@pucminas.br`, senha `teste123`
- [ ] **Submeter**

**Esperado**: redireciona pro login, mostra mensagem de sucesso. Saldo inicial = 0.

🔴 **CPF duplicado**: usa outro CPF (já tem aluno demo cadastrado).
🔴 **Email duplicado**: alterna o email.

### B2. Login aluno demo
- [ ] Voltar pra tela inicial, **Aluno**
- [ ] Campos vêm pré-preenchidos: `aluno.demo@pucminas.br` / `aluno@2024`
- [ ] **Entrar**

**Esperado**: dashboard do aluno com saldo **500 moedas** visível, nome do aluno demo no topo.

### B3. Login professor demo
- [ ] Logout (ícone de perfil → sair)
- [ ] Na tela inicial, **Professor**
- [ ] Campos pré-preenchidos: `professor.demo@pucminas.br` / `professor@2024`
- [ ] **Entrar**

**Esperado**: dashboard professor com saldo **1000 moedas**, lista de alunos da instituição.

### B4. Login empresa demo
- [ ] Logout
- [ ] **Empresa**
- [ ] Campos pré-preenchidos: `empresa.demo@parceiro.com` / `empresa@2024`
- [ ] **Entrar**

**Esperado**: dashboard empresa com "Minhas Vantagens" listadas + opção de validar cupom.

### B5. Login com senha errada
- [ ] Tela inicial, **Aluno**, alterar senha pra `errada123`
- [ ] **Entrar**

**Esperado**: erro visível "Credenciais inválidas" (não pode crashar nem ir pro dashboard).

---

## 🧪 Bloco C — Envio de Moedas (Lab04S01)

### C1. Professor envia moedas pra aluno (caminho feliz)
- [ ] Logado como professor demo (B3)
- [ ] Aba **Enviar Moedas** (ou similar)
- [ ] Buscar aluno: digitar "aluno" ou "demo" no campo de busca
- [ ] Selecionar o **Aluno Demo** da lista
- [ ] Valor: **10**
- [ ] Mensagem: **"Excelente participação na aula"**
- [ ] **Enviar**

**Esperado**:
- Toast/mensagem de sucesso
- Saldo professor cai pra **990**
- No terminal do backend aparecem 2 logs:
  ```
  [EMAIL→aluno.demo@pucminas.br] Recebimento de moedas...
  [EMAIL→professor.demo@pucminas.br] Confirmação de envio...
  ```

### C2. Professor — saldo insuficiente
- [ ] Mesma tela, enviar **valor 99999** com mensagem qualquer
- [ ] **Enviar**

**Esperado**: erro "Saldo insuficiente". Saldo do professor NÃO muda.

### C3. Professor — mensagem vazia (validação obrigatória)
- [ ] Mesma tela, valor 5, mensagem **vazia**
- [ ] **Enviar**

**Esperado**: erro de validação "Mensagem obrigatória" (o frontend pode bloquear antes mesmo de chamar API — ambos os comportamentos são válidos).

### C4. Aluno vê saldo aumentado
- [ ] Logout do professor
- [ ] Login aluno demo
- [ ] Verificar saldo no topo do dashboard

**Esperado**: saldo agora é **510** (500 inicial + 10 do passo C1).

---

## 🧪 Bloco D — Extrato/Histórico (Lab04S01)

### D1. Extrato do aluno
- [ ] Logado como aluno demo
- [ ] Aba **Histórico** / **Extrato** / **Minhas Transações**

**Esperado**: tabela ou lista com pelo menos 1 entrada do envio do C1 (data, professor remetente, valor +10, mensagem "Excelente participação...").

### D2. Extrato do professor
- [ ] Logout, login professor demo
- [ ] Aba **Extrato** / **Histórico**

**Esperado**: lista com envio pro aluno demo, valor -10, data correta.

---

## 🧪 Bloco E — Vantagens/Marketplace (Lab04S02)

### E1. Listar vantagens (aluno)
- [ ] Logado como aluno demo
- [ ] Aba **Marketplace** / **Vantagens**

**Esperado**: 4 vantagens visíveis, ordenadas por custo ascendente:
1. Caderno Universitário PUC — 50
2. Voucher Cantina — 100
3. Camiseta PUC — 250
4. Curso Extensão — 400

### E2. Empresa cadastra nova vantagem
- [ ] Logout, login empresa `empresa.demo@parceiro.com` / `empresa@2024`
- [ ] Aba **Minhas Vantagens** ou **Cadastrar Vantagem**
- [ ] Preencher: nome **"Mochila Logo PUC"**, descrição livre, custo **75**, foto URL (qualquer link, ex `https://placehold.co/200`)
- [ ] **Cadastrar**

**Esperado**: aparece na lista da empresa.

### E3. Aluno vê a nova vantagem
- [ ] Logout, login aluno demo
- [ ] Marketplace

**Esperado**: agora 5 vantagens, "Mochila Logo PUC" entre Caderno e Voucher (por custo 75).

### E4. Empresa edita vantagem
- [ ] Logout, login empresa, **Minhas Vantagens**
- [ ] Clicar **Editar** na Mochila, mudar custo pra **80**
- [ ] **Salvar**

**Esperado**: lista atualiza com novo valor.

### E5. Empresa exclui vantagem
- [ ] Mesma tela, **Excluir** na Mochila
- [ ] Confirmar

**Esperado**: some da lista. (Voltar ao aluno → marketplace mostra 4 de novo.)

---

## 🧪 Bloco F — Resgate de Vantagem & Cupom (Lab04S03) 🌟 CORAÇÃO DO LAB

### F1. Aluno resgata caderno (50 moedas)
- [ ] Logado como aluno demo (saldo 510)
- [ ] Marketplace, clicar **Resgatar** no Caderno Universitário (50)
- [ ] Confirmar resgate

**Esperado**:
- Modal/tela mostra **código de cupom de 8 caracteres** (ex `A1B2C3D4`) — **anota esse código**
- Saldo cai pra **460**
- No terminal backend, 2 logs:
  ```
  [EMAIL→aluno.demo@pucminas.br] Cupom de resgate XXXXXXXX...
  [EMAIL→empresa.demo@livraria.com] Novo resgate XXXXXXXX...  (ou empresa.demo@parceiro.com, depende do vínculo)
  ```

### F2. Aluno — tentar resgatar sem saldo
- [ ] Mesmo aluno, tentar resgatar **Curso Extensão (400 moedas)** quando saldo é 460
- [ ] Confirmar
- [ ] Depois, tentar resgatar Curso de novo (saldo agora 60)

**Esperado**: 1ª passa (saldo cai pra 60). 2ª falha com "Saldo insuficiente".

### F3. Empresa valida o cupom do F1
- [ ] Logout, login empresa (a que tem vínculo com Caderno — provavelmente `empresa.demo@parceiro.com` ou `empresa.demo@livraria.com`; se não souber, testa nas duas)
- [ ] Aba **Validar Cupom**
- [ ] Colar o código de 8 chars do F1
- [ ] **Validar**

**Esperado**: tela mostra:
- Nome do aluno: "Aluno Demo"
- Vantagem: "Caderno Universitário PUC"
- Status: **PENDENTE**
- Botão **Utilizar Cupom**

### F4. Empresa utiliza o cupom
- [ ] Mesma tela, clicar **Utilizar Cupom**

**Esperado**: status muda pra **UTILIZADO**. Mensagem de sucesso.

### F5. Tentar utilizar o mesmo cupom 2× (erro esperado)
- [ ] Tentar validar/utilizar o mesmo código de novo

**Esperado**: erro "Cupom já utilizado" (status 400 da API).

### F6. Cupom inexistente
- [ ] Validar código falso `ZZZZZZZZ`

**Esperado**: erro "Cupom não encontrado" (404).

---

## 🧪 Bloco G — Empresa: Gestão (Lab04S03 extras)

### G1. Listar cupons gerados
- [ ] Logada como empresa
- [ ] Aba **Cupons** ou **Histórico de Resgates**

**Esperado**: lista com pelo menos o cupom do F1 (status UTILIZADO após F4).

---

## 🧪 Bloco H — Aluno: Perfil

### H1. Editar perfil
- [ ] Login aluno demo
- [ ] Ícone perfil → **Editar Perfil**
- [ ] Mudar endereço pra "Rua Nova, 100"
- [ ] **Salvar**

**Esperado**: confirmação, valor persiste após F5 (logout/login).

### H2. Excluir conta (CUIDADO — use aluno de teste do B1, NÃO o demo)
- [ ] Login com `teste.aluno@pucminas.br` (criado no B1)
- [ ] Perfil → **Excluir Conta**
- [ ] Confirmar

**Esperado**: redireciona pra tela inicial. Tentar login com mesma conta → "Credenciais inválidas".

---

## 🧪 Bloco I — Diagramas de Sequência (Lab04S02 + S03)

### I1. Verificar arquivos presentes
- [ ] Abrir `Modelagem/Sequencia/` no explorador

**Esperado**: 3 `.puml`:
- `lab04s02-cadastrar-vantagem.puml`
- `lab04s02-listar-vantagens.puml`
- `lab04s03-trocar-vantagem.puml`

### I2. Renderizar PNGs (se ainda não foi feito)
- [ ] Abrir https://www.plantuml.com/plantuml/uml/
- [ ] Copiar/colar cada `.puml`, **Submit**, baixar PNG, salvar ao lado com mesmo nome
- [ ] Resultado: 3 PNGs em `Modelagem/Sequencia/`

---

## 🧪 Bloco J — Cypress (opcional / CI)

⚠️ Local no seu Windows 11 build 26200 não roda (bug Electron). Para mostrar evidência na entrega:

### J1. Verificar specs existem
- [ ] Pasta `frontend/cypress/e2e/` com 3 arquivos:
  - `aluno-resgate.cy.ts`
  - `professor-envio.cy.ts`
  - `empresa-cupom.cy.ts`

### J2. (Opcional) GitHub Actions
- [ ] Arquivo `.github/workflows/e2e-tests.yml` existe
- [ ] Após push, conferir aba **Actions** no GitHub — job "Cypress E2E" verde

🔴 Se não rodar CI agora, ok — documentar como evidência via screenshot do código dos specs + README explicativo (`frontend/cypress/README.md`).

---

## 🧪 Bloco K — Email Real (Lab04S01 + S03) — Opcional para apresentação

Só se quiser demonstrar email chegando de verdade. Se não, o **log no terminal já comprova o disparo** (que é o requisito).

### K1. Setar credenciais
```powershell
# Mata backend, no mesmo terminal:
$env:MAIL_USERNAME="seu.email@gmail.com"
$env:MAIL_PASSWORD="xxxxxxxxxxxxxxxx"
$env:MAIL_ENABLED="true"
$env:MAIL_FROM="seu.email@gmail.com"
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"
```

(Senha de app de 16 chars gerada em https://myaccount.google.com/apppasswords — precisa 2FA ativo.)

### K2. Testar envio
- [ ] Cadastrar aluno novo usando **seu email pessoal** (não precisa ser PUC se SMTP estiver ativo)
- [ ] Login como professor, enviar moedas pro aluno novo
- [ ] **Cheque caixa de entrada** do email do aluno → email "Recebimento de moedas"
- [ ] Cheque caixa de entrada do email do professor (se `MAIL_FROM` é o mesmo) → "Confirmação de envio"
- [ ] Logar como aluno, resgatar uma vantagem
- [ ] Cheque caixa de entrada → "Seu cupom XXXXXXXX"
- [ ] Cheque caixa da empresa → "Novo resgate XXXXXXXX"

🔴 **Auth failed**: senha de app errada ou tem espaços. Gera de novo.
🔴 **Não chega**: olha a pasta Spam.

---

## 📋 Checklist Final de Entrega

Antes da apresentação, confirme:

| Item | OK? |
|---|---|
| 19/19 JUnit verdes | ☐ |
| Backend sobe sem erro | ☐ |
| Frontend builda sem erro de merge | ☐ |
| Cadastro + login dos 3 perfis funcionam | ☐ |
| Professor envia moedas + dispara emails (log) | ☐ |
| Aluno vê saldo atualizado | ☐ |
| Extrato aluno mostra transação | ☐ |
| Extrato professor mostra transação | ☐ |
| Empresa cadastra/edita/exclui vantagem | ☐ |
| Aluno resgata vantagem + cupom 8 chars gerado | ☐ |
| Empresa valida cupom (status PENDENTE) | ☐ |
| Empresa utiliza cupom (status UTILIZADO) | ☐ |
| Utilizar 2× falha com erro | ☐ |
| 3 diagramas `.puml` + `.png` em `Modelagem/Sequencia/` | ☐ |
| Cypress: 3 specs presentes (+ CI verde se aplicável) | ☐ |
| (Opcional) Email real funcionando | ☐ |

---

## 🧨 Plano B se algo quebrar na hora

1. **Backend não sobe**: usar `mvnw clean compile spring-boot:run` (limpa target). Conferir Java 21.
2. **Frontend tela branca**: F12 → Console; se erro de fetch, confere `.env.local`. Se erro de import, `npm install` de novo.
3. **Banco corrompido**: deletar `backend/data/` (se existir) → reiniciar backend (recria seeds).
4. **Email não loga**: confere se `NotificacaoService` está sendo injetado em `ProfessorService` e `TransacaoService` (checar logs).
5. **Cupom não valida**: confere se o vínculo Caderno→Empresa em `DataInitializer` está consistente (Caderno e Curso são vinculados a `Livraria Cultura`).

---

## ⏱️ Tempo estimado de execução completa

| Bloco | Tempo |
|---|---|
| Preparação (subir tudo) | 5 min |
| A. JUnit | 2 min |
| B. Cadastro/Login | 5 min |
| C. Envio Moedas | 5 min |
| D. Extrato | 3 min |
| E. Vantagens | 8 min |
| F. Resgate/Cupom | 10 min |
| G-H. Empresa/Perfil | 5 min |
| I. Diagramas | 5 min (se PNGs já estiverem prontos: 1 min) |
| K. Email real (opcional) | 10 min |
| **Total mínimo (sem email)** | **~50 min** |
| **Total com email** | **~60 min** |

Faça uma vez completa hoje. Se tudo passar, amanhã é só repetir os blocos B/C/F na frente do professor (15 min de demo ao vivo).
