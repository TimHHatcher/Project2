/// <reference types="cypress" />
 
describe('Test with backend', () => {
 
    beforeEach('Login to Application', () => {
        cy.server()
        cy.route('GET', '**/tags', 'fixture:tags.json')
        cy.route('GET', '**/articles/feed*', '{"articles":[],"articlesCount":1}')
        cy.route('GET', '**/articles*', 'fixture:articles.json')
 
        cy.applicationLogin()
    })
 
    it.skip('Verify correct request and response', () => {
       
        cy.server()
        cy.route('POST', '**/articles').as('postArticles')
       
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('Article1')
        cy.get('[formcontrolname="description"]').type('Description of Article1')
        cy.get('[formcontrolname="body"]').type('Body of Article1')
        cy.contains('Publish Article').click()
 
        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {
            console.log(xhr)
            expect(xhr.status).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('Body of Article1')
            expect(xhr.response.body.article.body).to.equal('Body of Article1')
        })
    })
 
    it.skip('respond to browser with custom tags file', () => {
        cy.get('.tag-list')
            .should('contain', 'butt')
            .and('contain', 'test')
            .and('contain', 'dragon')
    })
 
    it('verify global feed likes count', () => {
 
        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then( listOfButtons => {
            expect(listOfButtons[0]).to.contain('5')
            expect(listOfButtons[1]).to.contain('10')
        })

        cy.fixture('articles').then(file => {
            const articleLink = file.articles[1].slug
            cy.route('POST', '**/articles/' + articleLink + '/favorite', file)
        })

        cy.get('app-article-list button')
            .eq(1)
            .click()
            .should('contain', '11')

    })
 
})
