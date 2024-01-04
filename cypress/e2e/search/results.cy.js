Cypress.env('viewports').forEach((viewport) => {
	describe(`Search before query is entered: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
			cy.visit(Cypress.env('baseURL'))
			// cy.closeAttn()
			cy.get('[data-search-btn').as('searchBtn')
			cy.get('[data-search-results-container]').as('searchContainer')
			cy.get('input.ais-SearchBox-input').as('searchInput')
			cy.get('@searchContainer').find('.tw-w-full.tw-h-auto').find('h3').as('products')
			cy.get('span.ais-Stats-text').as('results')
			cy.get('a[href="#"]').as('pagination')
			cy.get('@pagination').eq(-2).as('lastPage')
			cy.get('input#algolia-grid-changer').as('slider')
			cy.step('click search button')
			cy.get('@searchBtn').click()
		})
		it('The correct number of search results is displayed on the top left', () => {
			// works with results under 600 (ex "purple", "jeans", "yellow")
			// over 600 is difficult because we only show 5 pages in pagination
			cy.step('type search query')
			cy.get('@searchInput').type('purple shoes').wait(2000)
			cy.step('get product count')
			cy.get('@products').then((products) => {
				const perPage = products.length
				cy.print({ title: 'variable', message: `Products per page: ${perPage}`, type: 'var' })
				cy.get('@pagination').then((pagination) => {
					let pageCount = pagination.length - 2

					if (pageCount > 1) {
						cy.print({ title: 'variable', message: `Page count minus last page: ${pageCount}`, type: 'var' })
						let productCount = pageCount * perPage
						cy.print({ title: 'variable', message: `Product count for full pages: ${productCount}`, type: 'var' })

						cy.get('@lastPage').click().wait(1000)
						cy.get('@products').then((lastProducts) => {
							const lastCount = lastProducts.length
							cy.log(lastCount)
							cy.print({ title: 'variable', message: `Product count for last page: ${lastCount}`, type: 'var' })
							productCount += lastCount
							cy.log(productCount)
							cy.print({ title: 'variable', message: `Final product count: ${productCount}`, type: 'var' })
							cy.get('@results').should('contain', productCount)
						})
					} else {
						cy.get('@results').should('contain', perPage)
					}
				})
			})
		})
		it('The product image should link to that product\'s pdp', () => {
			cy.step('type search term')
			cy.get('@searchInput').type('purple').wait(1000)
			cy.step('make sure slider is at left end')
			cy.get('@slider').click()
			cy.get('@slider').realType('{leftarrow}')
			cy.get('@slider').realType('{leftarrow}')
			cy.step('get first product name')
			cy.get('.tw-w-full.tw-h-auto').first().find('img').as('productImg').attribute('alt').then((name) => {
				cy.step('click on product image')
				cy.get('@productImg').click({ force: true })
				cy.get('h1').should('contain', name)
			})
		})
		it('If I click a product then go back in the browser, the search dropdown should open with the last searched term active and the relevant results displayed', () => {
			cy.step('type search term')
			cy.get('@searchInput').type('purple').wait(1000)
			cy.step('click first product')
			cy.get('.tw-w-full.tw-h-auto').first().find('img').as('productImg').click({ force: true })
			cy.step('go back in browser')
			cy.go('back')
			cy.url().should('include', '?search=purple')
			cy.get('@searchContainer').should('be.visible')
			cy.get('@searchInput').should('have.value', 'purple')
		})
		it('If no search results are returned, there should be some text stating that', () => {
			cy.step('type search term')
			cy.get('@searchInput').type('adslkfjsldf').wait(1000)
			cy.get('h2').contains('no results', { matchCase: false }).should('be.visible')
		})
	})
})
