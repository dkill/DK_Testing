const mobileBreak = 767
const viewports = [
    { device: 'iPhone', width: 390, height: 844 },
    // { device: 'iPad', width: 834, height: 1194 },
    // { device: 'Desktop', width: 1920, height: 1080 },
    // { device: 'Laptop', width: 2560, height: 1440 }
]

viewports.forEach((viewport) => {
    describe(`Main navigation: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
        })
        context('Menu', () => {
            beforeEach(() => {
                cy.visit(Cypress.env('baseURL'))
                cy.get('.hamburger-icon').click()
            })
            it('Clicking hamburger menu opens menu', () => {
                cy.get('#slideover').should('be.visible')
            })
            it('Section links are clickable and show the correct content', () => {
                cy.get('a.tab-handle').each(($el, i, $list) => {
                    const sectionID = $el.attr('data-menu-handle')
                    cy.wrap($el).click()
                    cy.getByDataMenu(sectionID).should('be.visible');
                })
            })
            it('I can scroll to see all content in each section', () => {
                cy.get('a.tab-handle').each(($el, i, $list) => {
                    const sectionID = $el.attr('data-menu-handle')
                    cy.wrap($el).click()
                    cy.getByDataMenu(sectionID).find('a').last().scrollIntoView()
                })
            })
            it('Account button & currency switcher are present only present at the mobile breakpoint', () => {
                if(viewport.width > mobileBreak) {
                    cy.get('[data-signin-container]').find('button').should('not.be.visible')
                } else {
                    cy.get('[data-signin-container]').find('button').should('be.visible')
                }
            })
        })

        context('Header links', () => {
            beforeEach(() => {
                cy.visit(Cypress.env('baseURL'))
            })
            it.only('Clicking on the main nav links forwards me to the correct URLs', () => {

                
                cy.get('[data-header-main-menu]').find('a').each(($el, i, $list) => {
                        let linkText = $el.text().toLowerCase()
                        if (linkText !== 'sale') {
                            cy.wrap($el).should('have.attr', 'href')
                            .and('include', linkText)
                        } else {
                            cy.wrap($el).should('have.attr', 'href')
                            .and('include', 'clearance')
                        }

                            // let linkText = $el.text().toLowerCase()
                            // cy.wrap($el).as('link').click()
                            // cy.url().should('contain', linkText)
                })

                // cy.get('[data-header-main-menu]').find('li').contains('NEW').click()
                // cy.url().should('contain', '/collections/whats-new')
                // cy.get('[data-header-main-menu]').find('li').contains('COLLABS').click()
                // cy.url().should('contain', '/collections/exxclusive-collabs')
                // cy.get('[data-header-main-menu]').find('li').contains('SALE').click()
                // cy.url().should('contain', '/collections/clearance')
            })
        })

        context('Search', () => {
            beforeEach(() => {
                cy.visit(Cypress.env('baseURL'))
            })
            it('Clicking on the search icon shows the search bar and focuses on the input', () => {
                cy.get('[data-search-btn]').click()
                cy.get('[data-search-bar]').should('be.visible')
                cy.get('.ais-SearchBox-input').should('be.focused')
            })
        })

        context('Currency selector', () => {
            beforeEach(() => {
                cy.visit(Cypress.env('baseURL'))
            })
            it('Clicking on the currency switcher shows the modal for changing currency', () => {
                if(viewport.width > mobileBreak) {
                    cy.get('[data-country-selector]').click()
                    cy.get('.dk-country-selector').should('be.visible')
                } else {
                    cy.get('.hamburger-icon').click()
                    cy.get('[data-signin-container]').find('i').click()
                    cy.get('h2').contains('Update Your Shipping Country').should('be.visible')
                }
            })
        })

        context('Cart', () => {
            beforeEach(() => {
                cy.visit(Cypress.env('baseURL'))
            })
            it('Clicking on the cart box renders the mini cart', () => {
                cy.get('[data-mini-cart-btn]').click()
                cy.get('.drawer1').should('have.class', 'drawer1-open')
            })
            it('Cart box background color is different when cart is empty vs not empty', { scrollBehavior: false }, () => {
                cy.get('[data-mini-cart-btn').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
                cy.get('a').contains('NEW').click()
                cy.get('[data-mini-cart-btn').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
                cy.get('.image-holder').first().find('button').click()
                cy.get('button').contains('add to cart').click()
                cy.get('[data-mini-cart-btn').should('have.css', 'background-color', 'rgb(60, 60, 60)')
                cy.get('[data-header-logo] > a').click()
                cy.get('[data-mini-cart-btn').should('have.css', 'background-color', 'rgb(60, 60, 60)')
            })
            it('Cart count updates when an item is added to the cart', { scrollBehavior: false }, () => {
                cy.get('a').contains('NEW').click()
                cy.get('#bag-count').should('have.text', '0')
                cy.get('.image-holder').first().find('button').click()
                cy.get('button').contains('add to cart').click()
                cy.get('#bag-count').should('have.text', '1')
            })
        })
    })
})