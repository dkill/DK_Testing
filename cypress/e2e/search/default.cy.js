Cypress.env('viewports').forEach((viewport) => {
	describe(`Search before query is entered: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
            cy.get('[data-search-btn').as('searchBtn')
		})
        it('When I first open search, there are 16 products displayed', () => {
            cy.step('click search button')
            cy.get('@searchBtn').click()
            cy.get('.ais-Hits-item')
                .should('have.length', 16)
                .and('be.visible')
        })

    })
})