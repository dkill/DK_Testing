Cypress.env('viewports').forEach((viewport) => {
	describe(`Main navigation menu: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
			cy.get('[data-header-nav-drawer-btn]').click()
		})
		it('Clicking hamburger menu opens menu', () => {
			cy.get('#slideover').should('be.visible')
		})
		it('Section links are clickable and show the correct content', () => {
			cy.get('a.tab-handle').each(($el, i, $list) => {
				const sectionID = $el.attr('data-menu-handle')
				cy.wrap($el).click()
				cy.getByDataMenu(sectionID).should('be.visible')
			})
		})
		it('I can scroll to see  content in each section', () => {
			cy.get('a.tab-handle').each(($el, i, $list) => {
				const sectionID = $el.attr('data-menu-handle')
				cy.wrap($el).click()
				cy.getByDataMenu(sectionID).find('a').last().scrollIntoView()
			})
		})
		it('Account button & currency switcher are present only present at the mobile breakpoint', () => {
			if (viewport.width > Cypress.env('mobileBreak')) {
				cy.get('[data-signin-container]').find('button').should('not.be.visible')
			} else {
				cy.get('[data-signin-container]').find('button').should('be.visible')
			}
		})
	})
})
