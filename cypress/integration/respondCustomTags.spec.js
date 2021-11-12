/// <reference types="cypress" />
 
describe('Test with backend', () => {
 
    beforeEach('Login to Application', () => {
        cy.headlessLogin()
    })
 
    it('respond to browser with custom tags file', () => {
        cy.intercept('GET', '**/tags', {fixture:'tags.json'})
        cy.get('.tag-list')
            .should('contain', 'butt')
            .and('contain', 'test')
            .and('contain', 'dragon')
    })
 
})
