const { resolve } = require('path');
const e2eDrivers = require('tees-drivers');

const argsHead = /^--config=/;

function getConfig(process) {
  let config;
  const argv = process.argv.find(arg => argsHead.test(arg)).replace(argsHead, '');
  try {
    config = JSON.parse(argv);
  } catch (e) {
    console.error(e);
    process.exit();
  }
  return config;
}

function checkValidBrowsers(process) {
  const config = getConfig(process);
  const isValidBrowsers = (
    config &&
    config.globals &&
    Array.isArray(config.globals.execDrivers) &&
    config.globals.execDrivers.length > 0
  );
  if (!isValidBrowsers) {
    console.error('Invalid browsers');
    process.exit();
  }
}

const createDriver = (name, inputSetting = {}) => {
  const {
    Driver,
    setting,
    Query
  } = e2eDrivers[name];
  // TDDO inputSetting for browser
  const options = {
    driver: {
      setting,
    },
  };
  const driver = new Driver(options);
  const query = node => new Query(node, { label: inputSetting.selectorLabel });
  return {
    driver,
    query,
  };
};

const setup = async () => {
  const { globals } = getConfig(process);
  checkValidBrowsers(process);
  if (!globals.execGlobal.globalSetup) return;
  try {
    const setupPath = resolve(process.cwd(), globals.execGlobal.globalSetup);
    // eslint-disable-next-line
    const globalSetup = require(setupPath);
    if (typeof globalSetup === 'function') globalSetup();
  } catch (e) {
    console.warn('unexpected `globalSetup` hooks.');
    console.warn(e);
  }
};

const teardown = async () => {
  // TODO fix globalTeardown.
  const { globals } = getConfig(process);
  if (!globals.execGlobal.globalTeardown) return;
  try {
    const teardownPath = resolve(process.cwd(), globals.execGlobal.globalTeardown);
    // eslint-disable-next-line
    const globalTeardown = require(teardownPath);
    if (typeof globalTeardown === 'function') globalTeardown();
  } catch (e) {
    // console.warn('unexpected `globalSetup` hooks.');
    // console.warn(e);
  }
  // TODO Handle accident exit and close drivers
};

module.exports = {
  setup,
  teardown,
  createDriver,
};
