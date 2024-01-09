Cypress.env('viewports').forEach((viewport) => {
	describe(`Search header: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            // cy.closeAttn()
            cy.getByData('header--search-button').as('searchBtn')
            cy.getByData('search--search-container').as('searchContainer')
            cy.getByData('search--search-input').as('searchInput')
		})
        it('When I click the search icon in the header, the search dropdown opens', () => {
            cy.get('@searchBtn').click()
            cy.get('@searchContainer').should('be.visible')
        })
        it('After the search opens, focus is applied to the search input so that I can start typing right away', () => {
            cy.get('@searchBtn').click()
            cy.get('@searchInput').should('be.focused')
        })
    })
})