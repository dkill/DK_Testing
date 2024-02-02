export const smokeMain = (viewport) => {
	cy.visit(Cypress.env('baseURL'))
	cy.section('menu')
	cy.step('click hamburger menu')
	cy.get('[data-header-nav-drawer-btn]').click()
	cy.get('#slideover').should('be.visible')
	cy.get('a.tab-handle').eq(2).as('menuSection').attribute('data-menu-handle').then((sectionID) => {
		cy.step('click third menu section header')
		cy.get('@menuSection').click()
		cy.getByDataMenu(sectionID)
			.should('be.visible')
		cy.step('click last link')
		cy.getByDataMenu(sectionID).find('a').last().click()
	})
	cy.section('add to cart from PDP')
	cy.get('.product-title a').eq(1).as('product').text().then((product) => {
		cy.step('click second product')
		cy.get('@product').click()
		cy.get('.size-box').not('.oos').first().as('size').attribute('data-vid').then((variant) => {
			cy.step('select size')
			cy.get('@size').click()
			cy.step('add to bag')
			cy.getByData('pdp--add-to-bag-button').click()
			cy.waitUntil(() => cy.getByData('cart--drawer').attribute('class').then(attr => attr.includes('drawer1-open')))
			cy.getByData('cart--cart-item').first().as('cartItem').find('.product-title').contains(product, { matchCase: false })
				.should('exist')
			cy.get('@cartItem').find('.product-variant')
				.should('have.attr', 'data-vid', variant)
		})
	})
	cy.step('close cart')
	cy.getByData('cart--close-button').click()
	cy.section('quick add to cart')
	cy.step('go to all new')
	cy.allNew(viewport)
	cy.getByData('product-card').eq(2).as('card').find('.product-title a').text().then((product) => {
		cy.step('click quick add button')
		cy.get('@card').scrollIntoView().find('[data-test-id="product-card--quick-add-button"]').click()
		cy.step('select size')
		cy.getByData('product-card--quick-add-size-label').last().as('size').click()
		cy.get('@size').siblings('[data-test-id="product-card--quick-add-size-input"]').attribute('value').then((vid) => {
			cy.step('add to cart')
			cy.getByData('product-card--quick-add-to-cart-button').click()
			cy.waitUntil(() => cy.getByData('cart--drawer').attribute('class').then(attr => attr.includes('drawer1-open')))
			cy.getByData('cart--cart-item-product-title').contains(product, { matchCase: false })
				.should('exist')
			cy.getByData('cart--cart-item-variant')
				.should('have.attr', 'data-vid', vid)
		})
	})
	cy.step('close cart')
	cy.getByData('cart--close-button').click()
	cy.section('cart')
	cy.getByData('header--mini-cart-button').click()
	cy.getByData('cart--drawer')
		.should('have.class', 'drawer1-open')
	cy.get('span.cart-subtotal-amount').as('subtotal')
	function checkSubtotal() {
		let sum = 0
		cy.get('span.product-price').then((priceArr) => {
			priceArr.forEach((price) => {
				let num = Number(price.replace('$', ''))
				sum += num
			})
			cy.get('@subtotal').text().then((subtotal) => {
				const subtotalNum = Number(total.replace('$', ''))
				cy.wrap(subtotalNum)
					.should('eq')
			})
		})
	}
	cy.getByData('cart--cart-item').first().within(() => {
		cy.get('span.product-price').as('linePrice')
		cy.get('div.cart-quantity-adjuster').find('span').not('.toggle-quantity').as('qty')
		cy.get('.toggle-quantity[data-type="add"]').as('add')
		cy.get('.toggle-quantity[data-type="remove"]').as('remove')
		cy.get('@linePrice').text().then((price) => {
			const priceNum = Number(price.replace('$', ''))
			function checkTotal(el, qty) {
				cy.get(el).text().then((total) => {
					const totalNum = Number(total.replace('$', ''))
					cy.wrap(totalNum)
						.should('eq', priceNum * qty)
				})
			}
			function checkQty(num) {
				cy.get('@qty').then((qty) => {
					const qtyNum = Number(qty.text())
					cy.wrap(qtyNum)
						.should('eq', num)
				})
			}
			checkTotal('span.product-price', 1)
			cy.step('add qty')
			let cookie
			cy.getCookie('cart_ts').then((c) => { cookie = c })
			cy.get('@add').click()
			cy.waitUntil(() => cy.get('@add').attribute('data-current-qty').then(num => Number(num) === 2))
			checkQty(2)
			checkTotal('@linePrice', 2)
			checkTotal('@subtotal', 2)
			cy.step('remove qty')
			cy.getCookie('cart_ts').then((c) => { cookie = c })
			cy.get('@remove').click()
			cy.waitUntil(() => cy.get('@remove').attribute('data-current-qty').then(num => Number(num) === 1))
			checkQty(1)
			checkTotal('@linePrice', 1)
			checkTotal('@subtotal', 1)
			cy.getByData('cart--cart-item').first().then((product) => {
				let cookie
				cy.getCookie('cart_ts').then((c) => {cookie = c})
				cy.step('click remove button')
				cy.getByData('cart--remove-button').click()
				cy.waitUntil(() => cy.getCookie('cart_ts').then(newCookie => newCookie != cookie))
				cy.wrap(product)
					.should('not.exist')
			})
		})
	})
}