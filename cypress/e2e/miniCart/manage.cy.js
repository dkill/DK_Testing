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
            cy.get('span.product-price').as('linePrice')
            cy.get('span.cart-subtotal-amount').as('subtotal')
            cy.get('div.cart-quantity-adjuster').find('span').not('.toggle-quantity').as('qty')
            cy.get('.toggle-quantity[data-type="add"]').as('add')
            cy.get('.toggle-quantity[data-type="remove"]').as('remove')
            cy.get('@linePrice').then((price) => {
                const priceNum = Number(price.text().replace('$', ''))
                checkTotal('span.product-price', 1)
                function checkTotal(el, qty) {
                    cy.get(el).then((total) => {
                        const totalNum = Number
                        (total.text().replace('$', ''))
                        cy.wrap(totalNum).should('eq', priceNum * qty)
                    })
                }
                function checkQty(num) {
                    cy.get('@qty').then((qty) => {
                        const qtyNum = Number(qty.text())
                        cy.wrap(qtyNum).should('eq', num)
                    })
                }
                cy.step('add qty')
                for (let i = 2; i < 5; i++) {
                    cy.get('@add').click().wait(500)
                    checkQty(i)
                    checkTotal('@linePrice', i)
                    checkTotal('@subtotal', i)
                }
                cy.step('remove qty')
                for (let i = 3; i > 0; i--) {
                    cy.get('@remove').click().wait(500)
                    checkQty(i)
                    checkTotal('@linePrice', i)
                    checkTotal('@subtotal', i)
                }
            })
        })
        it('Clicking remove on a line item removes that line item in its entirety', () => {
            cy.getByData('cart--cart-item').first().then((product) => {
                cy.step('click remove button')
                cy.getByData('cart--remove-button').click()
                cy.wrap(product).should('not.exist')
            })
        })
    })
})