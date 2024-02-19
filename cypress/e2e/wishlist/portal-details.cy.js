const emptyWishlistCTA = 'LOOKS LIKE YOUR WISHLIST NEEDS WISHES'

Cypress.env('viewports').forEach((viewport) => {
    describe(`Header heart icon: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(function () {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
        })
        it(`I can see a product grid of my wishlisted items in my currently selected list`, function () {
            cy.login('user-login')
            cy.step('click wishlist icon')
            cy.get('.add-to-wishlist-btn[data-wish-action="viewWishlists"]').click()
            cy.get('swym-wishlist-portal').find('a').eq(2).click()
        })
        it.only('I can remove items from my wishlist by clicking the heart and see the icon revert back to being unfilled', function () {
            cy.login('user-login')
            cy.get('[data-wish-action="viewWishlists"]').click()
            cy.get('swym-wishlist-portal').find('a').first().click()
            cy.getByData('search--undefined-product-card').as('card').find('[data-wish-action="addToWishlist"]').click()
            cy.get('@card').find('[data-wish-action="addToWishlist"]')
                .should('have.css', 'background-color: rgba(0, 0, 0, 0)')
        })
    })
})