const { flattenTestConfig, getDriverInstance } = require('./helper');
const { configPath } = require('../run');
const log = require('../plugins/log');
const { load } = require('../plugins');

const retryTimesKey = Symbol.for('RETRY_TIMES');
// require user's test preject cofnig.
// eslint-disable-next-line
const { lookupConfig, beforeEachCase, afterEachCase, timeout, plugins = [] } = require(configPath); 
const config = global.execGlobal;

/**
 * perpare test config and init test driver before test execute.
 * @param {object} param - params for test prepare.
 * @param {object} param.tag - test tag.
 * @param {object} param.drivers - support drivers object list.
 * @param {string} param.driver - test driver name.
 * @param {object} param.isSandbox - current test execution mode is or not 'sandbox'.
 */
function testPrepare({
  tag,
  drivers,
  driver,
  isSandbox,
}) {
  const instance = getDriverInstance({
    drivers,
    driver,
    isSandbox,
  });
  const config = lookupConfig({
    config: global.execGlobal,
    tag,
  });
  return {
    instance,
    config,
    beforeEachCase,
    afterEachCase,
  };
}

/**
 * load global params and plugins for preheating test.
 * @param {object} param
 * @param {object} param.config - set up config.
 * @param {array} param.plugins - load perset plugins
 */
function setup({
  config,
  plugins,
}) {
  global[retryTimesKey] = global.retryTimes;
  global.defaultTestConfig = flattenTestConfig(config);
  global.testPrepare = testPrepare;
  global.testTimeout = timeout;
  load(plugins);
}

setup({
  config,
  plugins: [
    // TODO support lifecycle for plugins.
    log,
    ...plugins,
  ]
});
