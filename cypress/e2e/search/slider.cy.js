const searchTerm = "purple"

Cypress.env('viewports').forEach((viewport) => {
    describe(`Search slider: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
            cy.getByData('header--search-button').as('searchBtn')
            cy.getByData('search--search-input').as('searchInput')
            cy.getByData('search--grid-slider').as('slider')
            cy.getByData('search--search-results-grid').as('grid')
        })
        it('A slider is displayed on the left and adjusts the number of columns for the product grid', () => {
            if (viewport.width > Cypress.env('mobileBreak')) {
                cy.step('click search button')
                cy.get('@searchBtn').click()
                cy.step('type search term')
                cy.get('@searchInput').type(searchTerm).wait(1000)
                cy.get('@slider').should('be.visible')
                cy.section('move slider to right end')
                cy.moveSlider('right')
                cy.moveSlider('right')
                cy.get('@grid').should('have.class', 'md:tw-grid-cols-2')
                cy.section('move slider to middle')
                cy.moveSlider('left')
                cy.get('@grid').should('have.class', 'md:tw-grid-cols-4')
                cy.section('move slider to left end')
                cy.moveSlider('left')
                cy.get('@grid').should('have.class', 'md:tw-grid-cols-8')
            } else {
                cy.section('Test mobile on phone & browserstack!')
            }
        })
        it('When the slider is all the way to the left, everything but the product image should be hidden', () => {
            cy.step('click search button')
            cy.get('@searchBtn').click()
            cy.step('type search term')
            cy.get('@searchInput').type(searchTerm).wait(1000)
            cy.step('make sure slider is at left end')
            cy.moveSlider('left')
            cy.moveSlider('left')
            cy.getByData('search--search-product-card-name-and-brand').should('not.exist')
            cy.getByData('search--search-product-card-price').should('not.exist')
        })
    })
})
