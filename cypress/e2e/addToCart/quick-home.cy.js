Cypress.env('viewports').forEach((viewport) => {
	describe(`Quick add from home page: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)            
            cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
		it('I can quick add items to cart from the home page carousels', { scrollBehavior: false }, () => {
            cy.get('product-card').first().then((card) => {
                cy.wrap(card).find('.product-title a').then((product) => {
                    const productName = product.text()
                    cy.wrap(card).find('button').first().as('addBtn').scrollIntoView({ offset: { top: -400, left: -400 } }).click()
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