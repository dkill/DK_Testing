// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// https://github.com/filiphric/cypress-plugin-steps
// add steps and sections to tests
// cy.step('~~')
// cy.section('~~)
// 
import 'cypress-plugin-steps'

// https://github.com/dmtrKovalenko/cypress-real-events
// need .realClick() to move search slider !!!
import 'cypress-real-events'

// https://github.com/Lakitna/cypress-commands
// .attribute() to yield value of attribute
// .text() to yield text inside element
// .to() to change subject to another type (number to string etc)
import 'cypress-commands'

// https://gitlab.com/kgroat/cypress-iframe
// cy.frameLoaded() checks that iframe has loaded
// cy.iframe(selector) causes subsequent events to execute inside iframe
// cy.enter() executes group of commands inside iframe
//   cy.enter(selector).then(getBody => {})
import 'cypress-iframe'

// https://github.com/bahmutov/cypress-if
// .if()
// .else()
import 'cypress-if'

// https://github.com/cypress-io/cypress/issues/2134#issuecomment-1692593562
// cy.print({title: '~', message: '~', type: '~'})
import './printLog'
