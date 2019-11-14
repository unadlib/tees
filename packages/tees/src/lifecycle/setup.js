const { configPath } = require('../run');
const log = require('../plugins/log');
const { setup } = require('./helper');

// require user's test project config.
// eslint-disable-next-line
const { plugins = [] } = require(configPath); 
const config = global.execGlobal;

setup({
  config,
  plugins: [
    // TODO support lifecycle for plugins.
    log,
    ...plugins,
  ]
});

module.exports = {
  configPath
};
