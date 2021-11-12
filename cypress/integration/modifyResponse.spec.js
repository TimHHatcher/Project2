/// <reference types="cypress" />
 
describe('Test with backend', () => {
 
    beforeEach('Login to Application', () => {
        cy.headlessLogin()
    })

    it('intercepting and modifying the response', () => {
        cy.intercept('POST', '**/api.realworld.io/api/articles', req => {
            req.reply(res => {
                expect(res.body.article.description).to.equal('Description of Article1')
                res.body.article.title = "Article3"
                res.body.article.description = "Description of Article3"
                res.body.article.body = "Body of Article3"
            })
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
            expect(xhr.response.body.article.title).to.equal('Article3')
            expect(xhr.response.body.article.description).to.equal('Description of Article3')
            expect(xhr.response.body.article.body).to.equal('Body of Article3')
        })
    })
 
})
