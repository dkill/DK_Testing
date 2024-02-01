Cypress.env('viewports').forEach((viewport) => {
	describe(`Header heart icon: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)  
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })          
            cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
		it('Clicking the heart icon in the header prompts the user to log in if they\'re not already logged in', function () {
            cy.step('click wishlist icon')
            cy.get('.add-to-wishlist-btn[data-wish-action="viewWishlists"]').click()
            cy.section('The login form text should read "SIGN IN TO VIEW UR WISHLIST"')
            cy.get('p').contains('SIGN IN TO VIEW UR WISHLIST', { matchCase: false }).should('be.visible')
            cy.section('After they log in, they should be forwarded to the wishlist portal')
            cy.get('input[type="password"]').parents('form').within(($form) => {
                cy.fixture('user-login').then((user) => {
                    this.user = user
                    cy.step('type email')
                    cy.get('input[type="email"]').type(this.user.email)
                    cy.step('type password')
                    cy.get('input[type="password"]').type(this.user.password)
                })
                cy.step('click sign in')
				cy.get('button').click()
            })
            cy.section('After they log in, they should be forwarded to the wishlist portal')
            cy.url().should('eq', 'https://www.dollskill.com//pages/wishlists')
            cy.section('Clicking the heart icon in the header when a user is logged in forwards the user to the wishlist portal')
            cy.get('[data-header-logo]').click()
            cy.get('.add-to-wishlist-btn[data-wish-action="viewWishlists"]').click()
            cy.url().should('eq', 'https://www.dollskill.com/pages/wishlists')
		})
	})
})