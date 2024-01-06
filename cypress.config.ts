import { defineConfig } from 'cypress'
// Populate process.env with values from .env file
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` })

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    defaultCommandTimeout: 10000,
  },
  env: {
    auth0_username: process.env.AUTH0_USERNAME,
    auth0_password: process.env.AUTH0_PASSWORD,
    auth0_domain: process.env.AUTH0_DOMAIN,
    auth0_client_secret: process.env.AUTH0_CLIENT_SECRET,
  },
})