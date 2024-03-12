Cypress.env('viewports').forEach((viewport) => {
	describe(`Login links: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
            cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
		})
        it(`Clicking on the account links in the footer won't let me proceed to the account section unless I'm logged in`, function () {
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
            cy.getByData('footer--footer-section-title').contains('account', { matchCase: false }).click()
            cy.getByData('footer--account-button').click()
            cy.getByData('login-drawer')
                .should('be.visible')
            cy.url()
                .should('not.include', 'account')
        })
        it('Going directly to the /account page without being logged in redirects me to a login page', function () {
            cy.visit(Cypress.env('baseURL') + '/account')
            cy.closeAttn()
            cy.url()
                .should('include', 'login')
            cy.get('#sign-in-form')
                .should('be.visible')
        })
        it('Going directly to the /account page without being logged in redirects me to a login page', function () {
            cy.visit(Cypress.env('baseURL') + '/pages/wishlists')
            cy.closeAttn()
            cy.url()
                .should('include', 'login')
            cy.getByData('login-drawer')
                .should('be.visible')
        })
	})
})