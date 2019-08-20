/* global jest,test,describe */
require('../utils/console');
const { compile } = require('../utils/template');
const {
  mergeTags,
  flattenTags,
  restoreTags,
  getTags,
  checkSkippedCase,
  getCaseTags,
  extendTagOption,
  generateLogger,
} = require('./helper');

// default timeout 2min.
const DEFAULT_TIMEOUT = 1000 * 60 * 2;
const _test = test;
const _describe = describe;
const __optionsMapping__ = new Map();
jest.setTimeout(global.testTimeout || DEFAULT_TIMEOUT);

/**
 * hook for before each case start execute.
 * @param {object} context - e2e case context.
 * @param {function} beforeHook - before hook for each case.
 */
async function beforeEachStart(context, beforeHook) {
  // reset options for each test execution.
  context.options = this.getOrigialOptions(context);
  if (beforeHook) {
    await beforeHook(context);          //？
  }
}

function getOrigialOptions(context) {
  // reset options for each test execution.
  return JSON.parse(__optionsMapping__.get(context));
}

/**
 * hook for after each case start execute(include failed cases).
 * @param {object} context - e2e case context.
 * @param {function} beforeHook - before hook for each case.
 */
async function afterEachEnd(context, afterHook) {
  const { driver, options } = context;
  if (afterHook) {
    try {
      await afterHook(context);
    } catch (e) {
      console.error(e);
    }
  }
  for (const hook of [...driver.afterHooks].reverse()) {
    try {
      await hook();
    } catch (e) {
      console.error(e);
    }
  }
  if (options.isSandbox) await driver.close();
}

/**
 * execute case with case config and exection config.
 * @param {object} params - execution params.
 */
function getExecCaseParams({
  driver,
  option,
  title,
  project,
  group,
  caseParams,
  tag,
  modes,
  caseTag,
  isSandbox,
  isHeadless,
  isDebugger,
  isVerbose,
  isOnly,
  fn,
}) {
  const isUT = /UT|ut$/.test(driver);
  const isVirtual = ['enzyme'].indexOf(driver) > -1;
  const templateMappding = { ...option, isVirtual };
  const name = compile({
    template: title,
    keys: Object.keys(templateMappding),
    values: Object.values(templateMappding),
  });
  const groupInfos = group.length > 0 ? `in ${group.join(' & ')} ` : '';
  const tail = ` => (${project} ${groupInfos}on ${driver})`;
  const caseTitle = `${name}${tail}`;
  const {
    config,
    instance,
    beforeEachCase,
    afterEachCase,
  } = global.testPrepare({
    caseParams,
    option,
    tag,
    drivers: global.drivers,
    driver,
    modes,
    isSandbox,
  });
  const _option = extendTagOption({
    option,
    caseTag,
    tag
  });
  const context = {
    logger: generateLogger(caseTitle, global.hasReporter),
    driver: instance.driver,
    get browser() {
      return context.driver.browser;
    },
    get page() {
      return instance.driver.page;
    },
    options: {
      option: _option,
      config,
      tag,
      driver,
      modes,
      isSandbox,
      isHeadless,
      isDebugger,
      isVerbose,
      isVirtual,
      isUT,
    },
  };
  // cache serialization options for retry.
  __optionsMapping__.set(context, JSON.stringify(context.options));

  return {
    caseTitle,
    instance,
    context,
    beforeEachCase,
    afterEachCase,
  }

}

/**
 *  global 'test' variable
 * @param {object} caseParams - case params
 * @param {function} fn - raw function from test file.
 * @param {boolean} isOnly - is or not only execution for the current test case.
 */
function execCase({
  driver,
  option,
  title,
  project,
  group,
  caseParams,
  tag,
  modes,
  caseTag,
  isSandbox,
  isHeadless,
  isDebugger,
  isVerbose,
  isOnly,
  fn,
}) {
  /* eslint-disable */

  const {
    caseTitle,
    instance,
    context,
    beforeEachCase,
    afterEachCase,
  } = getExecCaseParams({
    driver,
    option,
    title,
    project,
    group,
    caseParams,
    tag,
    modes,
    caseTag,
    isSandbox,
    isHeadless,
    isDebugger,
    isVerbose,
    isOnly,
    fn,
  })


  const func = async function ({
    instance,
    context,
    beforeEachCase,
    afterEachCase,
  }) {
    global.$ = instance.query;
    global.__context__ = context;
    global.__beforeEachCase__ = beforeEachCase;
    global.__afterEachCase__ = afterEachCase;

    await beforeEachStart(context, beforeEachCase);
    if (!context.options.isUT) {
      if (context.options.isSandbox) {
        const isAuth = context.options.option.isAuth;
        await context.driver.run({ ...context.options.config, isAuth, isHeadless });
        await context.driver.newPage();
      }
      await context.driver.goto(context.options.config);
    }
    await fn(context);
  };
  /* eslint-enable */
  if (isOnly) {
    _test.only(caseTitle, func);
  } else {
    console.log(`Execute: ${caseTitle}`);
    _test(caseTitle, func);
  }
}

/**
 * hijack global 'test' variable
 * @param {object} caseParams - case params
 * @param {function} fn - raw function from test file.
 * @param {boolean} isOnly - is or not only execution for the current test case.
 */
function testCase(caseParams, fn, isOnly = false) {
  const {
    title,
    options = [{}],
    tags: rawTags = [],
    modes = [],
  } = caseParams;
  const {
    projects,
    ...params
  } = global.execGlobal.params;
  const defaultTestConfig = global.defaultTestConfig;
  const caseTags = getCaseTags({ caseParams, params });
  const tags = getTags({ rawTags, defaultTestConfig, caseTags });
  const testCaseTags = mergeTags(tags, defaultTestConfig);
  const execTags = mergeTags(global.execTags, testCaseTags).map(([_project, _tags]) => (
    [_project, { ..._tags, drivers: [...global.execDrivers] }]
  ));

  const _modes = [...modes, ...global.execModes];
  const isHeadless = _modes.indexOf('headless') > -1;
  const isSandbox = _modes.indexOf('sandbox') > -1;
  const isDebugger = _modes.indexOf('debugger') > -1;
  const isVerbose = _modes.indexOf('verbose') > -1;
  for (const driver of global.execDrivers) {
    for (const [project, { drivers, ...tags }] of execTags) {
      const groups = Object.keys(tags).length === 0 ? [[]] : flattenTags(tags);
      for (const group of groups) {
        for (const option of options) {
          const tag = restoreTags(group, project);
          const caseTag = testCaseTags.find(([_project]) => _project === project);
          const isSkipped = checkSkippedCase({ ...tag, drivers: driver }, caseTag);
          if (isSkipped) {
            break;
          }
          global.execCase({
            driver,
            option,
            title,
            project,
            group,
            caseParams,
            tag,
            modes,
            caseTag,
            isSandbox,
            isHeadless,
            isDebugger,
            isVerbose,
            isOnly,
            fn,
          });
        }
      }
    }
  }
}

function testSkip(...args) {
  const firstArg = args.shift();
  let descriptor;
  if (typeof firstArg === 'object') {
    descriptor = firstArg.title;
  } else {
    descriptor = firstArg;
  }
  return _test.skip(descriptor, args);
}

function testOnly(...args) {
  return global.testCase(...args, true);
}

function testDescribe(...args) {
  return _describe(...args);
}

global.afterEach(async () => {
  await afterEachEnd(global.__context__, global.__afterEachCase__);
});
global.test = testCase;
global.describe = testDescribe;
global.describe.skip = _describe.skip;
global.test.skip = testSkip;
global.test.only = testOnly;

module.exports = {
  beforeEachStart,
  afterEachEnd,
  getExecCaseParams,
  execCase,
  testCase,
  testSkip,
  testOnly,
  testDescribe
};