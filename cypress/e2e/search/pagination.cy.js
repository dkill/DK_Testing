// more than 5 pages: black
// less than 5 pages: purple
// one page: purple shoes
const searchTerm = "black"

Cypress.env('viewports').forEach((viewport) => {
	describe(`Search pagination: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            // cy.closeAttn()
            cy.getByData('header--search-button').as('searchBtn')
            cy.getByData('search--search-product-card').as('products')
            cy.getByData('search--search-input').as('searchInput')
		})
        it('Search results should be paginated wtih 120 results per page', () => {
                cy.step('click search button')
                cy.get('@searchBtn').click()
                cy.step('type search term')
                cy.get('@searchInput').type(searchTerm).wait(1000)
                cy.get('@products').should('have.length', 120)
        })
        it('The pagination buttons at the bottom of the page should work as expected and display 5 pages at a time (even when there are more than 5 pages of results returned)', () => {
            cy.step('click search button')
            cy.get('@searchBtn').click()
            cy.step('type search term')
            cy.get('@searchInput').type(searchTerm).wait(1000)
            cy.getByData('search--pagination').find('a[aria-label]').should('have.length.lte', 5)
        })
    })
})