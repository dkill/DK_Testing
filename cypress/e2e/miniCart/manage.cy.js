Cypress.env('viewports').forEach((viewport) => {
    describe(`Add to cart from PDP: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            // cy.closeAttn()
            cy.step('go to all new')
            cy.allNew(viewport)
            cy.step('click second product')
            cy.getByData('product-card').eq(1).click()
            cy.step('select size')
            cy.getByData('pdp--size-box').not('.oos').first().click()
            cy.getByData('pdp--add-to-bag-button').click()
        })
        // cy.print({ title: 'variable', message: `product: ${productText}`, type: 'var' })
        it.only('Pressing the increment and decrement buttons (+ and -) updates the quantity and cart subtotal correctly', () => {
            cy.get('span.product-price').as('price').then((price) => {
                const priceNum = Number(price.text().replace('$', ''))
                cy.get('span.cart-subtotal-amount').as('subtotal').then((subtotal) => {
                    const subtotalNum = Number(subtotal.text().replace('$', ''))
                    cy.wrap(subtotalNum).should('eq', priceNum)
                })
                cy.get('div.cart-quantity-adjuster').find('span').not('.toggle-quantity').as('qty').should('contain', 1)
                cy.get('.toggle-quantity[data-type="add"]').click()
                cy.get('@qty').should('contain', 2)
                cy.get('@price').should('contain', priceNum * 2)
                cy.get('@subtotal').then((subtotal) => {
                    const subtotalNum = Number(subtotal.text().replace('$', ''))
                    cy.wrap(subtotalNum).should('eq', priceNum * 2)
                })
            })
        })
    })
})