Cypress.env('viewports').forEach((viewport) => {
	describe(`Main navigation search: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
		})
		it('Clicking on the search icon shows the search bar and focuses on the input', () => {
			cy.get('[data-search-btn]').click()
			cy.get('[data-search-bar]').should('be.visible')
			cy.get('.ais-SearchBox-input').should('be.focused')
		})
	})
})
