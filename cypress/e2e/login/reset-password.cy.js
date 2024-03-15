Cypress.env('viewports').forEach((viewport) => {
    describe(`Reset password form: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
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
        it('From the login form, I can click "forgot your password?" and see the form swap to the reset password form', function () {
            cy.getByData('sign-in-form')
                .should('be.visible')
            cy.step('click forgot password link')
            cy.getByData('forgot-password-link').click()
            cy.getByData('reset-password-form')
                .should('be.visible')
            cy.get('p').contains('reset password', { matchCase: false })
                .should('be.visible')
            cy.getByData('sign-in-form')
                .should('not.exist')
        })
        it('If I enter a malformed email, I see an error message', function () {
            cy.step('click forgot password link')
            cy.getByData('forgot-password-link').click()
            cy.getByData('reset-password-form').within(() => {
                cy.step('type malformed email')
                cy.get('input').type('cypress')
                cy.step('click reset password button')
                cy.getByData('reset-password-button').click()
                cy.get('input').next('p').contains('valid email', { matchCase: false })
                    .should('be.visible')
            })
        })
        it('When the form is submitted successfully, I see the same messaging whether or not the email exists in our system', function () {
            cy.step('click forgot password link')
            cy.getByData('forgot-password-link').click()
            cy.getByData('reset-password-form').within(() => {
                cy.step('type nonexistent email')
                cy.get('input').type('dollskill1234567890@dollskill.com')
                cy.getByData('reset-password-button').click()
            })
            cy.getByData('reset-password-form').find('p').first().text().then(msg => {
                cy.getByData('login-link').click()
                cy.getByData('forgot-password-link').click()
                cy.getByData('reset-password-form').within(() => {
                    cy.fixture('logins').its('default').then(function (user) {
                        this.user = user
                        cy.step('type existent email')
                        cy.get('input').type(this.user.email)
                    })
                    cy.getByData('reset-password-button').click()
                    cy.get('p').first().text()
                        .should('eq', msg)
                })
            })
        })
    })
})