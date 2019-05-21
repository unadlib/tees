module.exports = {
  selectorLabel: 'class',
  params: {
    projects: {
      'Example': {
        type: 'uri',
        location: 'https://cn.bing.com/',
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
