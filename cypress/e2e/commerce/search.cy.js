describe('search', () => {
    context('laptop resolution', () => {
      beforeEach(() => {
        cy.viewport(2560, 1440)
      })
    
      it('black shoes', () => {
        cy.visit(Cypress.env('baseURL'))
        
        cy.get('[data-search-btn]').click()
        cy.get('[data-search-input').type('black shoes{enter}')

        cy.url().should('include', 'pages/search-results?q=black%20shoes')
      })
    })
    context('mobile resolution', () => {
      beforeEach(() => {
        cy.viewport(400, 800)
      })
      it('black shoes', () => {
        cy.visit(Cypress.env('baseURL'))
        
        cy.get('[data-search-btn]').click()
        cy.get('[data-search-input').type('black shoes{enter}')

        cy.url().should('include', 'pages/search-results?q=black%20shoes')
      })
    })
  })