module.exports = {
  params: {
    projects: {
      '${projectName}': {
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
