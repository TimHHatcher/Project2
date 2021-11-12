/// <reference types="cypress" />

describe('Logout test', () => {

    beforeEach('Perform headless login', () => {
        cy.headlessLogin()
    })

    it('Logout', () => {
        cy.contains('Settings').click()
        cy.contains('Or click here to logout').click()
        cy.get('.navbar-nav').should('contain', 'Sign up')
    })

})