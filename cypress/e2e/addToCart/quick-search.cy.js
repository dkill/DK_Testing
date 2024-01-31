Cypress.env('viewports').forEach((viewport) => {
	describe(`Quick add from predictive search: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)            
            cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
        it('I can quick add to cart from the predictive search', { scrollBehavior: false }, () => {
            cy.get('[data-search-btn]').click()
            cy.get('.ais-Hits-item').first().then((card) => {
                cy.wrap(card).find('h3').then((product) => {
                    const productName = product.text()
                    cy.wrap(card).find('button').eq(1).scrollIntoView({ offset: { top: -400, left: 0 } }).as('addBtn').click()
                    cy.get('@addBtn').siblings().first().find('div').first().as('addDiv').should('be.visible')
                    cy.get('@addDiv').find('label').last().as('size').click()
                    cy.get('@size').siblings('input').then((variant) => {
                        const variantID = variant.attr('value')
                        cy.get('@addDiv').find('button').contains('add to cart').click()
                        cy.get('.drawer1').should('have.class', 'drawer1-open')
                        cy.get('.cart-item').first().as('cartItem').find('.product-title').contains(productName, { matchCase: false }).should('exist')
                        cy.get('@cartItem').find('.product-variant').should('have.attr', 'data-vid', variantID)
                    })
                })
            })
		})
	})
})