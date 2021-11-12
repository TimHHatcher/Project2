/// <reference types="cypress" />
 
describe('Test with backend', () => {
 
    beforeEach('Login to Application', () => {
        //cy.applicationLogin()
        cy.headlessLogin()
    })
 
    it('Verify correct request and response', () => {
        cy.intercept('POST', '**/api.realworld.io/api/articles').as('postArticles')
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('Article1')
        cy.get('[formcontrolname="description"]').type('Description of Article1')
        cy.get('[formcontrolname="body"]').type('Body of Article1')
        cy.contains('Publish Article').click()
 
        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('Body of Article1')
            expect(xhr.response.body.article.description).to.equal('Description of Article1')
        })
    })

    it('intercepting and modifying the request', () => {
        cy.intercept('POST', '**/api.realworld.io/api/articles', req => {
            req.body.article.description = "Description of Article2"
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
            expect(xhr.request.body.article.body).to.equal('Body of Article1')
            expect(xhr.response.body.article.description).to.equal('Description of Article2')
        })
    })

    it('intercepting and modifying the response', () => {
        cy.intercept('POST', '**/api.realworld.io/api/articles', req => {
            req.reply(res => {
                expect(res.body.article.description).to.equal('Description of Article1')
                res.body.article.description = "Description of Article2"
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
            expect(xhr.request.body.article.body).to.equal('Body of Article1')
            expect(xhr.response.body.article.description).to.equal('Description of Article2')
        })
    })
 
    it('respond to browser with custom tags file', () => {
        cy.intercept('GET', '**/tags', {fixture:'tags.json'})
        cy.get('.tag-list')
            .should('contain', 'butt')
            .and('contain', 'test')
            .and('contain', 'dragon')
    })
 
    it('verify global feed likes count', () => {
        cy.intercept('GET', '**/articles/feed*', {"articles":[],"articlesCount":1})
        cy.intercept('GET', '**/articles*', {fixture:'articles.json'})
        cy.contains('Global Feed').click()
        cy.get('app-article-list button').then( listOfButtons => {
            expect(listOfButtons[0]).to.contain('5')
            expect(listOfButtons[1]).to.contain('10')
        })

        cy.fixture('articles').then(file => {
            const articleLink = file.articles[1].slug
            cy.intercept('POST', '**/articles/' + articleLink + '/favorite', file)
        })

        cy.get('app-article-list button')
            .eq(1)
            .click()
            .should('contain', '11')

    })

    it('Delete new article in the global feed via API', () => {
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

    it.only('UPDATED - Delete new article in the global feed via API', () => {
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
