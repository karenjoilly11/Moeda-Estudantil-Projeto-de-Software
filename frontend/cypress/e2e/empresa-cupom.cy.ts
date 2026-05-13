/// <reference types="cypress" />

describe('Empresa - Golden Path (login + validar/utilizar cupom)', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('faz login com empresa demo e abre dashboard', () => {
    cy.contains('Empresa').click()
    cy.get('input[type=email]', { timeout: 10000 }).should('have.value', 'empresa.demo@parceiro.com')
    cy.get('input[type=password]').should('have.value', 'empresa@2024')
    cy.contains(/entrar/i).click()
    // CompanyDashboard tem sidebar com "minhas vantagens"
    cy.contains(/vantagens|cupom|valida/i, { timeout: 15000 }).should('be.visible')
  })

  it('fluxo completo: aluno resgata → empresa valida → empresa utiliza', () => {
    // 1. Aluno gera cupom via API
    cy.request('POST', `${Cypress.env('apiUrl')}/aluno/login`, {
      email: 'aluno.demo@pucminas.br',
      senha: 'aluno@2024',
    }).then((alunoLogin) => {
      const alunoId = alunoLogin.body.aluno.id

      cy.request(`${Cypress.env('apiUrl')}/vantagem`).then((vants) => {
        // Pega vantagem vinculada à empresa (tem nome conhecido)
        const vantagem = vants.body[0] // primeira da lista (mais barata)

        cy.request('POST', `${Cypress.env('apiUrl')}/transacao/resgatar`, {
          alunoId,
          vantagemId: vantagem.id,
        }).then((resg) => {
          const cupom = resg.body.codigoCupom
          expect(cupom).to.have.length(8)

          // 2. Empresa valida cupom
          cy.request(`${Cypress.env('apiUrl')}/transacao/validar/${cupom}`).then((val) => {
            expect(val.status).to.eq(200)
            expect(val.body.status).to.eq('PENDENTE')
            expect(val.body.codigoCupom).to.eq(cupom)
            expect(val.body.alunoNome).to.not.be.empty
          })

          // 3. Empresa utiliza cupom
          cy.request('POST', `${Cypress.env('apiUrl')}/transacao/utilizar/${cupom}`).then((util) => {
            expect(util.status).to.eq(200)
            expect(util.body.status).to.eq('UTILIZADO')
          })

          // 4. Tentar utilizar de novo: deve falhar
          cy.request({
            method: 'POST',
            url: `${Cypress.env('apiUrl')}/transacao/utilizar/${cupom}`,
            failOnStatusCode: false,
          }).then((retry) => {
            expect(retry.status).to.eq(400)
          })
        })
      })
    })
  })

  it('cupom inexistente retorna 404', () => {
    cy.request({
      url: `${Cypress.env('apiUrl')}/transacao/validar/INEXISTE`,
      failOnStatusCode: false,
    }).then((resp) => {
      expect(resp.status).to.eq(404)
    })
  })
})
