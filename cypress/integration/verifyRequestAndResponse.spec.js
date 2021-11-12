/// <reference types="cypress" />

 
describe('Test with backend', () => {
 
    beforeEach('Login to Application', () => {
        cy.headlessLogin()
    })
 
    it('Verify correct request and response', () => {
        cy.intercept('POST', '**/api.realworld.io/api/articles').as('postArticles')
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('Article3')
        cy.get('[formcontrolname="description"]').type('Description of Article3')
        cy.get('[formcontrolname="body"]').type('Body of Article3')
        cy.contains('Publish Article').click()
 
        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.title).to.equal('Article3')
            expect(xhr.request.body.article.description).to.equal('Description of Article3')
            expect(xhr.request.body.article.body).to.equal('Body of Article3')
            expect(xhr.response.body.article.title).to.equal('Article3')
            expect(xhr.response.body.article.description).to.equal('Description of Article3')
            expect(xhr.response.body.article.body).to.equal('Body of Article3')
        })
    })
 
})
