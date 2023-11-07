const mobileBreak = 767

const viewports = {
    'iPhone': [390, 844],
    'iPad': [834, 1194],
    'Desktop': [1920, 1080],
    'Laptop': [2560, 1440]
}
const viewport = 'iPhone'
const viewportSize = viewports[viewport]

describe(`Main navigation: ${viewport}`, () => {

    context('Menu', () => {
        beforeEach(() => {
            cy.viewport(viewportSize[0], viewportSize[1])
            cy.visit(Cypress.env('baseURL'))
            cy.getByData('open-menu').click()
        })
        it('Clicking hamburger menu opens menu', () => {
            cy.get('#slideover').should('be.visible')
        })
        it('Section links are clickable and shows the correct content', () => {
            cy.getByData('drawer-section-a').each(($el, i, $list) => {
                const sectionID = $el.attr('data-menu-handle')
    
                cy.wrap($el).click()
                cy.getByDataMenu(sectionID).should('be.visible')
            })
        })
        it('I can scroll to see all content in each section', () => {
            cy.getByData('drawer-section-a').each(($el, i, $list) => {
                const sectionID = $el.attr('data-menu-handle')

                cy.wrap($el).click()
                cy.getByDataMenu(sectionID).find('a').last().scrollIntoView()
            })
        })
        it('Account button & currency switcher are present only present at the mobile breakpoint', () => {
            if(viewportSize[0] > mobileBreak) {
                cy.get('[data-signin-container]').find('button').should('not.be.visible')
            } else {
                cy.get('[data-signin-container]').find('button').should('be.visible')
            }
        })
    })

    context('Mobile login', () => {
        beforeEach(() => {
            cy.viewport(viewportSize[0], viewportSize[1])
            cy.visit(Cypress.env('baseURL'))
            cy.getByData('open-menu').click()
        })
        it('Clicking on the mobile account button opens the login form', () => {
            if(viewportSize[0] <= mobileBreak) {
                cy.getByData('mobile-account-button').click()
                cy.getByData('mobile-login-form').should('be.visible')
            }
        })
        // it('Users can sign in', () => {
        //     if(viewportSize[0] <= mobileBreak) {
        //         cy.getByData('mobile-account-button').click()
        //         cy.getByData('mobile-login-form').within(($form) => {
        //             cy.get('input[type="email"]').type('celina.oh@dollskill.com')
        //             cy.get('input[type="password"]').type('hyvzim-teDmy7-sewnyq')
        //             cy.get('a').contains('SIGN IN').click()
        //         })
        //     }
        // })
        it('Users can create an account', () => {
            if(viewportSize[0] <= mobileBreak) {
                cy.get('[data-signin-container]').find('button').contains('ACCOUNT').click()
                cy.get('[data-signin-container]').find('form').within(($form) => {
                    cy.get('a').contains('CREATE AN ACCOUNT').click()
                    cy.get('input[id="first-name"]').type('Celina')
                    cy.get('input[id="last-name"]').type('Oh')
                    cy.get('input[id="email"]').type('celinatest12@test.com')
                    cy.get('input[id="password"]').type('dollskill123!')
                    cy.get('a').contains('CREATE ACCOUNT').click()
                    cy.url().should('include', '/account')
                })
            }
        })
    })

    context('Header links', () => {
        beforeEach(() => {
            cy.viewport(viewportSize[0], viewportSize[1])
            cy.visit(Cypress.env('baseURL'))
        })
        it('Clicking on the main nav links forwards me to the correct URLs', () => {
            cy.getByData('header-nav-links').contains('NEW').click()
            cy.url().should('contain', '/collections/whats-new')
            cy.getByData('header-nav-links').contains('HALLOWEEN').click()
            cy.url().should('contain', '/pages/halloween')
            cy.getByData('header-nav-links').contains('SALE').click()
            cy.url().should('contain', '/collections/clearance')
        })
        
    })

    context('Search', () => {
        beforeEach(() => {
            cy.viewport(viewportSize[0], viewportSize[1])
            cy.visit(Cypress.env('baseURL'))
        })
        it.only('Clicking on the search icon shows the search bar and focuses on the input', () => {
            cy.getByData('nav-search-icon').click()
            cy.getByData('search-bar').should('be.visible')
            cy.getByData('search-input').should('be.focused')
        })
        
    })

    context('Currency selector', () => {
        beforeEach(() => {
            cy.viewport(viewportSize[0], viewportSize[1])
            cy.visit(Cypress.env('baseURL'))
        })
        it.only('Clicking on the currency switcher shows the modal for changing currency', () => {
            if(viewportSize[0] > mobileBreak) {
                cy.getByData('desktop-currency').click()
                cy.getByData('currency-selector').should('be.visible')
            } else {
                cy.getByData('open-menu').click()
                cy.getByData('mobile-currency').click()
            }
        })
        
    })

    context('Mobile login - dollskill.com', () => {
        beforeEach(() => {
            cy.viewport(viewportSize[0], viewportSize[1])
            cy.visit('https://dollskill.com')
            cy.get('.hamburger-icon').click()
        })
        it('Clicking on the mobile account button opens the login form', () => {
            if(viewportSize[0] <= mobileBreak) {
                cy.getByData('mobile-account-button').click()
                cy.getByData('mobile-login-form').should('be.visible')
            }
        })
        it('Users can sign in', () => {
            if(viewportSize[0] <= mobileBreak) {
                cy.get('[data-signin-container]').find('button').contains('ACCOUNT').click()
                cy.get('[data-signin-container]').find('form').within(($form) => {
                    cy.get('input[type="email"]').type('celina.oh@dollskill.com')
                    cy.get('input[type="password"]').type('hyvzim-teDmy7-sewnyq')
                    cy.get('a').contains('SIGN IN').click()
                    cy.url().should('include', '/account?wi=1')
                })
            }
        })
    })
})