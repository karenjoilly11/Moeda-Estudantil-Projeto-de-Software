/// <reference types="cypress" />

describe('Professor - Golden Path (login + envio de moedas)', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('faz login com professor demo e abre dashboard', () => {
    cy.contains('Professor').click()
    cy.get('input[type=email]', { timeout: 10000 }).should('have.value', 'professor.demo@pucminas.br')
    cy.get('input[type=password]').should('have.value', 'professor@2024')
    cy.contains(/entrar/i).click()
    // Dashboard professor - procura por texto característico
    cy.contains(/Professor|Demonstra|moedas|saldo/i, { timeout: 15000 }).should('be.visible')
  })

  it('professor envia moedas via API e aluno recebe', () => {
    // Login professor via API
    cy.request('POST', `${Cypress.env('apiUrl')}/professor/login`, {
      email: 'professor.demo@pucminas.br',
      senha: 'professor@2024',
    }).then((profLogin) => {
      expect(profLogin.status).to.eq(200)
      const token = profLogin.body.token
      const saldoProfAntes = profLogin.body.professor.saldoMoedas

      // Login aluno via API pra pegar saldo antes
      cy.request('POST', `${Cypress.env('apiUrl')}/aluno/login`, {
        email: 'aluno.demo@pucminas.br',
        senha: 'aluno@2024',
      }).then((alunoLogin) => {
        const alunoId = alunoLogin.body.aluno.id
        const saldoAlunoAntes = alunoLogin.body.aluno.saldoMoedas

        // Envia 25 moedas
        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/professor/enviar-moedas`,
          headers: { Authorization: `Bearer ${token}` },
          body: { alunoId, valor: 25, mensagem: 'Teste E2E Cypress' },
        }).then((envResp) => {
          // EnvioMoedasResponseDTO: { transacaoId, alunoNome, valor, saldoRestanteProfessor, dataEnvio }
          expect(envResp.status).to.eq(200)
          expect(envResp.body.valor).to.eq(25)
          expect(envResp.body.alunoNome).to.not.be.empty
          expect(envResp.body.saldoRestanteProfessor).to.eq(saldoProfAntes - 25)

          // Verifica saldos atualizados
          cy.request('POST', `${Cypress.env('apiUrl')}/aluno/login`, {
            email: 'aluno.demo@pucminas.br',
            senha: 'aluno@2024',
          }).then((depois) => {
            expect(depois.body.aluno.saldoMoedas).to.eq(saldoAlunoAntes + 25)
          })

          cy.request({
            url: `${Cypress.env('apiUrl')}/professor/saldo`,
            headers: { Authorization: `Bearer ${token}` },
          }).then((saldoResp) => {
            expect(saldoResp.body).to.eq(saldoProfAntes - 25)
          })
        })
      })
    })
  })

  it('professor não pode enviar sem mensagem (regra de negócio)', () => {
    // Login professor + aluno via API para pegar IDs reais
    cy.request('POST', `${Cypress.env('apiUrl')}/professor/login`, {
      email: 'professor.demo@pucminas.br',
      senha: 'professor@2024',
    }).then((login) => {
      const token = login.body.token

      cy.request('POST', `${Cypress.env('apiUrl')}/aluno/login`, {
        email: 'aluno.demo@pucminas.br',
        senha: 'aluno@2024',
      }).then((alunoLogin) => {
        const alunoId = alunoLogin.body.aluno.id

        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/professor/enviar-moedas`,
          headers: { Authorization: `Bearer ${token}` },
          body: { alunoId, valor: 10, mensagem: '' },
          failOnStatusCode: false,
        }).then((resp) => {
          expect(resp.status).to.eq(400)
        })
      })
    })
  })

  it('professor não pode enviar valor zero/negativo (P0-3)', () => {
    cy.request('POST', `${Cypress.env('apiUrl')}/professor/login`, {
      email: 'professor.demo@pucminas.br',
      senha: 'professor@2024',
    }).then((login) => {
      const token = login.body.token

      cy.request('POST', `${Cypress.env('apiUrl')}/aluno/login`, {
        email: 'aluno.demo@pucminas.br',
        senha: 'aluno@2024',
      }).then((alunoLogin) => {
        const alunoId = alunoLogin.body.aluno.id

        cy.request({
          method: 'POST',
          url: `${Cypress.env('apiUrl')}/professor/enviar-moedas`,
          headers: { Authorization: `Bearer ${token}` },
          body: { alunoId, valor: -50, mensagem: 'teste' },
          failOnStatusCode: false,
        }).then((resp) => {
          expect(resp.status).to.eq(400)
        })
      })
    })
  })
})
