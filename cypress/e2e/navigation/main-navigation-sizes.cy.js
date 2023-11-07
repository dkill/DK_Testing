const sizes = [[390, 844], [834, 1194], [1920,1080], [2560,1440]]

describe('Main navigation', () => {
    context('Menu', () => {
        beforeEach(() => {
            cy.visit(Cypress.env('baseURL'))
        })
        sizes.forEach((size) => {
            it(`Open menu: ${size[0]} x ${size[1]}`, () => {
                if (Cypress._.isArray(size)) {
                    cy.viewport(size[0], size[1])
                } else {
                    cy.viewport(size)
                }

                cy.getByData('open-menu').click()
                cy.get('#slideover').should('be.visible')
            })
            it(`Section links are clickable and open the correct div: ${size[0]} x ${size[1]}`, () => {
                if (Cypress._.isArray(size)) {
                    cy.viewport(size[0], size[1])
                } else {
                    cy.viewport(size)
                }
                
                cy.getByData('open-menu').click()
                cy.getByData('drawer-section-a').each(($el, i, $list) => {
                    const sectionID = $el.attr('data-menu-handle')
    
                    cy.wrap($el).click()
                    cy.getByDataMenu(sectionID).should('be.visible');
                })
            })
            it.only(`I can scroll to see all content in each section: ${size[0]} x ${size[1]}`, () => {
                if (Cypress._.isArray(size)) {
                    cy.viewport(size[0], size[1])
                } else {
                    cy.viewport(size)
                }

                cy.getByData('open-menu').click()
                cy.getByData('drawer-section-a').each(($el, i, $list) => {
                    const sectionID = $el.attr('data-menu-handle')
    
                    cy.wrap($el).click()
                    cy.getByDataMenu(sectionID).find('a').last().scrollIntoView()
                })
            })
    })
})
})