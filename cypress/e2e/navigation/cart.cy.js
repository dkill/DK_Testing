Cypress.env('viewports').forEach((viewport) => {
	describe(`Main navigation cart: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
		it('Clicking on the cart box renders the mini cart', () => {
			cy.get('[data-mini-cart-btn]').click()
			cy.get('.drawer1').should('have.class', 'drawer1-open')
		})
		it('Cart box background color is different when cart is empty vs not empty', { scrollBehavior: false }, () => {
			cy.allNew(viewport)
			cy.get('[data-mini-cart-btn]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
			cy.get('[data-quickview-container]').first().find('button').click().wait(2000)
			cy.get('button').contains('add to cart').click()
			cy.get('[data-mini-cart-btn]').should('have.css', 'background-color', 'rgb(60, 60, 60)')
			cy.get('.remove-button').click()
			cy.get('[data-mini-cart-btn]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
		})
		it('Cart count updates when an item is added to the cart', { scrollBehavior: false }, () => {
			cy.allNew(viewport)
			cy.get('#bag-count').should('have.text', '0')
			cy.get('[data-quickview-container]').first().find('button').click().wait(2000)
			cy.get('button').contains('add to cart').click()
			cy.get('#bag-count').should('have.text', '1')
			cy.get('.remove-button').click()
			cy.get('#bag-count').should('have.text', '0')
		})
	})
})
