Cypress.env('viewports').forEach((viewport) => {
	describe(`Quick add to cart: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)            
            cy.visit(Cypress.env('baseURL'))
			cy.closeAttn()
		})
		it('Home page carousels', { scrollBehavior: false }, () => {
            cy.get('product-card').first().then((card) => {
                cy.wrap(card).find('.product-title a').then((product) => {
                    const productName = product.text()
                    cy.wrap(card).find('button').first().as('addBtn').scrollIntoView({ offset: { top: -400, left: -400 } }).click()
                    cy.get('@addBtn').siblings().first().find('div').first().as('addDiv').should('be.visible')
                    cy.get('@addDiv').find('label').last().as('size').click()
                    cy.get('@size').siblings('input').then((variant) => {
                        const variantID = variant.attr('value')
                        cy.get('@addDiv').find('button').contains('add to cart').click()
                        cy.get('.drawer1').should('have.class', 'drawer1-open')
                        cy.get('.cart-item').first().as('cartItem').find('.product-title').contains(productName, { matchCase: false }).should('exist')
                        cy.get('@cartItem').find('.product-variant').should('have.attr', 'data-vid', variantID)
                    })
                })
            })
		})
        it('Predictive search', { scrollBehavior: false }, () => {
            cy.get('[data-search-btn]').click()
            cy.get('.ais-Hits-item').first().then((card) => {
                cy.wrap(card).find('h3').then((product) => {
                    const productName = product.text()
                    cy.wrap(card).find('button').eq(1).scrollIntoView({ offset: { top: -400, left: 0 } }).as('addBtn').click()
                    cy.get('@addBtn').siblings().first().find('div').first().as('addDiv').should('be.visible')
                    cy.get('@addDiv').find('label').last().as('size').click()
                    cy.get('@size').siblings('input').then((variant) => {
                        const variantID = variant.attr('value')
                        cy.get('@addDiv').find('button').contains('add to cart').click()
                        cy.get('.drawer1').should('have.class', 'drawer1-open')
                        cy.get('.cart-item').first().as('cartItem').find('.product-title').contains(productName, { matchCase: false }).should('exist')
                        cy.get('@cartItem').find('.product-variant').should('have.attr', 'data-vid', variantID)
                    })
                })
            })
		})
        it.only('Collection page', { scrollBehavior: false }, () => {
			cy.allNew(viewport)
            cy.get('product-card').eq(1).then((card) => {
                cy.wrap(card).find('.product-title a').then((product) => {
                    const productName = product.text()
                    cy.wrap(card).find('button').first().as('addBtn').scrollIntoView({ offset: { top: -400, left: 0 } }).click()
                    cy.get('@addBtn').siblings().first().find('div').first().as('addDiv').should('be.visible')
                    cy.get('@addDiv').find('label').last().as('size').click()
                    cy.get('@size').siblings('input').then((variant) => {
                        const variantID = variant.attr('value')
                        cy.get('@addDiv').find('button').contains('add to cart').click()
                        cy.get('.drawer1').should('have.class', 'drawer1-open')
                        cy.get('.cart-item').first().as('cartItem').find('.product-title').contains(productName, { matchCase: false }).should('exist')
                        cy.get('@cartItem').find('.product-variant').should('have.attr', 'data-vid', variantID)
                    })
                })
            })
		})
        it('PDP: recently viewed', { scrollBehavior: false }, () => {
			cy.allNew(viewport)
            cy.get('product-card').first().click()
            cy.go('back')
            cy.get('product-card').eq(1).click()
            cy.go('back')
            cy.get('product-card').eq(2).click()
            cy.go('back')
            cy.get('product-card').eq(3).click()
            cy.get('.pdp-info').scrollIntoView()
            cy.get('#r-viewed').find('product-card').first().then((card) => {
                cy.wrap(card).find('.product-title a').then((product) => {
                    const productName = product.text()
                    cy.wrap(card).find('button').first().as('addBtn').scrollIntoView({ offset: { top: -400, left: 0 } }).click()
                    cy.get('@addBtn').siblings().first().find('div').first().as('addDiv').should('be.visible')
                    cy.get('@addDiv').find('label').last().as('size').click()
                    cy.get('@size').siblings('input').then((variant) => {
                        const variantID = variant.attr('value')
                        cy.get('@addDiv').find('button').contains('add to cart').click()
                        cy.get('.drawer1').should('have.class', 'drawer1-open')
                        cy.get('.cart-item').first().as('cartItem').find('.product-title').contains(productName, { matchCase: false }).should('exist')
                        cy.get('@cartItem').find('.product-variant').should('have.attr', 'data-vid', variantID)
                    })
                })
            })
		})
        it('PDP: Haul', { scrollBehavior: false }, () => {
			cy.visit('https://www.dollskill.com/products/camel-pure-vigilance-2-0-platform-boots')
            cy.get('.pdp-info').scrollIntoView()
            cy.get('#pair-with').find('product-card').first().then((card) => {
                cy.wrap(card).find('.product-title a').then((product) => {
                    const productName = product.text()
                    cy.wrap(card).find('button').first().as('addBtn').scrollIntoView({ offset: { top: -400, left: -400 } }).click()
                    cy.get('@addBtn').siblings().first().find('div').first().as('addDiv').should('be.visible')
                    cy.get('@addDiv').find('label').first().as('size').click()
                    cy.get('@size').siblings('input').then((variant) => {
                        const variantID = variant.attr('value')
                        cy.get('@addDiv').find('button').contains('add to cart').click()
                        cy.get('.drawer1').should('have.class', 'drawer1-open')
                        cy.get('.cart-item').first().as('cartItem').find('.product-title').contains(productName, { matchCase: false }).should('exist')
                        cy.get('@cartItem').find('.product-variant').should('have.attr', 'data-vid', variantID)
                    })
                })
            })
		})
        it('PDP: Related', { scrollBehavior: false }, () => {
			cy.visit('https://www.dollskill.com/products/camel-pure-vigilance-2-0-platform-boots')
            cy.get('.pdp-info').scrollIntoView()
            cy.get('#related-items').find('product-card').first().then((card) => {
                cy.wrap(card).find('.product-title a').then((product) => {
                    const productName = product.text()
                    cy.wrap(card).find('button').first().as('addBtn').scrollIntoView({ offset: { top: -400, left: -400 } }).click()
                    cy.get('@addBtn').siblings().first().find('div').first().as('addDiv').should('be.visible')
                    cy.get('@addDiv').find('label').first().as('size').click()
                    cy.get('@size').siblings('input').then((variant) => {
                        const variantID = variant.attr('value')
                        cy.get('@addDiv').find('button').contains('add to cart').click()
                        cy.get('.drawer1').should('have.class', 'drawer1-open')
                        cy.get('.cart-item').first().as('cartItem').find('.product-title').contains(productName, { matchCase: false }).should('exist')
                        cy.get('@cartItem').find('.product-variant').should('have.attr', 'data-vid', variantID)
                    })
                })
            })
		})
	})
})