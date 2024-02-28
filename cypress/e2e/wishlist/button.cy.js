const text = 'We\'re gonna need you to sign in first ;)'

Cypress.env('viewports').forEach((viewport) => {
    describe(`Add to wishlist button: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
        })
        function wishlistLogin() {
            cy.section(`The login form text reads ${text}`)
            cy.get('p').contains(text, { matchCase: false }).should('be.visible')
            cy.getByData('sign-in-form').within(($form) => {
                cy.fixture('logins').its('wishlist').then(function (user) {
                    this.user = user
                    cy.step('type email')
                    cy.get('input[type="email"]').type(this.user.email)
                    cy.step('type password')
                    cy.get('input[type="password"]').type(this.user.password)
                })
                cy.step('click sign in')
                cy.getByData('sign-in-button').click()
            })
        }
        function addFromCard(container, cardData, title) {
            cy.findData(container, cardData).first().then(card => {
                cy.wrap(card).find(title).then(product => {
                    const productText = product.text()
                    cy.section('Clicking the add to wishlist button prompts me to log in if I\'m not already logged in')
                    cy.step('click add to wishlist button')
                    cy.wrap(card).find('[data-test-id="wishlist-button"]').click()
                    wishlistLogin()
                    cy.section('After successfully signing in, the page auto scrolls to the previous position and opens the add to wishlist drawer with the correct product selected')
                    cy.wrap(card)
                        .should('be.visible')
                    cy.getByData('wishlist-drawer--add--header--product-name').text()
                        .should('to.match', new RegExp(productText, 'i'))
                })
                cy.section('add to wishlist')
                cy.getByData('wishlist-drawer--add--body--list-dropdown-button').click()
                cy.getByData('wishlist-drawer--add--body--list-option').find('p').first().then(list => {
                    const listText = list.text()
                    cy.wrap(list).click()
                    cy.getByData('wishlist-drawer--add--footer--add-to-list-button').click()
                    cy.section('Clicking the add to wishlist button when I am logged in opens the add to wishlist drawer with the correct product selected and my last used wishlist active by default')
                    cy.get(container).find('[data-test-id="wishlist-button"]').not('.wishlist-filled').first().parents(`[data-test-id="${cardData}"]`).then(newCard => {
                        cy.wrap(newCard).find(title).then(newProduct => {
                            const newProductText = newProduct.text()
                            cy.step('click add to wishlist button')
                            cy.wrap(newCard).find('[data-test-id="wishlist-button"]').click()
                            cy.waitUntil(() => cy.get('body').then($ele => $ele.find('[data-test-id="wishlist-drawer--add"]').length > 0))
                            cy.getByData('wishlist-drawer--add--body--list-dropdown-button').find('p').first().text()
                                .should('to.match', new RegExp(listText, 'i'))
                            cy.getByData('wishlist-drawer--add--header--product-name').text()
                                .should('to.match', new RegExp(newProductText, 'i'))
                        })
                    })
                })
            })
        }
        // it('Home page', function () {
        //     cy.visit(Cypress.env('baseURL'))
        //     cy.closeAttn()
        //     addFromCard('[data-test-id="carousel"]', 'product-card', '.product-title a')
        // })
        // it('Search - default', function () {
        //     cy.visit(Cypress.env('baseURL'))
        //     cy.closeAttn()
        //     cy.step('click search button')
        //     cy.getByData('header--search-button').click()
        //     addFromCard('div', 'search--default-product-card', 'h3')
        //     // fails because page redirects to my account after sign in
        // })
        // it('Search - results', function () {
        //     cy.visit(Cypress.env('baseURL'))
        //     cy.closeAttn()
        //     cy.step('click search button')
        //     cy.getByData('header--search-button').click()
        //     cy.getByData('search--search-input').type('purple')
        //     cy.moveSlider('right')
        //     addFromCard('div', 'search--search-product-card', 'h3')
        //     // fails because page redirects to my account after sign in
        // })
        // it('Collection page', function () {
        //     cy.visit(Cypress.env('allNewURL'))
        //     cy.closeAttn()
        //     cy.step('go to all new')
        //     cy.allNew(viewport)
        //     addFromCard('algolia-collection', 'search--search-product-card', 'h3')
        //     // fails because page redirects to my account after sign in
        // })
        it('PDP - main product', function () {
            cy.visit(Cypress.env('allNewURL'))
            cy.closeAttn()
            cy.section('go to pdp')
            cy.step('click first product')
            cy.collectionCard().first().click()
            cy.getByData('pdp--product-name').text().then(name => {
                cy.section('Clicking the add to wishlist button prompts me to log in if I\'m not already logged in')
                cy.step('click add to wishlist button')
                cy.findData('.product-page-hero-content', 'wishlist-button').click()
                wishlistLogin()
                cy.section('After successfully signing in, the add to wishlist drawer opens with the correct product selected')
                cy.getByData('pdp--product-name')
                    .should('be.visible')
                cy.getByData('wishlist-drawer--add--header--product-name').text()
                    .should('to.match', new RegExp(name, 'i'))
            })
            cy.section('add to wishlist')
            cy.step('click list dropdown')
            cy.getByData('wishlist-drawer--add--body--list-dropdown-button').click()
            cy.waitUntil(() => cy.getByData('wishlist-drawer--add--body--list-option').then($ele => $ele.length > 0))
            cy.getByData('wishlist-drawer--add--body--list-option').find('p').first().then(list => {
                const listText = list.text()
                cy.step('select list')
                cy.wrap(list).click()
                cy.getByData('wishlist-drawer--add--footer--add-to-list-button').click()
                cy.section('Clicking the add to wishlist button when I am logged in opens the add to wishlist drawer with the correct product selected and my last used wishlist active by default')
                cy.step('click another product')
                cy.visit(Cypress.env('allNewURL'))
                cy.collectionHeart(0).parents('[data-test-id="search--search-product-card"]').click()
                cy.getByData('pdp--product-name').text().then(name => {
                    cy.step('click add to wishlist button')
                    cy.findData('.product-page-hero-content', 'wishlist-button').scrollIntoView({ offset: { top: -400, left: 0 } }).click()
                    cy.waitUntil(() => cy.get('body').then($ele => $ele.find('[data-test-id="wishlist-drawer--add"]').length > 0))
                    cy.getByData('wishlist-drawer--add--body--list-dropdown-button').find('p').first().text()
                        .should('to.match', new RegExp(listText, 'i'))
                    cy.getByData('wishlist-drawer--add--header--product-name').text()
                        .should('to.match', new RegExp(name, 'i'))
                })
            })
        })
        it('PDP - carousels', function () {
            cy.visit(Cypress.env('allNewURL'))
            cy.closeAttn()
            cy.findData('algolia-collection', 'search--search-product-card').first().click()
            cy.scrollTo('bottom')
            addFromCard('.carousel', 'product-card', '.product-title a')
        })
    })
})