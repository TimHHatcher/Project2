// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('applicationLogin', () => {
    const username = Cypress.env('username')
    const password = Cypress.env('password')

    expect(username, 'username was set').to.be.a('string').and.not.be.empty
    if (typeof password !== 'string' || !password) {
        throw new Error('Missing password value, set using CYPRESS_password=...')
    }
    expect(password, 'password was set').to.be.a('string').and.not.be.empty
    
    cy.visit('/login')
    cy.get('[formcontrolname="email').type(username)
    cy.get('[formcontrolname="password"]').type(password, {log: false})
    cy.get('form').submit()
})

Cypress.Commands.add('headlessLogin', () => {
    const username = Cypress.env('username')
    const password = Cypress.env('password')
    const userCredentials = {
        "user": {
            "email": username,
            "password": password
        }
    }
    
    expect(username, 'username was set').to.be.a('string').and.not.be.empty
    if (typeof password !== 'string' || !password) {
        throw new Error('Missing password value, set using CYPRESS_password=...')
    }
    expect(password, 'password was set').to.be.a('string').and.not.be.empty
    cy.request('POST', 'https://api.realworld.io/api/users/login', userCredentials)
        .its('body').then(body => {
            const token = body.user.token

            cy.wrap(token).as('token')
            cy.visit('/', {
                onBeforeLoad (win) {
                    win.localStorage.setItem('jwtToken', token)
                }
            })
        })
})
