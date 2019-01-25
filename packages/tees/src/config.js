/**
 * E2E tester just support tester 'jest' or 'mocha'.
 * Default tester  is jest.
 * Default driver is puppeteer.
 */
module.exports = {
  tester: 'jest',
  modes: [],
  exec: {
    drivers: ['puppeteer'],
  },
  params: {
    drivers: ['puppeteer'],
  },
  defaults: {
    drivers: ['puppeteer'],
  }
};
