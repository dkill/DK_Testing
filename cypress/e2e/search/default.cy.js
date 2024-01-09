Cypress.env('viewports').forEach((viewport) => {
	describe(`Search before query is entered: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
            cy.step('click search button')
            cy.getByData('header--search-button').click()
		})
        it('When I first open search, there are 16 products displayed', () => {
            cy.getByData('search--default-product-card')
                .should('have.length', 16)
                .and('be.visible')
        })
        it('There are between one and four text-based menus with links to the search page', () => {
            cy.getByData('search--search-container').children('div').first().children('div').first().children('div').as('menus').should('have.length.lte', 4)
            cy.get('@menus').should('have.length.gte', 2)
            cy.step('click first menu link')
            cy.get('@menus').find('button').eq(4).as('btn').then((btn) => {
                const btnText = btn.text().replace(' ', '%20')
                cy.get('@btn').click()
                cy.url().should('contain', btnText)
            })
        })
    })
})