/// <reference types="cypress" />

// Comandos customizados Cypress

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      /**
       * Faz login via API + grava no localStorage (sem passar por UI),
       * útil pra acelerar testes que não querem testar o fluxo de login.
       */
      loginViaApi(role: 'aluno' | 'professor' | 'empresa', email: string, senha: string): Chainable<void>

      /**
       * Faz login real via UI clicando em RoleSelection + formulário.
       */
      loginViaUI(role: 'aluno' | 'professor' | 'empresa', email: string, senha: string): Chainable<void>
    }
  }
}

Cypress.Commands.add('loginViaApi', (role, email, senha) => {
  const apiUrl = Cypress.env('apiUrl')
  const path = `/${role}/login`
  cy.request('POST', `${apiUrl}${path}`, { email, senha }).then((resp) => {
    expect(resp.status).to.eq(200)
    const data = resp.body
    const user = data[role] // { aluno, professor, empresa }
    cy.window().then((win) => {
      win.localStorage.setItem('token', data.token)
      win.localStorage.setItem('role', role)
      win.localStorage.setItem('user', JSON.stringify(user))
    })
  })
})

Cypress.Commands.add('loginViaUI', (role, email, senha) => {
  cy.visit('/')
  const labels: Record<string, string | RegExp> = {
    aluno: /aluno/i,
    professor: /professor/i,
    empresa: /empresa/i,
  }
  cy.contains(labels[role]).click()
  cy.get('input[type=email]').first().clear().type(email)
  cy.get('input[type=password]').first().clear().type(senha)
  cy.contains(/entrar|login/i).click()
})

export {}
