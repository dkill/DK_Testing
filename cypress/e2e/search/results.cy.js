const searchTerm = "purple"

Cypress.env('viewports').forEach((viewport) => {
	describe(`Search results: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
			cy.intercept({ resourceType: /xhr|fetch/ }, { log: false })
			cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
			cy.getByData('search--search-input').as('searchInput')
			cy.getByData('search--search-product-card').as('products')
			cy.getByData('search--pagination').find('a[aria-label]').as('pagination')
			cy.get('@pagination').eq(-1).as('lastPage')
			cy.step('click search button')
			cy.getByData('header--search-button').click()
		})
		it('The correct number of search results is displayed on the top left', () => {
			function goToLastPage() {
				cy.get('@products').then((count) => {
					const perPageCount = count.length
					if (perPageCount === 120) {
						cy.get('@lastPage').wait(500).click().then(goToLastPage)
					} else {
						cy.log('end')
					}
				})
			}
			cy.step('type search query')
			cy.get('@searchInput').type(searchTerm).wait(2000)
			cy.step('get product count')
			cy.get('@products').then((products) => {
				const perPage = products.length
				cy.get('@pagination').then((pagination) => {
					let pageCount = pagination.length - 1
					if (pageCount === 1) {
						cy.getByData('search--search-results-count').should('contain', perPage)
					} else {
						cy.step('go to last page')
						goToLastPage()
						cy.get('@products').then((lastProducts) => {
							const lastCount = lastProducts.length
							cy.get('@lastPage').then((lastPage) => {
								pageCount = Number(lastPage.text()) - 1
								let productCount = pageCount * perPage + lastCount
								cy.getByData('search--search-results-count')
									.should('contain', productCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
							})
						})
					}
				})
			})
		})
		it('The product image should link to that product\'s pdp', () => {
			cy.step('type search term')
			cy.get('@searchInput').type(searchTerm).wait(1000)
			cy.step('move slider')
			cy.moveSlider('right')
			cy.step('get first product name')
			cy.getByData('search--search-product-card-name-and-brand').first().find('h3').text().then((name) => {
				cy.step('click on product')
				cy.get('@products').first().click()
				cy.get('h1').should('contain', name)
			})
		})
		it('If I click a product then go back in the browser, the search dropdown should open with the last searched term active and the relevant results displayed', () => {
			cy.step('type search term')
			cy.get('@searchInput').type(searchTerm).wait(1000)
			cy.step('click first product')
			cy.get('@products').first().click()
			cy.step('go back in browser')
			cy.go('back')
			cy.url().should('include', `?search=${searchTerm}`)
			cy.getByData('search--search-container').should('be.visible')
			cy.get('@searchInput').should('have.value', searchTerm)
		})
		it('If no search results are returned, there should be some text stating that', () => {
			cy.step('type search term')
			cy.get('@searchInput').type('adslkfjsldf').wait(1000)
			cy.get('h2').contains('no results', { matchCase: false }).should('be.visible')
		})
	})
})