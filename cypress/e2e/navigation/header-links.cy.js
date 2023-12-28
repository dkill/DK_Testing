Cypress.env('viewports').forEach((viewport) => {
	describe(`Main navigation header links: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
		it('Clicking on the main nav links forwards me to the correct URLs', function () {
            const pages = [
				{ linkText: 'NEW', header: 'New', url: '/collections/whats-new' },
				{ linkText: 'SHOES', header: 'Shoes', url: '/collections/shoes' },
				{ linkText: 'SALE', header: 'Sale', url: '/collections/clearance' }
			]
            if (viewport.width > Cypress.env('mobileBreak')) {
				cy.get('[data-header-main-menu]').find('li.header-nav-link-li').as('list')
			} else {
				cy.get('[data-header-main-menu]').find('li.header-nav-link-li').not('.tw-hidden').as('list')
			}
			pages.forEach((page) => {
				cy.get('@list').find('a').contains(page.linkText).click()
				cy.get('h1').contains(page.header).should('exist')
				cy.go('back')
			})
		})
	})
})
