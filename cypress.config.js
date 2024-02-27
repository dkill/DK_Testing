const { defineConfig } = require("cypress");

module.exports = defineConfig({
  viewportWidth: 2560,
  viewportHeight: 1440,
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    baseURL: 'https://www.dollskill.com',
    mobileBreak: 767,
    navBreak: 1025,
    viewports: [
      { device: 'iPhone', width: 390, height: 844 },
      { device: 'iPad', width: 834, height: 1194 },
      { device: 'Desktop', width: 1920, height: 1080 },
      { device: 'Laptop', width: 2560, height: 1440 }
    ],
    collCard: 'search--undefined-product-card',
    wishlistURL: 'https://www.dollskill.com/pages/wishlists',
    allNewURL: 'https://www.dollskill.com/collections/whats-new'
  }
});