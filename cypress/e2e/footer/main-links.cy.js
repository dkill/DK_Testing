Cypress.env('viewports').forEach((viewport) => {
	describe(`Footer links: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
		it('All of the links under ACCOUNT forward me to the correct page', function () {
			const pages = [
				{ linkText: 'Order Status', header: 'Order Status', url: 'help.dollskill.com/order-problems/order-status' },
				{ linkText: 'My Account', header: 'My Account', url: '/account' },
				{ linkText: 'Favorites', header: 'Wishlist', url: '/pages/wishlist' },
				{ linkText: 'Start A Return', header: '', url: '/apps/returns' },
			]
			cy.get('.footer-title').contains('Account').click()
			cy.get('[data-target="Account"]').find('a.footer-item').contains('My Account').click()
			cy.fixture('user-login').then((user) => {
				this.user = user
				cy.get('.account-login').find('input[type="email"]').type(this.user.email)
				cy.get('button.login-button').click()
				cy.get('.account-login').find('input[type="password"]').type(this.user.password)
				cy.get('button.login-button').click()
			})
			cy.get('[data-header-logo]').click()
			pages.forEach((page) => {
				cy.get('.footer-title').contains('Account').click()
				cy.get('a.footer-item').not('.tw-hidden').contains(page.linkText).click()
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
		it('All of the links under HELP forward me to the correct page', function () {
			const pages = [
				{ linkText: 'FAQ', header: 'Customer Service', url: 'help.dollskill.com' },
				{ linkText: 'Shipping Info', header: 'Shipping Information', url: 'help.dollskill.com/shipping-delivery/shipping-information' },
				{ linkText: 'Returns & Exchanges', header: 'Returns', url: 'help.dollskill.com/returns' },
				{ linkText: 'Payments', header: 'Payments & Promos', url: 'help.dollskill.com/payments-promos' },
				{ linkText: 'Customer Service', header: 'Customer Service', url: 'help.dollskill.com' },
			]
			pages.forEach((page) => {
				cy.get('.footer-title').contains('Help').click()
				cy.get('a.footer-item').not('.tw-hidden').contains(page.linkText).click()
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
		it('All of the links under ABOUT forward me to the correct page', function () {
			const pages = [
				{ linkText: 'About', header: '', url: '/pages/about' },
				{ linkText: 'Store Locations', header: '', url: '/pages/store-locations' },
				{ linkText: 'Size Guide', header: 'Size Guide', url: 'help.dollskill.com/product-stock/size-guide' },
				{ linkText: 'Careers', header: '', url: 'jobs.lever.co/dollskill', external: true },
				{ linkText: 'Gift Cards', header: 'Dolls Kill Gift Cards', url: '/collections/gift-cards' },
				{ linkText: 'App', header: '', url: '/pages/app' },
			]
			pages.forEach((page) => {
				cy.get('.footer-title').contains('About').click()
				cy.get('a.footer-item').not('.tw-hidden').contains(page.linkText).click()
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
	})
})
