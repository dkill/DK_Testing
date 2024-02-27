describe('Test setup', () => {
    beforeEach(() => {
        cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
    })
    it('Add items to wishlist', function () {
        cy.login('wishlist')
        cy.visit(Cypress.env('wishlistURL'))
        cy.getByData('wishlist-portal--lists--list-grid--list').contains('my wishlist', { matchCase: false }).click()
        cy.getByData('search--default-product-card').then(cards => {
            if (cards.length < 10) {
                cy.visit('https://www.dollskill.com/collections/new-arrivals-accessories')
                cy.getByData('header--desktop-link').eq(2).click()
                for (let i = 0; i < 20; i++) {
                    cy.collectionCard().find('button[data-test-id="wishlist-button"]').not('.wishlist-filled').eq(i).click()
                    cy.getByData('wishlist-drawer--add--body--list-dropdown-button').find('p').first().text().then(defaultList => {
                        if (defaultList === "My Wishlist") {
                            cy.getByData('wishlist-drawer--add--footer--add-to-list-button').click()
                        } else {
                            cy.getByData('wishlist-drawer--add--body--list-dropdown-button').click()
                            cy.getByData('wishlist-drawer--add--body--list-option').contains('My Wishlist', { matchCase: false }).click()
                            cy.getByData('wishlist-drawer--add--footer--add-to-list-button').click()
                        }
                    })
                }
            }
        })
    })
    it('Delete "test" wishlist', function () {
        cy.login('wishlist')
        cy.visit(Cypress.env('wishlistURL'))
        cy.getByData('wishlist-portal--lists--list-grid--list--name').text().then(lists => {
            if (lists.includes('test list')) {
                cy.getByData('wishlist-portal--lists--list-grid--list').contains('test list', { matchCase: false }).click()
                cy.getByData('wishlist-portal--detail--delete-button').click()
                cy.getByData('wishlist-drawer--delete').find('button[type="submit"]').click()
            }
        })
    })
    it('Add "delete" wishlist', function () {
        cy.login('wishlist')
        cy.visit(Cypress.env('wishlistURL'))
        cy.getByData('wishlist-portal--lists--list-grid--list--name').text().then(lists => {
            if (!lists.includes('delete')) {
                cy.getByData('wishlist-portal--lists--create-wishlist-button').click()
                cy.getByData('wishlist-drawer--create--name-input').type('delete')
                cy.getByData('wishlist-drawer--create--submit').click()
            }
        })
    })
})