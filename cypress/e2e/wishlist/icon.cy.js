const text = 'SIGN IN TO VIEW UR WISHLIST'

Cypress.env('viewports').forEach((viewport) => {
    describe(`Header heart icon: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
        beforeEach(() => {
            cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn(viewport)
        })
        it('Clicking the heart icon in the header prompts me to log in if I\'m not already logged in', function () {
            cy.step('click wishlist icon')
            cy.get('swym-wishlist-btn').click()
            cy.getByData('login-drawer').should('be.visible')
            cy.section(`The login form text reads ${text}`)
            cy.get('p').contains(text, { matchCase: false })
                .should('be.visible')
        })
        it('After I log in, I am forwarded to the wishlist portal', function () {
            cy.step('click wishlist icon')
            cy.get('swym-wishlist-btn').click()
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
            cy.url()
                .should('include', '/pages/wishlists')
        })
    })
})