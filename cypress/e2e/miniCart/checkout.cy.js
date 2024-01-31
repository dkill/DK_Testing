Cypress.env('viewports').forEach((viewport) => {
    describe(`Checkout from mini cart: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
        })
        it('Clicking the checkout button at the bottom sends the user to the correct checkout and allows them to continue their purchase', () => {
            cy.step('go to all new')
            cy.allNew(viewport)
            let items = []
            let cartItems = []
            for (let i = 0; i < 3; i++) {
                cy.step(`click product index ${i}`)
                cy.getByData('product-card').eq(i).click()
                cy.step('select size')
                cy.getByData('pdp--size-box').not('.oos').first().click()
                cy.step('add to bag')
                cy.getByData('pdp--add-to-bag-button').click()
                cy.step('go back')
                cy.go('back')
            }
            cy.step('open mini cart')
            cy.getByData('header--mini-cart-button').click()
            cy.waitUntil(() => cy.getByData('cart--drawer').attribute('class').then(attr => attr.includes('drawer1-open')))
            cy.getByData('cart--cart-item-variant').attribute('data-vid').each((item) => {
                items.push(item)
            })
            cy.step('click checkout')
            cy.getByData('cart--checkout-button').click()
            cy.url().should('contain', '/checkouts/')
            cy.get('tr.product').attribute('data-variant-id').each((cartItem) => {
                cartItems.push(cartItem)
            })
            cy.wrap(items).each((vid) => {
                cy.wrap(cartItems)
                    .should('contain', vid)
            })
        })
    })
})