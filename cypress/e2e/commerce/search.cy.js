describe('Search', () => {
    context('laptop resolution', () => {
      beforeEach(() => {
        cy.viewport(2560, 1440)
      })
  
      it('passes', () => {
        cy.visit('https://dollskill.com')
        
        cy.get('[data-tag="Whats New"]').contains('What\'s New').click()
  
        cy.url().should('include', '/collections/whats-new')
      })
    })
    context('mobile resolution', () => {
        cy.viewport(400, 800)
    })

    it ('passes', () => {
        cy.visit('https://dollskill.com')
        
        cy.get('[data-tag="Whats New"]').contains('What\'s New').click()
  
        cy.url().should('include', '/collections/whats-new')
    })
  })