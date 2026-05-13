import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',
    defaultCommandTimeout: 12000,
    requestTimeout: 12000,
    video: false,
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
