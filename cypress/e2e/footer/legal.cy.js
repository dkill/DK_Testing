Cypress.env('viewports').forEach((viewport) => {
	describe(`Footer legal: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
		it('I can click on all of the legal links and be forwarded to the right pages', () => {
			const pages = [
				{ linkText: 'Privacy Policy', header: 'Privacy Policy', url: '/pages/privacy-policy' },
				{ linkText: 'Terms Of Use', header: 'Terms of Use', url: '/pages/termsofuse' },
				{ linkText: 'Cookie Policy', header: 'Cookie Policy', url: '/pages/cookie-policy' },
				{ linkText: 'Accessibility', header: 'Accessibility', url: '/pages/accessibility' },
			]
			pages.forEach((page) => {
				cy.get('#footer-legal').find('a').contains(page.linkText).click()
				if (page.external === true) {
					const pageURL = page.url
					cy.origin(pageURL, { args: { pageURL } }, ({ pageURL }) => {
						cy.url().should('include', pageURL)
						cy.go('back')
					})
				} else if (page.header === '') {
					cy.url().should('include', page.url)
					cy.go('back')
				} else {
					cy.get('h1').contains(page.header).should('exist')
					cy.go('back')
				}
			})
		})
		it('The copyright text reads as it should', () => {
			cy.get('.footer-item-10').contains('Copyright © 2023 dollskill.com. All Rights Reserved.').should('be.visible')
		})
	})
})
