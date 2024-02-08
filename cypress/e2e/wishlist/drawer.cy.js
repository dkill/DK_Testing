Cypress.env('viewports').forEach((viewport) => {
    describe(`Wishlist drawer: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(function () {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
            cy.login('user-login')
        })
        it('The selected product image and title are correct', function () {
            cy.step('go to all new')
            cy.allNew(viewport)
            cy.collectionCard().first().as('card').find('h3').text().then((name) => {
                cy.get('@card').find('img').first().attribute('src').then((src) => {
                    const imgSrc = src.split(':')[1].replace('_500x', '')
                    cy.step('click add to wishlist button')
                    cy.get('@card').find('.add-to-wishlist-btn').click()
                    cy.get('#headlessui-dialog-P0-0').find('section').first().within(() => {
                        cy.get('h2').contains(name, { matchCase: false })
                            .should('be.visible')
                        cy.get('img').attribute('src')
                            .should('eq', imgSrc)
                        cy.get('img')
                            .should('be.visible')
                            .and($img => expect($img[0].naturalWidth).to.be.gt(0))
                    })
                })
            })
        })
        it('List dropdown', { scrollBehavior: false }, function () {
            cy.step('go to all new')
            cy.allNew(viewport)
            cy.step('click add to wishlist button')
            cy.collectionCard().first().find('.add-to-wishlist-btn').click()
            cy.waitUntil(() => cy.get('#headlessui-dialog-P0-0').first().attribute('data-headlessui-state').then(attr => attr === 'open'))
            cy.get('#headlessui-listbox-button-P0-1').click()
            cy.waitUntil(() => cy.get('#headlessui-listbox-button-P0-1').attribute('aria-expanded').then(attr => attr === 'true'))
            cy.get('ul#headlessui-listbox-options-P0-0 li').eq(1).as('list').find('p').first().text().then((listName) => {
                cy.section('The user can select a different wishlist from the dropdown and see it displayed after the dropdown is closed')
                cy.step('select second list')
                cy.get('@list').click()
                cy.get('#headlessui-listbox-button-P0-1').find('p').first().text()
                    .should('eq', listName)
                cy.step('click add to list')
                cy.get('button').contains('Add To List').click()
                cy.section('The user\'s last added to wishlist is selected by default')
                cy.step('click add to wishlist button on second product')
                cy.collectionCard().eq(1).find('.add-to-wishlist-btn').click()
                cy.get('#headlessui-listbox-button-P0-1').find('p').first().text()
                    .should('eq', listName)
            })
            cy.step('close drawer')
            cy.get('#headlessui-dialog-P0-0').find('section').first().find('svg').click()
            cy.step('remove item from wishlist to reset test')
            cy.collectionCard().first().find('.add-to-wishlist-btn').click()
        })
        it('Selected variant', { scrollBehavior: false }, function () {
            cy.step('go to sale collection page')
            // cy.clickHeaderLink(viewport, 'sale')
            cy.getByData('nav--hamburger').click()
            cy.getByData('nav--menu-section-title').contains('sale', {matchCase: false}).click()
            cy.get('a').contains('Dresses Under $20', {matchCase: false}).click()
            cy.step('click add to wishlist button')
            cy.collectionCard().eq(6).find('.add-to-wishlist-btn').click()
            cy.get('p').contains('Size').siblings('span').within(() => {
                cy.section('Out of stock variants are not selected by default')
                cy.get('button[disabled]')
                    .should('not.have.class', 'tw-text-[#999]')
                cy.section('The smallest available variant is selected by default')
                cy.get('button').then((sizes) => {
                    let notOOS = []
                    for (let i = 0; i < sizes.length; i++) {
                        let currentSize = sizes[i]
                        if (!sizes[i].classList.contains('tw-text-[#999]')) {
                            notOOS.push(sizes[i])
                        }
                    }
                    cy.get('button[disabled]').text()
                        .should('eq', notOOS[0].innerText)
                })
                // SIMPLER SOLUTION ???? :
                // cy.get('button').not('OOS SELECTOR').first()
                //     .should('have.attribute', 'disabled')
                cy.section('The user can see the selected wishlist underline update to the selected variant when clicking a different one')
                cy.get('button[disabled]').parent().as('defaultSize').then((defaultSize) => {
                    cy.wrap(defaultSize).click()
                    cy.wrap(defaultSize)
                        .hasPseudoElement('::after')
                        .should('eq', true)
                    // cy.get('button').not('OOS SELECTOR').eq(1).as('newSize').click
                    cy.get('button.tw-text-black').eq(1).as('newSize').click()
                    cy.get('@newSize').parent()
                        .hasPseudoElement('::after')
                        .should('eq', true)
                    cy.wrap(defaultSize)
                        .hasPseudoElement('::after')
                        .should('eq', false)
                })
            })
        })
        it.only('The user can click out of the drawer or click the x to close the drawer', function () {
            cy.step('go to all new')
            cy.allNew(viewport)
            cy.collectionCard().first().find('.add-to-wishlist-btn').click()
            cy.get('#headlessui-dialog-P0-0').find('section').first().find('svg').click()
            // drawer should not be visible
            cy.get('#headlessui-dialog-P0-0').find('section')
                .should('not.be.visible')
        })
        it('Add to wishlist', function () {
            cy.step('go to all new')
            cy.allNew(viewport)
            cy.collectionCard().first().as('card').find('.add-to-wishlist-btn').as('heart').then((heart) => {
                cy.wrap(heart).click()
                cy.section('The user can click the cta at the bottom to add the item to the selected wishlist')
                cy.get('#headlessui-dialog-P0-0').find('button').contains('add to list', {matchCase: false}).click()
                cy.section('After an item is added to the user\'s wishlist, the drawer should close and the heart icon on the product cared should fill in')
                cy.get('#headlessui-dialog-P0-0').find('section')
                    .should('not.be.visible')
                cy.wrap(heart)
                    .should('have.class', 'wishlist-filled')
                cy.step('remove from wishlist (reset test)')
                cy.wrap(heart).click()
                cy.wrap(heart)
                    .should('not.have.class', 'wishlisted-filled')
            })            
        })
    })
})