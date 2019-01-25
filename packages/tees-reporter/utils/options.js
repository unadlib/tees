const constants = require('../constants/index');

function getEnvOptions() {
  const options = {};

  for (const name in constants.ENVIRONMENT_CONFIG_MAP) {
    if (process.env[name]) {
      options[constants.ENVIRONMENT_CONFIG_MAP[name]] = process.env[name];
    }
  }

  return options;
}

const options = (reporterOptions = {}, appDirectory) =>
  Object.assign(
    {},
    { appDirectory },
    constants.DEFAULT_OPTIONS,
    reporterOptions,
    getEnvOptions()
  );

module.exports = options;
