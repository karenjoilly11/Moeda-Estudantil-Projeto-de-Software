# Guia de Teste Manual — Lab04 (Release 2)

Este guia te leva do zero ao "tudo testado" sem depender de Cypress local (que tem bug no Windows 11 build 26200).

## 1. Pré-requisitos

- Java 21 instalado
- Node 20+ instalado
- Porta 8081 livre (backend) e 5173 livre (frontend)
- (Opcional) Conta Gmail com 2FA + senha de app pra email real

## 2. Subir o sistema

### Terminal 1 — Backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"
```
Esperar: `Started ApiApplication in X seconds`

### Terminal 2 — Frontend
```powershell
cd frontend
npm run dev
```
Esperar: `Local: http://localhost:5173/`

Abrir navegador em `http://localhost:5173`.

## 3. Rodar testes automatizados (JUnit) — 19 testes

```powershell
cd backend
.\mvnw.cmd test
```

Esperado:
```
Tests run: 19, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

Cobertura:
- `AlunoServiceTest` (3 testes) — cadastro/login
- `EmpresaServiceTest` (3 testes) — cadastro/login empresa
- `ProfessorServiceTest` (4 testes) — envio de moedas
- `TransacaoServiceTest` (8 testes) — resgate/validar/utilizar cupom + saldo + 404s

## 4. Golden Path manual — Aluno

1. Na tela inicial, clica **Aluno**
2. Os campos já vêm preenchidos: `aluno.demo@pucminas.br` / `aluno@2024`
3. Clica **Entrar** → vai pro dashboard
4. Verifica saldo inicial (ex: 100 moedas)
5. Acessa **Marketplace** / **Vantagens**
6. Clica em **Resgatar** numa vantagem mais barata (ex: Caderno = 50 moedas)
7. Modal de cupom aparece com **código de 8 caracteres** (ex: `A1B2C3D4`)
8. **Anota esse código** — vai usar no fluxo da empresa
9. Verifica que saldo caiu corretamente

**Resultado esperado**:
- Saldo reduzido em 50
- Cupom de 8 chars exibido
- Email logado no terminal do backend: `[EMAIL→aluno.demo@pucminas.br] Resgate vantagem...`

## 5. Golden Path manual — Professor

1. Logout do aluno
2. Clica **Professor**
3. Os campos vêm preenchidos: `professor.demo@pucminas.br` / `professor@2024`
4. Clica **Entrar**
5. Acessa **Enviar Moedas**
6. Busca pelo aluno (`aluno.demo` ou nome)
7. Seleciona o aluno
8. Digita valor **10**
9. Digita mensagem obrigatória (ex: "Excelente participação")
10. Clica **Enviar**

**Resultado esperado**:
- Mensagem de sucesso
- Saldo do professor reduzido em 10
- Saldo do aluno aumentado em 10
- 2 emails logados no terminal do backend (um pro aluno + um pro professor com confirmação)

**Teste negativo**: tentar enviar sem mensagem → erro
**Teste negativo**: tentar enviar mais que o saldo → erro

## 6. Golden Path manual — Empresa

1. Logout do professor
2. Clica **Empresa**
3. Os campos vêm preenchidos: `empresa.demo@parceiro.com` / `empresa@2024`
4. Clica **Entrar**
5. Acessa **Validar Cupom** / **Minhas Vantagens**
6. Cola o cupom de 8 chars que o aluno gerou (passo 4 do Aluno)
7. Clica **Validar**

**Resultado esperado**:
- Aparece: nome do aluno, vantagem, status `PENDENTE`
- Botão **Utilizar Cupom**
- Ao clicar, status muda pra `UTILIZADO`
- Tentar utilizar de novo → erro 400

## 7. Email real (opcional)

### 7.1 Configurar Gmail
1. Acesse https://myaccount.google.com/security
2. Ative **Verificação em 2 etapas**
3. Vá em https://myaccount.google.com/apppasswords
4. Gera senha de app (16 chars) — nome livre, ex "MoedaEstudantil"
5. Copia a senha (sem espaços)

### 7.2 Setar env vars + reiniciar backend
```powershell
# Mata o backend rodando primeiro (Ctrl+C no terminal dele)

cd backend
$env:MAIL_USERNAME="seu.email@gmail.com"
$env:MAIL_PASSWORD="xxxxxxxxxxxxxxxx"   # 16 chars sem espaço
$env:MAIL_ENABLED="true"
$env:MAIL_FROM="seu.email@gmail.com"
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.arguments=--server.port=8081"
```

### 7.3 Testar
1. Cadastra um aluno NOVO com seu email pessoal
2. Faz login como esse aluno
3. Resgata uma vantagem
4. **Cheque a caixa de entrada** — deve chegar email "Seu cupom de resgate"
5. Faz login como professor → envia moedas pro aluno com seu email
6. Cheque caixa de entrada → 2 emails (recebimento + confirmação)

Se der erro de auth: senha de app errada ou copiada com espaços.
Se SMTP falhar: backend NÃO quebra — só loga warning e segue.

## 8. Cypress (E2E automatizado)

⚠️ **Bug no Windows 11 build 10.0.26200** — Cypress binário falha com `bad option: --smoke-test`. Não é problema dos testes, e sim do Electron interno.

### Workarounds

**Opção A — GitHub Actions (CI)**: criar `.github/workflows/e2e.yml` com:
```yaml
name: E2E Tests
on: [push, pull_request]
jobs:
  cypress:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with: { java-version: 21, distribution: temurin }
      - name: Start backend
        run: |
          cd backend
          chmod +x mvnw
          ./mvnw spring-boot:run &
          sleep 30
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - uses: cypress-io/github-action@v6
        with:
          working-directory: frontend
          start: npm run dev
          wait-on: 'http://localhost:5173'
          browser: chrome
```

**Opção B — Rodar no WSL2** (Ubuntu): `wsl --install` → dentro do Ubuntu, instalar Node + clonar repo + `npm install && npx cypress run`

**Opção C — Outra máquina**: qualquer Linux ou Windows 10/build anterior do 11 funciona

## 9. Diagramas de Sequência

3 arquivos `.puml` em `Modelagem/Sequencia/`. Pra gerar PNG:

1. Abrir https://www.plantuml.com/plantuml/uml/
2. Copiar conteúdo do `.puml`, colar, **Submit**
3. Botão direito na imagem → **Salvar como** → salvar `.png` com mesmo nome no mesmo diretório

Repetir pros 3 arquivos:
- `lab04s02-cadastrar-vantagem.puml`
- `lab04s02-listar-vantagens.puml`
- `lab04s03-trocar-vantagem.puml`

## 10. Checklist de entrega Lab04

- [ ] Backend roda (`mvnw spring-boot:run`)
- [ ] Frontend roda (`npm run dev`)
- [ ] 19 testes JUnit passando (`mvnw test`)
- [ ] Golden path Aluno (resgate gera cupom 8 chars)
- [ ] Golden path Professor (envio + 2 emails logados)
- [ ] Golden path Empresa (validar → utilizar → 2x falha)
- [ ] (Opcional) Email real configurado e testado
- [ ] 3 diagramas `.puml` + `.png` gerados
- [ ] Cypress: 3 specs escritos (rodar em CI/WSL/outra máquina)
- [ ] README do projeto atualizado mencionando como subir

## 11. Troubleshooting rápido

| Sintoma | Causa provável | Fix |
|---|---|---|
| Backend não sobe — porta 8080 em uso | XAMPP Apache | Já configuramos 8081 — checa o comando `-Dspring-boot.run.arguments=--server.port=8081` |
| Frontend não acha API | `.env.local` faltando | Criar `frontend/.env.local` com `VITE_API_URL=http://localhost:8081/api` |
| Login falha "Email não encontrado" | Banco não foi inicializado | Reinicia backend — `DataInitializer` cria os 3 seeds |
| Senha do Gmail rejeitada | Não é senha de app | Gerar uma em myaccount.google.com/apppasswords |
| Cypress crash `--smoke-test` | Bug Windows 11 26200 | Usar CI/WSL — testes estão corretos |
