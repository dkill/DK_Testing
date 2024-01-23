Cypress.env('viewports').forEach((viewport) => {
    describe(`Cart line items: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
            cy.step('go to all new')
            cy.allNew(viewport)
        })
        it('When I add a specific product variant to cart, the correct variant is added', () => {
            cy.get('.product-title a').eq(1).as('product').then((product) => {
                const productText = product.text()
                cy.step('click second product')
                cy.wrap(product).click()
                cy.getByData('pdp--size-box').not('.oos').first().then((size) => {
                    const variant = size.attr('data-vid')
                    cy.step('select size')
                    cy.wrap(size).click()
                    cy.step('add to bag')
                    cy.getByData('pdp--add-to-bag-button').click()
                    cy.getByData('cart--drawer')
                        .should('have.class', 'drawer1-open')
                    cy.getByData('cart--cart-item-product-title').first().contains(productText, { matchCase: false })
                        .should('exist')
                    cy.getByData('cart--cart-item-variant')
                        .should('have.attr', 'data-vid', variant)
                })
            })
        })
        it('The correct product image is displayed for a given line item', () => {
            cy.step('click second product')
            cy.getByData('product-card').eq(1).click()
            cy.get('img.pdpimage').first().attribute('src').then((src) => {
                const img = src.split('/products/')[1]
                cy.log(src)
                cy.step('select size')
                cy.getByData('pdp--size-box').not('.oos').first().click()
                cy.step('add to bag')
                cy.getByData('pdp--add-to-bag-button').click()
                cy.getByData('cart--cart-item').find('img').as('cartImg').attribute('src')
                    .should('contain', img)
                cy.get('@cartImg')
                    .should('be.visible')
                    .and($img => expect($img[0].naturalWidth).to.be.gt(0))
            })
        })
        it('The correct product title is displayed for a given line item', () => {
            cy.step('click second product')
            cy.getByData('product-card').eq(1).click()
            cy.getByData('pdp--product-name').text().then((title) => {
                cy.step('select size')
                cy.getByData('pdp--size-box').not('.oos').first().click()
                cy.step('add to bag')
                cy.getByData('pdp--add-to-bag-button').click()
                cy.getByData('cart--cart-item-product-title')
                    .should('contain', title)
            })
        })
        it('The correct line item price (product price X quantity) is displayed for each line item', () => {
            for (let i = 0; i < 3; i++) {
                cy.step(`click product index ${i}`)
                cy.getByData('product-card').eq(i).click()
                cy.step('select size')
                cy.getByData('pdp--size-box').not('.oos').first().click()
                cy.step('add to bag')
                cy.getByData('pdp--add-to-bag-button').click()
                cy.getByData('pdp--product-name').text().then((product) => {
                    for (let j = 1; j < 5; j++) {
                        cy.get('.product-page-hero-content').find('.product-price').text().then((priceLine) => {
                            let price = Number(priceLine.split('$')[1])
                            cy.getByData('cart--cart-item-product-title').contains(product).parents('[data-test-id="cart--cart-item"]').as('container').find('span.product-price').then((cartPriceLine) => {
                                let cartPrice = Number(cartPriceLine.text().split('$')[1])
                                cy.wrap(cartPrice)
                                    .should('eq', price * j)
                                cy.step('add qty')
                                cy.get('@container').find('.toggle-quantity[data-type="add"]').click().wait(500)
                            })
                        })
                    }
                })
                cy.go('back')
            }
        })
    })
})