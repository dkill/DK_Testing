Cypress.env('viewports').forEach((viewport) => {
	describe(`Add to cart from PDP: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
		it('Add to cart from PDP', () => {
			cy.allNew(viewport)
			cy.get('.product-title a').eq(1).as('product').then((product) => {
					const productText = product.text()
					cy.wrap(product).click()
					cy.get('.size-box').not('.oos').first().as('size').then((size) => {
							const variant = size.attr('data-vid')
							cy.wrap(size).click()
							cy.get('button').contains('Add To Bag').click()
							cy.get('.drawer1').should('have.class', 'drawer1-open')
							cy.get('.cart-item').first().as('cartItem').find('.product-title').contains(productText, { matchCase: false }).should('exist')
							cy.get('@cartItem').find('.product-variant').should('have.attr', 'data-vid', variant)
						})
				})
		})
	})
})