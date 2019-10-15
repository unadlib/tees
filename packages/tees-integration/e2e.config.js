const { Query } = require('./integration-test/lib/puppeteerQuery');

module.exports = {
  selectorLabel: 'class',
  params: {
    projects: {
      examples: {
        type: 'uri',
        location: 'http://localhost:3000/',
      }
    }
  },
  drivers: {
    puppeteer: {
      Query,
    }
  },
  lookupConfig({
    config,
    tag
  }) {
    return config.params.projects[tag.project];
  },
};
