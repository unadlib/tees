module.exports = {
    selectorLabel: 'class',
    params: {
      projects: {
        'example': {
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