describe('template spec', () => {
  it('passes', () => {
    cy.visit('http://localhost:5173')
    cy.get('button').should('contain', 'Log in')
  })
})

describe('Auth0', function () {
  beforeEach(function () {
    cy.intercept('POST', '/graphql').as('createBankAccount')
    cy.loginToAuth0(
      Cypress.env('auth0_username'),
      Cypress.env('auth0_password')
    )
  })

  it('should allow user to create a todo', () => {
    cy.get('.todo-input').type('Buy milk')
    cy.get('button').contains('Create').click()

    cy.contains('Buy milk').should('exist')
  })
})