const { resolve } = require('path');
const { existsSync } = require('fs');
const defaultsConfig = require('../config');

const rootPath = resolve(__dirname, '../../');
const setupFile = 'src/lifecycle/setup.js';
const testRunner = 'jest-circus/runner';
const transform = { '^.+\\.(jsx|js)$': 'babel-jest' };
const postSetupFile = 'src/lifecycle/postSetup.js';
const globalSetup = 'tees-environment/setup';
const globalTeardown = 'tees-environment/teardown';
const testEnvironment = 'tees-environment';
const tails = ['--forceExit', '--no-cache', '--detectOpenHandles'];

function mergeConfig(config, defaultsConfig) {
  return {
    ...config,
    exec: {
      ...defaultsConfig.exec,
      ...config.exec,
    },
    defaults: {
      ...defaultsConfig.defaults,
      ...config.defaults,
    },
    params: {
      ...defaultsConfig.params,
      ...config.params,
    },
  };
}

/**
 * Executive config priority:
 * execDefaultTags < execDefaultProjectTags < userInputTags < userInputProjectTags
 */
function getExecTags(
  defaultTags,
  { tags: execDefaultTags = [], ...execDefaultConfigs },
  { tags: rawTags, ...rest },
) {
  const isTagsNil = !rawTags || rawTags.length === 0;
  const tags = isTagsNil ? execDefaultTags || defaultTags : rawTags;
  return tags.map(([project, tag = {}]) => {
    const defaultTag = (execDefaultTags.find(([_project]) => _project === project) || [])[1];
    return [
      project, {
        ...execDefaultConfigs,
        ...defaultTag,
        ...rest,
        ...tag,
      }
    ];
  });
}

/**
 * Executive config priority:
 * defaultsConfigm < settingExec < inputModes
 */
function getExecModes(defaultsConfig, settingExec, inputModes) {
  const isValidInput = inputModes && inputModes.length > 0;
  const execModes = (
    settingExec.modes && settingExec.modes.length > 0 ?
      settingExec.modes :
      defaultsConfig.modes
  );
  return isValidInput ? inputModes : execModes;
}

/**
 * Executive config priority:
 * defaultsConfig < settingExec < inputDrivers
 */
function getExecDrivers(defaultsConfig, settingExec, inputDrivers) {
  const isValidInput = inputDrivers && inputDrivers.length > 0;
  const execDrivers = (
    settingExec.drivers && settingExec.drivers.length > 0 ?
      settingExec.drivers :
      defaultsConfig.exec.drivers
  );
  return isValidInput ? inputDrivers : execDrivers;
}

function getGlobals({
  modes,
  drivers,
  params,
  config = {},
  configPath,
  retryTimes,
  reporter,
}, execGlobal) {
  if (!config.params.projects) {
    throw new Error('`projects` property in `e2e.config.js` must be set projects info.');
  }
  const defaultTags = Object.keys(config.params.projects).map(project => [project]);
  const execTags = getExecTags(defaultTags, execGlobal.exec, params);
  const execModes = getExecModes(defaultsConfig, execGlobal.exec, modes);
  const execDrivers = getExecDrivers(defaultsConfig, execGlobal.exec, drivers);
  const globals = {
    hasReporter: reporter,
    configPath,
    retryTimes,
    execTags,
    execModes,
    execDrivers,
    execGlobal,
    execDefaults: {
      browsers: {
        // TODO config for browsers
      }
    }
  };
  return globals;
}

function getTesterArgs(options) {
  const config = mergeConfig(options.config, defaultsConfig);
  const globals = getGlobals(options, config);
  const customTesterConfig = config.tester && config.tester[defaultsConfig.tester] || {};
  const testerConfig = {
    ...options.testerParams,
    setupFiles: [`${rootPath}/${setupFile}`],
    setupFilesAfterEnv: [`${rootPath}/${postSetupFile}`],
    globals,
    globalSetup,
    globalTeardown,
    testEnvironment,
    transform,
    testRunner,
    verbose: false,
    ...customTesterConfig,
  };
  if (!options.reporter) {
    delete testerConfig.reporters;
    testerConfig.verbose = true;
  }

  const args = [
    `--config=${JSON.stringify(testerConfig)}`,
    ...options.testerCLI,
    ...tails
  ];
  return args;
}

function getTester({ dir, relative = '../', relativeTester }) {
  const path = resolve(dir, relative, relativeTester);
  const isExists = existsSync(path);
  if (isExists) {
    return path;
  }
  if (`/${relativeTester}` === path) {
    const error = `Unexpected '${relativeTester}'`;
    throw new Error(error);
  }
  return getTester({
    dir,
    relative: `${relative}../`,
    relativeTester
  });
}

module.exports = {
  getTesterArgs,
  getTester,
};
