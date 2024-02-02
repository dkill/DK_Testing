Cypress.env('viewports').forEach((viewport) => {
    describe(`Wishlist drawer: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(function () {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
            cy.section('login')
            cy.step('click wishlist icon')
            cy.get('.add-to-wishlist-btn[data-wish-action="viewWishlists"]').click()
            cy.get('input[type="password"]').parents('form').within(($form) => {
                cy.fixture('user-login').then((user) => {
                    this.user = user
                    cy.step('type email')
                    cy.get('input[type="email"]').type(this.user.email)
                    cy.step('type password')
                    cy.get('input[type="password"]').type(this.user.password)
                })
                cy.step('click sign in')
                cy.get('button').click()
            })
        })
        it('The selected product image and title are correct', function () {
            cy.step('go to all new')
            cy.allNew(viewport)
            cy.getByData('product-card').first().as('card').find('.product-title a').text().then((name) => {
                cy.get('@card').find('.image-holder').find('img').first().attribute('src').then((src) => {
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
        it.only('Add to wishlist', { scrollBehavior: false }, function () {
            cy.step('go to all new')
            cy.allNew(viewport)
            cy.step('click add to wishlist button')
            cy.getByData('product-card').eq(2).find('.add-to-wishlist-btn').click().wait(500)
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
                cy.getByData('product-card').first().find('.add-to-wishlist-btn').click()
                cy.section('The user\'s last added to wishlist is selected by default')
                cy.step('click add to wishlist button on second product')
                cy.getByData('product-card').eq(1).find('.add-to-wishlist-btn').click()
                cy.get('#headlessui-listbox-button-P0-1').find('p').first().text()
                    .should('eq', listName)

                cy.get('p').contains('Size').siblings('span').within(() => {
                    cy.get('button[disabled]').find('svg')
                        .should('not.exist')
                    cy.get('button').then((sizes) => {
                        cy.log(sizes)
                        // let notOOS = []
                        // sizes.forEach((size) => {
                        //     cy.wrap(size).find('svg').if('not.exist').then(() => {
                        //         notOOS.push(size)
                        //         cy.log(size)
                        //     })
                        // })
                    })
                })
            })

        })
    })
})