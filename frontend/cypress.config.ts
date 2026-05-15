import { defineConfig } from 'cypress'

export default defineConfig({
  // Cypress Cloud — grava runs em https://cloud.cypress.io/projects/pwkz4z
  projectId: 'pwkz4z',

  e2e: {
    baseUrl: 'http://localhost:5173',
    defaultCommandTimeout: 12000,
    requestTimeout: 12000,
    // Vídeo ativado para upload no Cypress Cloud (apresentação/demo)
    video: true,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 800,
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    },
  },
  env: {
    apiUrl: 'http://localhost:8081/api',
  },
})
