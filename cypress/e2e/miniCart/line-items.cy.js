Cypress.env('viewports').forEach((viewport) => {
    describe(`Add to cart from PDP: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            // cy.closeAttn()
        })
        it('The correct product image is displayed for a given line item', () => {
            cy.step('go to all new')
            cy.allNew(viewport)
            cy.step('click second product')
            cy.getByData('product-card').eq(1).click()
            cy.get('img.pdpimage').first().attribute('src').then((src) => {
                const img = src.split('products/')[1]

                cy.print({title: 'img', message: img, type: 'var'})
            })
        })
    })
})