describe('template spec', () => {
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
})