Cypress.env('viewports').forEach((viewport) => {
	describe(`Sign in form: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
            cy.step('click "account" in footer')
            cy.getByData('footer--footer-section-title').contains('account', { matchCase: false }).click()
            cy.step('click "my account" in footer')
            cy.getByData('footer--account-button').click()
            cy.getByData('sign-in-form').within(() => {
                cy.get('input[type="email"]').as('email')
                cy.get('input[type="password"]').as('password')
            })
		})
        it('If both the email and password fields are blank, I see warnings under both form fields telling me what to enter', function () {
            cy.getByData('sign-in-form').within(() => {
                cy.step('click sign in button')
                cy.getByData('sign-in-button').click()
                cy.get('@email').next('p')
                    .should('be.visible')
                    .and('contain', 'email')
                cy.get('@password').next('p')
                    .should('be.visible')
                    .and('contain', 'password')
            })
        })
        it('If an an invalid email is entered, I see a warning under the form field', function () {
            cy.getByData('sign-in-form').within(() => {
                cy.step('type invalid email')
                cy.get('@email').type('cypress')
                cy.step('click sign in button')
                cy.getByData('sign-in-button').click()
                cy.get('@email').invoke('prop', 'validationMessage')
                    .should('not.to.be.empty')
            })
        })
        it('If the email is correct and the password is blank, I only see the error under the password', function () {
            cy.getByData('sign-in-form').within(() => {
                cy.fixture('logins').its('default').then(function (user) {
                    this.user = user
                    cy.step('type email')
                    cy.get('@email').type(this.user.email)
                })
                cy.getByData('sign-in-button').click()
                cy.get('@email').next('p')
                    .should('not.exist')
                cy.get('@email').invoke('prop', 'validationMessage')
                    .should('be.empty')
                cy.get('@password').next('p')
                    .should('be.visible')
            })
        })
        it('If login fails, I see an error asking me to try again', function () {
            cy.getByData('sign-in-form').within(() => {
                cy.fixture('logins').its('default').then(function (user) {
                    this.user = user
                    cy.step('type email')
                    cy.get('@email').type(this.user.email)
                    cy.step('type invalid password')
                    cy.get('input[type="password"]').type('abcde')
                })
                cy.getByData('sign-in-button').click()
                cy.get('p').contains('try again', { matchCase: false })
                    .should('exist')
            })
        })
	})
})