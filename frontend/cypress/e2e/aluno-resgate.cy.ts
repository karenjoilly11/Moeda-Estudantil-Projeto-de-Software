/// <reference types="cypress" />

describe('Aluno - Golden Path (login + ver dashboard)', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('faz login com aluno demo e vê o dashboard com saldo', () => {
    // 1. RoleSelection: clica em "Aluno"
    cy.contains('Aluno').click()

    // 2. LoginScreen aparece com seed pré-preenchido (aluno.demo@pucminas.br)
    cy.get('input[type=email]', { timeout: 10000 }).should('have.value', 'aluno.demo@pucminas.br')
    cy.get('input[type=password]').should('have.value', 'aluno@2024')

    // 3. Submete (botão "entrar")
    cy.contains(/entrar/i).click()

    // 4. Dashboard carrega - saudação com "Aluno"
    cy.contains(/Aluno|Demonstra/i, { timeout: 15000 }).should('be.visible')
  })

  it('lista vantagens no marketplace via API', () => {
    // Smoke direto na API: garante backend respondendo
    cy.request(`${Cypress.env('apiUrl')}/vantagem`).then((resp) => {
      expect(resp.status).to.eq(200)
      expect(resp.body).to.be.an('array')
      expect(resp.body.length).to.be.greaterThan(0)
      const nomes = resp.body.map((v: any) => v.nome)
      expect(nomes).to.include('Caderno Universitário PUC')
    })
  })

  it('aluno resgata vantagem via API + recebe cupom com 8 chars', () => {
    // Login para pegar id (usando API, sem UI)
    cy.request('POST', `${Cypress.env('apiUrl')}/aluno/login`, {
      email: 'aluno.demo@pucminas.br',
      senha: 'aluno@2024',
    }).then((loginResp) => {
      expect(loginResp.status).to.eq(200)
      const alunoId = loginResp.body.aluno.id
      const saldoInicial = loginResp.body.aluno.saldoMoedas

      // Listar vantagens
      cy.request(`${Cypress.env('apiUrl')}/vantagem`).then((vantResp) => {
        const vantagem = vantResp.body.find((v: any) => v.custoMoedas <= saldoInicial)
        expect(vantagem, 'precisa de uma vantagem com custo <= saldo').to.exist

        // Resgatar
        cy.request('POST', `${Cypress.env('apiUrl')}/transacao/resgatar`, {
          alunoId,
          vantagemId: vantagem.id,
        }).then((resgResp) => {
          expect(resgResp.status).to.eq(200)
          expect(resgResp.body.codigoCupom).to.have.length(8)
          expect(resgResp.body.saldoRestante).to.eq(saldoInicial - vantagem.custoMoedas)
          expect(resgResp.body.vantagemNome).to.eq(vantagem.nome)
        })
      })
    })
  })
})
