const { checkValidity } = require('./utils/check');
const { getWorkAbsolutePath, getFile } = require('./utils/path');
const { getParams } = require('./lib/parseParams');
const { getModes } = require('./lib/modes');
const { getTesterCLI } = require('./lib/testerCLI');
const { getRetryTimes } = require('./lib/retryTimes');
const { getTestMatch, defaultTestMatch } = require('./lib/filesMatch');
const execute = require('./execute.js');

const DEFAULT_CONFIG_FILE_PATH = './e2e.config.js';
const configPath = getWorkAbsolutePath(DEFAULT_CONFIG_FILE_PATH);

/**
 * start execution test from CLI.
 * @param {string} dir - exec dir.
 * @param {object} cmd - Command line arguments.
 */
function run(dir, cmd) {
  const path = checkValidity(dir);
  const verbose = cmd.verbose || false;
  const testMatch = getTestMatch(path) || defaultTestMatch;
  const testPathIgnorePatterns = cmd.exclude || [];
  const testerParams = {
    verbose,
    testMatch,
    testPathIgnorePatterns,
  };
  const reporter = cmd.reporter || false;
  const testerCLI = getTesterCLI(cmd) || [];
  const params = getParams(cmd) || {};
  const config = getFile(configPath) || {};
  const modes = getModes(cmd) || [];
  const retryTimes = getRetryTimes(cmd);
  const drivers = cmd.drivers || [];
  const execParams = {
    testerParams,
    testerCLI,
    modes,
    params,
    config,
    retryTimes,
    drivers,
    configPath,
    reporter,
  };
  const handlers = {
    onExit() {
      process.exit();
    }
  };
  execute(execParams, handlers);
}

module.exports = {
  run,
  configPath,
  defaultConfigPath: DEFAULT_CONFIG_FILE_PATH,
};
