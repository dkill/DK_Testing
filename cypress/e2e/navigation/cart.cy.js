Cypress.env('viewports').forEach((viewport) => {
	describe(`Main navigation cart: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.visit(Cypress.env('baseURL'))
			// cy.closeAttn()
			cy.getByData('header--mini-cart-button').as('cartButton')
		})
		it('Clicking on the cart box renders the mini cart', () => {
			cy.get('@cartButton').click()
			cy.getByData('cart--drawer').should('have.class', 'drawer1-open')
		})
		it('Cart box background color is different when cart is empty vs not empty', { scrollBehavior: false }, () => {
			cy.allNew(viewport)
			cy.get('@cartButton').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
			cy.getByData('product-card--quick-add-button').first().click().wait(2000)
			cy.getByData('product-card--quick-add-button').click()
			cy.get('@cartButton').should('have.css', 'background-color', 'rgb(60, 60, 60)')
			cy.getByData('cart--remove-button').click()
			cy.get('@cartButton').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
		})
		it('Cart count updates when an item is added to the cart', { scrollBehavior: false }, () => {
			cy.allNew(viewport)
			cy.getByData('header--cart-count').as('cartCount')
			cy.get('@cartCount').should('have.text', '0')
			cy.getByData('product-card--quick-add-container').first().find('button').click().wait(2000)
			cy.get('button').contains('add to cart').click()
			cy.get('@cartCount').should('have.text', '1')
			cy.get('cart--remove-button').click()
			cy.get('@cartCount').should('have.text', '0')
		})
	})
})
