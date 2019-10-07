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
  lookupConfig({
    config,
    tag
  }) {
    return config.params.projects[tag.project];
  },
};
