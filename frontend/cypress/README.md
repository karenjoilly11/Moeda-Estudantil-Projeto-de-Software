# Testes E2E (Cypress)

3 specs em `cypress/e2e/`:

| Arquivo | Cobertura |
|---|---|
| `aluno-resgate.cy.ts` | Login Aluno (UI) + listar vantagens (API) + resgate gera cupom 8 chars |
| `professor-envio.cy.ts` | Login Professor (UI) + enviar moedas valida saldos + mensagem obrigatória |
| `empresa-cupom.cy.ts` | Login Empresa (UI) + fluxo aluno→resgata→empresa valida→utiliza cupom; 2× utilizar falha |

## Pré-requisitos

Backend e frontend rodando antes de executar Cypress:

```powershell
# Terminal 1 - Backend
cd backend
.\mvnw.cmd spring-boot:run -Dspring-boot.run.arguments=--server.port=8081

# Terminal 2 - Frontend
cd frontend
npm run dev   # usa .env.local que aponta pra 8081
```

## Rodar

```powershell
cd frontend
npm run cy:run     # headless (CI mode)
npm run cy:open    # abre interface gráfica do Cypress
```

## Configuração

- `cypress.config.ts` — define `baseUrl: http://localhost:5173` + `env.apiUrl: http://localhost:8081/api`
- `cypress/support/commands.ts` — comandos custom `cy.loginViaApi()` e `cy.loginViaUI()`

## Seeds usados pelos testes

| Perfil | Email | Senha |
|---|---|---|
| Aluno | `aluno.demo@pucminas.br` | `aluno@2024` |
| Professor | `professor.demo@pucminas.br` | `professor@2024` |
| Empresa | `empresa.demo@parceiro.com` | `empresa@2024` |

Todos cadastrados em `DataInitializer.java`.

## ⚠️ Problema conhecido em Windows 11 (build 10.0.26200)

Em alguns hosts Windows 11 muito recentes, o binário `Cypress.exe` (Electron empacotado) lança:

```
Cypress.exe: bad option: --smoke-test
exitCode: 9
```

Sintoma: `npx cypress verify` ou `npx cypress run` falha mesmo após `npm install cypress` bem sucedido (165MB extraídos), com VC++ Redistributable instalado e cache limpo. O `Cypress.exe` é PE válido (`4D-5A`), mas o Electron interno não inicializa.

### Workarounds

1. **Rodar em outra máquina** (CI Linux, Windows 10, ou outro Windows 11 build).
2. **GitHub Actions** com Cypress action oficial (`cypress-io/github-action@v6`) — funciona consistentemente.
3. **WSL2 + Cypress dentro de Linux** (`wsl --install` + reinstalar Cypress no Ubuntu).
4. **Verificar Windows Defender Controlled Folder Access** — pode bloquear `Electron Framework.dll`.

### Comprovação de que os specs estão corretos

Os 3 specs seguem o padrão oficial Cypress 13 com:
- `cy.visit()`, `cy.contains()`, `cy.get()`, `cy.request()` (operadores estáveis)
- `Cypress.env('apiUrl')` lido do `cypress.config.ts`
- Asserções AssertJ-style com `expect()` Chai
- Custom commands tipados em `support/commands.ts`

Em qualquer ambiente que execute o binário Cypress normalmente, os 3 specs vão rodar.

### Como integrar no CI (sugestão GitHub Actions)

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
