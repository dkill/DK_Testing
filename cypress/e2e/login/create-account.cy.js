Cypress.env('viewports').forEach((viewport) => {
    describe(`Create accuont form: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
            cy.step('click "account" in footer')
            cy.getByData('footer--footer-section-title').contains('account', { matchCase: false }).click()
            cy.step('click "my account" in footer')
            cy.getByData('footer--account-button').click()
        })
        it('From the login form, I can click "create account" and see the form swap to the create account form', function () {
            cy.getByData('sign-in-form')
                .should('be.visible')
            cy.step('click create account link')
            cy.getByData('create-account-link').click()
            cy.getByData('create-account-form')
                .should('be.visible')
            cy.get('p').contains('create account', { matchCase: false })
                .should('be.visible')
            cy.getByData('sign-in-form')
                .should('not.exist')
        })
        it('From the reset password form, I can click "create account" and see the form swap to the create account form', function () {
            cy.step('click forgot password link')
            cy.getByData('forgot-password-link').click()
            cy.step('click create account link')
            cy.getByData('create-account-link').click()
            cy.getByData('create-account-form')
                .should('be.visible')
            cy.get('p').contains('create account', { matchCase: false })
                .should('be.visible')
            cy.getByData('sign-in-form')
                .should('not.exist')
        })
        it('I can see error messages disappear when I submit the form with correct info on a field to field basis', function () {
            cy.step('click create account link')
            cy.getByData('create-account-link').click()
            cy.getByData('create-account-form').within(() => {
                cy.getByData('create-account-button').click()
                cy.get('input').each(el => {
                    const text = el.attr('placeholder')
                    const id = '#' + el.attr('id')
                    if (text === 'EMAIL') {
                        cy.wrap(el).type('dolls1@dollskill.com')
                    } else {
                        cy.wrap(el).type('DollsKill24')
                    }
                    cy.root().submit()
                    cy.wrap(el).next('p')
                        .should('not.exist')
                    cy.get('input').not(id).each(notEl => {
                        const notText = notEl.attr('placeholder')
                        cy.wrap(notEl).next('p').text()
                            .should('to.match', new RegExp(notText, 'i'))
                    })
                    cy.wrap(el).clear()
                })
            })
        })
        it('If I enter a malformed email, I see an error message', function () {
            cy.step('click create account link')
            cy.getByData('create-account-link').click()
            cy.getByData('create-account-form').within(() => {
                cy.get('input[type="email"]').type('dollskill')
                cy.getByData('create-account-button').click()
                cy.get('input[type="email"]').invoke('prop', 'validationMessage')
                    .should('not.to.be.empty')
            })
        })
        it('I can see validation requirements for password', function () {
            cy.step('click create account link')
            cy.getByData('create-account-link').click()
            cy.getByData('create-account-form').within(() => {
                cy.get('input[type="password"]').type('dollskill')
                cy.getByData('create-account-button').click()
                cy.get('input[type="password"]').next('p')
                    .should('contain', '8 characters')
                    .and('contain', 'upper')
                    .and('contain', 'lower')
                    .and('contain', 'number')
                cy.get('input[type="password"]').clear()
                cy.get('input[type="password"]').type('DollsKill123')
                cy.getByData('create-account-button').click()
                cy.get('input[type="password"]').next('p')
                    .should('not.exist')
            })
        })
        it.only('I can see the form submit when there are no validation errors', function () {
            cy.step('click create account link')
            cy.getByData('create-account-link').click()
            cy.getByData('create-account-form').within(() => {
                cy.get('input#first-name').type('Dolls')
                cy.get('input#last-name').type('Kill')
                cy.get('input[type="email"]').type('dolls1@dollskill.com')
                cy.get('input[type="password"]').type('DollsKill123')
                cy.root().submit()
            })
            cy.getByData('create-account-form')
                .should('not.exist')
            cy.url()
                .should('include', 'account')
        })
    })
})