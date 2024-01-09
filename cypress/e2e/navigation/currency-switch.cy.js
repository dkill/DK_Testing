Cypress.env('viewports').forEach((viewport) => {
	describe(`Main navigation currency switcher: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
		it('Clicking on the currency switcher shows the modal for changing currency', () => {
			if (viewport.width > Cypress.env('navBreak')) {
				cy.getByData('header--currency-selector-button').click()
				cy.getByData('header--currency-selector-container').should('be.visible')
			} else {
				cy.get('.hamburger-icon').click()
				cy.getByData('nav--mobile-currency-selector').click()
				cy.get('h2').contains('Update Your Shipping Country').should('be.visible')
			}
		})
	})
})
