/// <reference types="cypress" />
 
describe('Test with backend', () => {
 
    beforeEach('Login to Application', () => {
        cy.headlessLogin()
    })

    it('intercepting and modifying the request', () => {
        cy.intercept('POST', '**/api.realworld.io/api/articles', req => {
            req.body.article.title = "Article2"
            req.body.article.description = "Description of Article2"
            req.body.article.body = "Body of Article2"
        }).as('postArticles')
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('Article1')
        cy.get('[formcontrolname="description"]').type('Description of Article1')
        cy.get('[formcontrolname="body"]').type('Body of Article1')
        cy.contains('Publish Article').click()
 
        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.response.body.article.title).to.equal('Article2')
            expect(xhr.response.body.article.description).to.equal('Description of Article2')
            expect(xhr.response.body.article.body).to.equal('Body of Article2')
        })
    })
 
})
