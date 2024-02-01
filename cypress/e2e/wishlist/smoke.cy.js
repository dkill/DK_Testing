Cypress.env('viewports').forEach((viewport) => {
	describe(`Wishlist: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)  
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })          
            cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
		it('Smoke test', function () {
            cy.step('click wishlist icon')
            cy.get('.add-to-wishlist-btn[data-wish-action="viewWishlists"]').click()
            cy.section('sign in')
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
            cy.url()
                .should('eq', 'https://www.dollskill.com//pages/wishlists')
            cy.section('Clicking the heart icon in the header when a user is logged in forwards the user to the wishlist portal')
            cy.get('[data-header-logo]').click()
            cy.get('.add-to-wishlist-btn[data-wish-action="viewWishlists"]').click()
            cy.url()
                .should('eq', 'https://www.dollskill.com/pages/wishlists')
            cy.step('go to all new')
            cy.allNew(viewport)
            cy.step('click add to wishlist button').wait(500)
            cy.getByData('product-card').eq(4).find('.add-to-wishlist-btn').click()
            cy.get('#headlessui-listbox-button-P0-1').click()
            cy.step('select second list')
            cy.get('ul#headlessui-listbox-options-P0-0 li').eq(1).click()  
		})
	})
})