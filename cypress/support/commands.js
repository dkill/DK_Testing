// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.on('uncaught:exception', (err, runnable) => {
	// returning false here prevents Cypress from
	// failing the test
	return false
})

Cypress.Commands.add('getByData', (selector) => {
	return cy.get(`[data-test-id="${selector}"]`)
})
Cypress.Commands.add('getByDataId', (selector) => {
	return cy.get(`[data-id="${selector}"]`)
})
Cypress.Commands.add('getByDataMenu', (selector) => {
	return cy.get(`[data-menu-content="${selector}"]`)
})
Cypress.Commands.add('getByDataMenuHandle', (selector) => {
	return cy.get(`[data-menu-handle="${selector}"]`)
})
Cypress.Commands.add('allNew', (viewport) => {
	if (viewport.width > Cypress.env('mobileBreak')) {
		return cy.getByData('header--desktop-link').contains('NEW').click()
	} else {
		return cy.getByData('header--mobile-link').contains('NEW').click()
	}
})
Cypress.Commands.add('closeAttn', () => {
	cy.wait(5000)
	return cy.get('body').then(($ele) => {
		if ($ele.find('#attentive_overlay').length > 0) {
			cy.get('#attentive_overlay').invoke('attr', 'style', 'display:none')
		}
	})
})