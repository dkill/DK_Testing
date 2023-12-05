Cypress.env('viewports').forEach((viewport) => {
	describe(`Main navigation: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
		})
		context('Menu', () => {
			beforeEach(() => {
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
		context('Header links', () => {
			beforeEach(() => {
				cy.visit(Cypress.env('baseURL'))
				cy.closeAttn()
			})
			it('Clicking on the main nav links forwards me to the correct URLs', function () {
				if (viewport.width > Cypress.env('mobileBreak')) {
					cy.get('[data-header-main-menu]').find('li.header-nav-link-li').as('list')
				} else {
					cy.get('[data-header-main-menu]').find('li.header-nav-link-li').not('.tw-hidden').as('list')
				}
				cy.get('@list').eq(0).find('a').as('firstLink')
				cy.get('@list').eq(1).find('a').as('secondLink')
				cy.get('@list').eq(2).find('a').as('thirdLink')
				cy.get('@firstLink').then((link) => {
					const linkText = link.text()
					cy.get('@firstLink').click()
					cy.get('h1').contains(linkText, { matchCase: false }).should('exist')
				})
				cy.get('@secondLink').then((link) => {
					const linkText = link.text()
					cy.get('@secondLink').click()
					cy.get('h1').contains(linkText, { matchCase: false }).should('exist')
				})
				cy.get('@thirdLink').then((link) => {
					const linkText = link.text()
					cy.get('@thirdLink').click()
					cy.get('h1').contains(linkText, { matchCase: false }).should('exist')
				})
			})
		})
		context('Search', () => {
			beforeEach(() => {
				cy.visit(Cypress.env('baseURL'))
				cy.closeAttn()
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
				cy.closeAttn()
			})
			it('Clicking on the currency switcher shows the modal for changing currency', () => {
				if (viewport.width > Cypress.env('navBreak')) {
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
				cy.closeAttn()
			})
			it('Clicking on the cart box renders the mini cart', () => {
				cy.get('[data-mini-cart-btn]').click()
				cy.get('.drawer1').should('have.class', 'drawer1-open')
			})
			it('Cart box background color is different when cart is empty vs not empty', { scrollBehavior: false }, () => {
				cy.allNew(viewport)
				cy.get('[data-mini-cart-btn]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
				cy.get('[data-quickview-container]').first().find('button').click().wait(2000)
				cy.get('button').contains('add to cart').click()
				cy.get('[data-mini-cart-btn]').should('have.css', 'background-color', 'rgb(60, 60, 60)')
				cy.get('.remove-button').click()
				cy.get('[data-mini-cart-btn]').should('have.css', 'background-color', 'rgba(0, 0, 0, 0)')
			})
			it('Cart count updates when an item is added to the cart', { scrollBehavior: false }, () => {
				cy.allNew(viewport)
				cy.get('#bag-count').should('have.text', '0')
				cy.get('[data-quickview-container]').first().find('button').click().wait(2000)
				cy.get('button').contains('add to cart').click()
				cy.get('#bag-count').should('have.text', '1')
				cy.get('.remove-button').click()
				cy.get('#bag-count').should('have.text', '0')
			})
		})
	})
})
