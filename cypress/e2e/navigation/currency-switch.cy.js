Cypress.env('viewports').forEach((viewport) => {
	describe(`Main navigation currency switcher: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
		it('Clicking on the currency switcher shows the modal for changing currency', () => {
			if (viewport.width > Cypress.env('navBreak')) {
				cy.get('[data-country-selector]').click()
				cy.get('.dk-country-selector').should('be.visible')
			} else {
				cy.get('.hamburger-icon').click()
				cy.get('[data-signin-container]').find('i').click()
				cy.get('h2').contains('Update Your Shipping Country').should('be.visible')
			}
		})
	})
})
