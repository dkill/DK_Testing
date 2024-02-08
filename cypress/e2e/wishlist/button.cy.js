const text = 'We\'re gonna need you to sign in first ;)'

Cypress.env('viewports').forEach((viewport) => {
    describe(`Add to wishlist button: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
        })
        function wishlistLogin () {
            cy.section(`The login form text should read ${text}`)
            cy.get('p').contains(text, { matchCase: false }).should('be.visible')
            cy.get('input[type="password"]').parents('form').within(($form) => {
                cy.fixture('user-login').then( function (user) {
                    this.user = user
                    cy.step('type email')
                    cy.get('input[type="email"]').type(this.user.email)
                    cy.step('type password')
                    cy.get('input[type="password"]').type(this.user.password)
                })
                cy.step('click sign in')
                cy.get('button').click()
            })
        }
        function addFromCard (container, cardData, title) {
            cy.findByData(container, cardData).first().as('card').find(title).as('productTitle').text().then((name) => {
                cy.section('Clicking the add to wishlist button prompts the user to log in when they are not')
                cy.step('click add to wishlist button')
                cy.get('@card').find('.add-to-wishlist-btn').click()
                wishlistLogin()
                cy.section('After successfully signing in, the page should auto scroll to the previous position and open the add to wishlist drawer with the correct product selected')
                cy.get('@productTitle')
                    .should('be.visible')
                cy.get('h2').contains(name, { matchCase: false })
                    .should('be.visible')
            })
        }
        it('Home page', function () {
            addFromCard('[data-test-id="carousel"]', 'product-card', '.product-title a')
        })
        it('Search - default', function () {
            cy.step('click search button')
            cy.getByData('header--search-button').click()
            addFromCard('div', 'search--default-product-card', 'h3')
            // fails because page redirects to my account after sign in
        })
        it('Search - results', function () {
            cy.step('click search button')
            cy.getByData('header--search-button').click()
            cy.getByData('search--search-input').type('purple')
            cy.moveSlider('right')
            addFromCard('div', 'search--search-product-card', 'h3')
            // fails because page redirects to my account after sign in
        })
        it('Collection page', function () {
            cy.step('go to all new')
            cy.allNew(viewport).wait(1000)
            addFromCard('algolia-collection', 'search--search-product-card', 'h3')
            // fails because page redirects to my account after sign in
        })
        it('PDP', function () {
            cy.allNew(viewport)
            cy.findByData('algolia-collection', 'search--search-product-card').first().click()
            cy.getByData('pdp--product-name').text().then((name) => {
                cy.section('Clicking the add to wishlist button prompts the user to log in when they are not')
                cy.step('click add to wishlist button')
                cy.get('.product-page-hero-content').find('.add-to-wishlist-btn').click()
                wishlistLogin()
                cy.section('After successfully signing in, the page should auto scroll to the previous position and open the add to wishlist drawer with the correct product selected')
                cy.getByData('pdp--product-name')
                    .should('be.visible')
                cy.get('h2').contains(name, { matchCase: false })
                    .should('be.visible')
            })
        })
    })
})