describe('Add items to wishlist', () => {
    beforeEach(() => {
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
        cy.visit(Cypress.env('baseURL'))
        cy.closeAttn()
    })
    it('Add to wishlist', function () {
        cy.login('wishlist')
        cy.getByData('header--desktop-link').eq(1).click()
        for (let i = 5; i < 40; i++) {
            cy.collectionCard().eq(i).find('.add-to-wishlist-btn').click()
            cy.get('button').contains('Add To List').click()
        }
    })
})