const viewports = [
	{ device: 'iPhone', width: 390, height: 844 }
]

viewports.forEach((viewport) => {
	describe(`Mobile login: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(function () {
			cy.viewport(viewport.width, viewport.height)
			cy.visit(Cypress.env('baseURL'))
			cy.get('.hamburger-icon').click()
			cy.get('[data-signin-container]').find('button').contains('ACCOUNT').click()
			cy.fixture('user-login').then((user) => {
				this.user = user
			})
			cy.fixture('new-user').then((newUser) => {
				this.newUser = newUser
			})
		})
		it('Clicking on the mobile account button opens the login form', () => {
			cy.get('[data-signin-container]').find('form').should('be.visible')
		})
		it('Users can sign in', function () {
			cy.get('[data-signin-container]')
				.find('form')
				.within(($form) => {
					cy.get('input[type="email"]').type(this.user.email)
					cy.get('input[type="password"]').type(this.user.password)
					cy.get('a').contains('SIGN IN').click()
				})
			cy.url().should('include', '/account?wi=1')
			cy.get('.customer_email').should('have.text', this.user.email)
		})
		it('Users can create an account', function () {
			cy.get('a').contains('CREATE AN ACCOUNT').click()
			cy.get('h2').contains('CREATE ACCOUNT').should('be.visible')
			cy.get('[data-signin-container]')
				.find('form')
				.within(($form) => {
					cy.get('input[id="first-name"]').type(this.newUser.firstName)
					cy.get('input[id="last-name"]').type(this.newUser.lastName)
					cy.get('input[type="email"]').type(this.newUser.email)
					cy.get('input[type="password"]').type(this.newUser.password)
					cy.get('a').contains('CREATE ACCOUNT').click()
				})
			cy.url().should('include', '/account')
			cy.get('.customer_email').should('have.text', this.newUser.email)
		})
		it('Users can reset their passwords', function () {
			cy.get('a').contains('Forgot your password?').click()
			cy.get('h2').contains('RESET PASSWORD').should('be.visible')
			cy.get('[data-signin-container]')
				.find('form')
				.within(($form) => {
					cy.get('input[type="email"]').type(this.user.email)
					cy.get('a').contains('RESET PASSWORD').click()
				})
			cy.get('p')
				.contains(`If we find an email in our system matching yours we'll send a link with instructions on how to reset your password.`)
				.should('be.visible')
		})
	})
})
