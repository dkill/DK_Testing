Cypress.env('viewports').forEach((viewport) => {
	describe(`Footer email form: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
		})
        it('I can enter my email in the signup form and see a success message', function () {
            cy.fixture('user-login').then((user) => {
                this.user = user
                cy.get('input.footer-input').type(this.user.email)
                cy.get('button.footer-button').find('svg').click()
            })
            cy.get('#footer-input-email_msg').should('not.be.empty')
        })
	})
})