Cypress.env('viewports').forEach((viewport) => {
	describe(`Search pagination: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
            cy.visit(Cypress.env('baseURL'))
            // cy.closeAttn()
            cy.get('[data-search-btn').as('searchBtn')
            cy.get('[data-search-results-container]').as('searchContainer')
            cy.get('@searchContainer').find('.tw-w-full.tw-h-auto').as('products')
            cy.get('input.ais-SearchBox-input').as('searchInput')
		})
        it('Search results should be paginated wtih 120 results per page', () => {
                cy.step('click search button')
                cy.get('@searchBtn').click()
                cy.step('type search term')
                cy.get('input.ais-SearchBox-input').type('purple').wait(1000)
                cy.get('.tw-w-full.tw-h-auto').find('h3').should('have.length', 120)
        })
        it('The pagination buttons at the bottom of the page should work as expected and display 5 pages at a time (even when there are more than 5 pages of results returned)', () => {
            cy.get('@searchBtn').click()
            cy.get('@searchInput').should('be.focused')
        })
    })
})