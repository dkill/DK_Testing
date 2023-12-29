Cypress.env('viewports').forEach((viewport) => {
	describe(`Footer icons: ${viewport.device} (${viewport.width} x ${viewport.height})`, () => {
		beforeEach(() => {
			cy.viewport(viewport.width, viewport.height)
            cy.visit(Cypress.env('baseURL'))
            cy.closeAttn()
		})
        it('I can click the TikTok icon and be forwarded to the Dolls Kill TikTok page', () => {
            cy.get('#footer-socials').find('a').first().as('tiktok')
            cy.get('@tiktok').invoke('attr', 'href').then((url) => {
                cy.get('@tiktok').invoke('removeAttr', 'target').click()
                cy.origin(url, { args: { url } }, ({ url }) => {
                    cy.url().should('include', url)
                    cy.go('back')
                })
            })
        })
        it('I can click the Instagram icon and be forwarded to the Dolls Kill Instagram page', () => {
            cy.get('#footer-socials').find('a').eq(1).as('ig')
            cy.get('@ig').invoke('attr', 'href').then((url) => {
                cy.get('@ig').invoke('removeAttr', 'target').click()
                cy.origin(url, { args: { url } }, ({ url }) => {
                    cy.url().should('include', url)
                    cy.go('back')
                })
            })
        })
        it('I can click the Apple App Store download icon and be forwarded to the right url', () => {
            if (viewport.width < Cypress.env('mobileBreak')) {
                cy.get('.footer-mobile-app-links-sm-only').find('a').first().as('apple')
            } else {
                cy.get('.footer-mobile-app-links-lg-only').find('a').first().as('apple')
            }
            cy.get('@apple').invoke('attr', 'href').then((url) => {
                const splitURL = url.split('/')
                let domain = splitURL[2]
                cy.get('@apple').invoke('removeAttr', 'target').click()
                cy.origin(domain, { args: { domain, url } }, ({ domain, url }) => {
                    cy.url().should('include', url)
                    cy.go('back')
                })
            })
        })

        it('I can click the Google Play Store download icon and be forwarded to the right url', () => {
            if (viewport.width < Cypress.env('mobileBreak')) {
                cy.get('.footer-mobile-app-links-sm-only').find('a').eq(1).as('google')
            } else {
                cy.get('.footer-mobile-app-links-lg-only').find('a').eq(1).as('google')
            }
            cy.get('@google').invoke('attr', 'href').then((url) => {
                const splitURL = url.split('/')
                let domain = splitURL[2]
                cy.get('@google').invoke('removeAttr', 'target').click()
                cy.origin(domain, { args: { domain, url } }, ({ domain, url }) => {
                    cy.url().should('include', url)
                    cy.go('back')
                })
            })
        })
	})
})