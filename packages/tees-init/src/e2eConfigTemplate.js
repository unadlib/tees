
module.exports = {
  params: {
    projects: {
      '${projectName}': {}
    }
  },
  lookupConfig({
    config,
    tag
  }) {
    return config.params.projects[tag.project];
  },
};