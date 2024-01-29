Cypress.env('viewports').forEach((viewport) => {
    describe(`Manage cart: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
            cy.step('go to all new')
            cy.allNew(viewport)
            cy.step('click second product')
            cy.getByData('product-card').eq(1).click()
            cy.step('select size')
            cy.getByData('pdp--size-box').not('.oos').first().click()
            cy.getByData('pdp--add-to-bag-button').click()
            cy.waitUntil(() => cy.getByData('cart--drawer').attribute('class').then(attr => attr.includes('drawer1-open')))
        })
        it('Pressing the increment and decrement buttons (+ and -) updates the quantity and cart subtotal correctly', () => {
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
                        cy.wrap(totalNum)
                            .should('eq', priceNum * qty)
                    })
                }
                function checkQty(num) {
                    cy.get('@qty').then((qty) => {
                        const qtyNum = Number(qty.text())
                        cy.wrap(qtyNum)
                            .should('eq', num)
                    })
                }
                cy.step('add qty')
                for (let i = 2; i < 5; i++) {
                    let cookie
                    cy.getCookie('cart_ts').then((c) => {cookie = c})
                    cy.get('@add').click()
                    cy.waitUntil(() => cy.get('@add').attribute('data-current-qty').then(num => Number(num) === i))
                    checkQty(i)
                    checkTotal('@linePrice', i)
                    checkTotal('@subtotal', i)
                }
                cy.step('remove qty')
                for (let i = 3; i > 0; i--) {
                    let cookie
                    cy.getCookie('cart_ts').then((c) => {cookie = c})
                    cy.get('@remove').click()
                    cy.waitUntil(() => cy.get('@remove').attribute('data-current-qty').then(num => Number(num) === i))
                    checkQty(i)
                    checkTotal('@linePrice', i)
                    checkTotal('@subtotal', i)
                }
            })
        })
        it('Clicking remove on a line item removes that line item in its entirety', () => {
            cy.getByData('cart--cart-item').first().then((product) => {
                let cookie
                cy.getCookie('cart_ts').then((c) => {cookie = c})
                cy.step('click remove button')
                cy.getByData('cart--remove-button').click()
                cy.waitUntil(() => cy.getCookie('cart_ts').then(newCookie => newCookie != cookie))
                cy.wrap(product)
                    .should('not.exist')
            })
        })
        it('I can add and remove upsell items', () => {
            cy.step('add first upsell to cart')
            cy.get('#complete-look-items').find('.card-content').first().as('card').find('.product-title a').text().then((name) => {
                cy.section('I can add an upsell from the rendered slider to my cart')
                let cookie
                cy.getCookie('cart_ts').then((c) => {cookie = c})
                cy.get('@card').find('button.upsell-add').click()
                // cy.waitUntil(() => cy.getCookie('cart_ts').then(newCookie => newCookie != cookie))
                cy.waitUntil(() => cy.getByData('cart--cart-item').then(newCookie => newCookie != cookie))
                cy.getByData('cart--cart-item').contains(name).as('cartCard')
                    .should('exist')
                cy.section('I can see that upsell removed from the slider')
                cy.get('#complete-look-items').find('.card-content').contains(name)
                    .should('not.exist')
                cy.section('I can see that upsell returned to the slider if removed from the user\'s cart')
                cy.getCookie('cart_ts').then((c) => {cookie = c})
                cy.get('@cartCard').parents('div.cart-content').find('[data-test-id="cart--remove-button"]').click()
                cy.waitUntil(() => cy.getCookie('cart_ts').then(newCookie => newCookie != cookie))
                cy.getByData('cart--cart-item').contains(name)
                    .should('not.exist')
                cy.get('#complete-look-items').find('.card-content').contains(name)
                    .should('exist')

            })
        })
        it('If there are too many line items in cart, I can scroll down to view ones below the fold', () => {
            cy.section('add more items to cart')
            for (let i = 0; i < 6; i++) {
                cy.step('go back')
                cy.go('back')
                cy.step('click product')
                cy.getByData('product-card').eq(i).click()
                cy.step('select size')
                cy.getByData('pdp--size-box').not('.oos').first().click()
                cy.step('add to bag')
                cy.getByData('pdp--add-to-bag-button').click()
            }
            cy.step('scroll to last item')
            cy.waitUntil(() => cy.getByData('cart--drawer').attribute('class').then(attr => attr.includes('drawer1-open')))
            cy.getByData('cart--cart-item').eq(-1).as('lastItem').scrollIntoView()
            cy.get('@lastItem')
                .should('be.visible')
        })
    })
})