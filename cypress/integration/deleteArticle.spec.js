/// <reference types="cypress" />
 
describe('Test with backend', () => {
 
    beforeEach('Login to Application', () => {
        cy.headlessLogin()
    })

    it.skip('Delete new article in the global feed via API', () => {
        const userCredentials = {
            "user": {
                "email": "timhhatcher+conduit@gmail.com",
                "password": "THHConduit21!"
            }
        }

        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "Test4",
                "description": "Test4",
                "body": "Test4"
            }
        }

        //Request to login
        cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
        .its('body').then(body => {
            const token = body.user.token
            
            //Request to add new article
            cy.request({
                url: 'https://api.realworld.io/api/articles/',
                headers: {'Authorization': 'Token ' + token},
                method: 'POST',
                body: bodyRequest
            }).then(response => {
                expect(response.status).to.equal(200)
            })
            
            //Request article list and delete last added article
            cy.request({
                url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token ' + token},
                method: 'GET'
            }).then(response => {
                cy.get(response.body.articles).each(articles => {
                    if(articles.title == 'Test4') {
                        cy.intercept('DELETE', '**/api.realworld.io/api/articles/' + articles.slug).as('deleteArticle')
                        cy.contains('Global Feed').click()
                        cy.get('.article-preview').first().click()
                        cy.get('.article-actions').contains('Delete Article').click()
                        cy.wait('@deleteArticle')
                    }
                })
            })

            //Request article list and validate article was deleted
            cy.request({
                url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token ' + token},
                method: 'GET'
            }).its('body')
                .its('articles')
                .should(articleList => {
                    expect(articleList.map(i => i.title)).to.not.include('Test4')
                })
        })
    })

    it('UPDATED - Delete new article in the global feed via API', () => {
        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "Test4",
                "description": "Test4",
                "body": "Test4"
            }
        }

        //Request to login
        cy.get('@token').then(token => {
            
            //Request to add new article
            cy.request({
                url: 'https://api.realworld.io/api/articles/',
                headers: {'Authorization': 'Token ' + token},
                method: 'POST',
                body: bodyRequest
            }).then(response => {
                expect(response.status).to.equal(200)
            })
            
            //Request article list and delete last added article
            cy.request({
                url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token ' + token},
                method: 'GET'
            }).then(response => {
                cy.get(response.body.articles).each(articles => {
                    if(articles.title == 'Test4') {
                        cy.intercept('DELETE', '**/api.realworld.io/api/articles/' + articles.slug).as('deleteArticle')
                        cy.contains('Global Feed').click()
                        cy.get('.article-preview').first().click()
                        cy.get('.article-actions').contains('Delete Article').click()
                        cy.wait('@deleteArticle')
                    }
                })
            })

            //Request article list and validate article was deleted
            cy.request({
                url: 'https://api.realworld.io/api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token ' + token},
                method: 'GET'
            }).its('body')
                .its('articles')
                .should(articleList => {
                    expect(articleList.map(i => i.title)).to.not.include('Test4')
                })
        })
    })
 
})
