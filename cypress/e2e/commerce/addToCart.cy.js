describe('add to cart', () => {
  context('laptop resolution', () => {
    beforeEach(() => {
      cy.viewport(2560, 1440)
    })
  
    it('quick add from collection', { scrollBehavior: false }, () => {
      cy.visit(Cypress.env('baseURL'))
        
      cy.get('[data-header-nav-drawer-btn]').click()
      cy.get('a').contains('All New').click()
  
      cy.url().should('include', '/collections/whats-new')

      cy.getByDataId('8044946325761').find('button').click()
      cy.getByDataId('8044946325761').find('label').contains('M').click()
      cy.getByDataId('8044946325761').find('button').contains('add to cart').click()

      cy.get('.cart-content').contains('Love In The Air Knit Sweater - Blue')
      cy.get('.product-variant').contains('Medium')
    })

    it('add from pdp', () => {
      //cy.visit(Cypress.env('baseURL'))
        
      //cy.get('[data-header-nav-drawer-btn]').click()
      //cy.get('a').contains('All New').click()
  
      //cy.url().should('include', '/collections/whats-new')
      cy.visit('https://dollskill.com/collections/whats-new')

      cy.getByDataId('8044946325761').find('a').contains('Love In The Air Knit Sweater - Blue').click()
      cy.get('.size-box').contains('M').click()
      cy.get('button').contains('Add To Bag').click()

      cy.get('.cart-content').contains('Love In The Air Knit Sweater - Blue')
      cy.get('.product-variant').contains('Medium')
    })
  })
  context('mobile resolution', () => {
    beforeEach(() => {
      cy.viewport(400, 800)
    })
    it('quick add from collection', { scrollBehavior: false }, () => {
      cy.visit(Cypress.env('baseURL'))
        
      cy.get('[data-header-nav-drawer-btn]').click()
      cy.get('a').contains('All New').click()
  
      cy.url().should('include', '/collections/whats-new')

      cy.getByDataId('8044946325761').find('button').click()
      cy.getByDataId('8044946325761').find('label').contains('M').click()
      cy.getByDataId('8044946325761').find('button').contains('add to cart').click()
      cy.get('#rendercart').click()

      cy.get('.cart-content').contains('Love In The Air Knit Sweater - Blue')
      cy.get('.product-variant').contains('Medium')
    })
    it('add from pdp', () => {
      //cy.visit(Cypress.env('baseURL'))
        
      //cy.get('[data-header-nav-drawer-btn]').click()
      //cy.get('a').contains('All New').click()
  
      //cy.url().should('include', '/collections/whats-new')
      cy.visit('https://dollskill.com/collections/whats-new')

      cy.getByDataId('8044946325761').find('a').contains('Love In The Air Knit Sweater - Blue').click()
      cy.get('.size-box').contains('M').click()
      cy.get('button').contains('Add To Bag').click()
      cy.get('#rendercart').click()

      cy.get('.cart-content').contains('Love In The Air Knit Sweater - Blue')
      cy.get('.product-variant').contains('Medium')
    })
  })
})