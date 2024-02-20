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
Cypress.Commands.add('findByData', (get, find) => {
	return cy.get(get).find(`[data-test-id="${find}"]`)
})
Cypress.Commands.add('allNew', (viewport) => {
	if (viewport.width > Cypress.env('mobileBreak')) {
		return cy.getByData('header--desktop-link').contains('NEW').click()
	} else {
		return cy.getByData('header--mobile-link').contains('NEW').click()
	}
})
Cypress.Commands.add('clickHeaderLink', (viewport, linkText) => {
	if (viewport.width > Cypress.env('mobileBreak')) {
		return cy.getByData('header--desktop-link').contains(linkText, { matchCase: false }).click()
	} else {
		return cy.getByData('header--mobile-link').contains(linkText, { matchCase: false }).click()
	}
})
Cypress.Commands.add('moveSlider', (direction) => {
	cy.getByData('search--grid-slider').as('slider').click()
	return cy.get('@slider').realType(`{${direction}arrow}`)
})
Cypress.Commands.add('closeAttn', () => {
	cy.waitUntil(() => cy.get('body').then($ele => $ele.find('#attentive_overlay').length > 0))
	return cy.get('#attentive_overlay').invoke('attr', 'style', 'display:none')
})
Cypress.Commands.add('hasPseudoElement', {prevSubject:true}, (subject, pseudo) => {
	return window.getComputedStyle(subject[0], pseudo).content !== 'none'
  })
Cypress.Commands.add('login', (login) => {
		cy.section('sign in')
		cy.step('click my account in footer')
		cy.getByData('footer--account-button').scrollIntoView().click()
		cy.get('input[type="password"]').parents('form').within(($form) => {
			cy.fixture('logins').its(login).then(function (user) {
				this.user = user
				cy.step('type email')
				cy.get('input[type="email"]').type(this.user.email)
				cy.step('type password')
				cy.get('input[type="password"]').type(this.user.password)
			})
			cy.step('click sign in')
			cy.get('button').click()
		})
})
Cypress.Commands.add('collectionCard', () => {
	return cy.get('algolia-collection').find(`[data-test-id="search--search-product-card"]`)
})