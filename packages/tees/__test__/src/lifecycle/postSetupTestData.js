//global params
global.afterEach = jest.fn()

const accounts = {
    googleAccount: 'username',
    googlePwd: 'password',
};

const drivers = ['enzyme', 'puppeteer', 'firefox', 'safari', 'chrome', 'webextGeckodriver'];

const params = {
    projects: {
        google: {
            type: 'extension',
            source: 'source',
            driver: {
                setting: {
                    defaultViewport: {
                        height: 650,
                        width: 1100,
                    },
                    args: [
                        'args',
                    ]
                }
            },
            params: {
                brands: {
                    rc: {
                        ...accounts,
                        extension: 'extension',
                        location: 'location',
                    },
                }
            }
        },
    },
    drivers,
    levels: ['p0', 'p1', 'p2', 'p3'],
    brands: ['rc', 'bt', 'telus', 'att'],
    tags: [['google'], ['office'], ['salesforce']],
    options: ['accounts'],
}

const defaults = {
    drivers,
    levels: ['p3'],
    brands: ['rc'],
    accounts: ['account'],
    tags: [['google'], ['office'], ['salesforce']],
    options: ['accounts'],
}

global.execGlobal = {
    defaults,
    params,
    selectorLabel: 'selectorLabel',
}

global.execTags = [['google',
    {
        drivers,
        levels: ['p3'],
        brands: ['rc'],
        tags: ['salesforce'],
        options: ['accounts'],
        accounts: ['account'],
    }]]
global.execDrivers = defaults.drivers;
global.drivers = defaults.drivers;
global.execModes = []
global.afterEach = jest.fn();
global.beforeEachCase = jest.fn();
global.afterEachCase = jest.fn();
global.test = jest.fn((caseTitle, func) => func({
    instance: {
        query
    },
    context: contextParamExpected,
    beforeEachCase: global.beforeEachCase,
    afterEachCase: global.afterEachCase
}))

global.test.only = jest.fn((caseTitle, func) => func({
    instance: {
        query
    },
    context: contextParamExpected,
    beforeEachCase: global.beforeEachCase,
    afterEachCase: global.afterEachCase
}))

const caseParams = {
    title: 'test postSetup',
    tags: [['google'], ['office'], ['salesforce']],
    options: ['accounts'],
}

const caseParamsSkipped = {
    title: 'test postSetup',
    tags: [['google'], ['office'], ['salesforce']],
    options: [{
        accounts: ['account'],
        loginType: 'loginType',
        callingType: 'Other Phone',
    }],
}

const query = node => new Query(node, {
    label: inputSetting.selectorLabel
})

const helper = require('../../../src/lifecycle/helper');

const caseTitle = "execute case => (google in levels-p3 & brands-rc & tags-salesforce & options-accounts & accounts-account on puppeteer)"

const mockProcessArgv = () => process.argv = ['/usr/local/bin/node',
    '/Users/lena.chen/RingCentral/tee-ut/tees/packages/tees/node_modules/jest/bin/jest.js',
    '--config={"verbose":true,"testMatch":["<rootDir>/packages/tees/templates/exampleSpec.js"],"testPathIgnorePatterns":[],"setupFiles":["/Users/lena.chen/RingCentral/tee-ut/tees/packages/tees/src/lifecycle/setup.js"],"setupFilesAfterEnv":["/Users/lena.chen/RingCentral/tee-ut/tees/packages/tees/src/lifecycle/postSetup.js"],"globals":{"hasReporter":false,"configPath":"/Users/lena.chen/RingCentral/tee-ut/tees/e2e.config.js","retryTimes":0,"execTags":[],"execModes":[],"execDrivers":["puppeteer"],"execGlobal":{"selectorLabel":"class","params":{"drivers":["puppeteer"],"projects":{"${projectName}":{"type":"uri","location":"https://cn.bing.com/"}}},"exec":{"drivers":["puppeteer"]},"defaults":{"drivers":["puppeteer"]}},"execDefaults":{"browsers":{}}},"globalSetup":"tees-environment/setup","globalTeardown":"tees-environment/teardown","testEnvironment":"tees-environment","transform":{"^.+\\\\.(jsx|js)$":"babel-jest"},"testRunner":"jest-circus/runner"}',
    '--forceExit',
    '--no-cache',
    '--detectOpenHandles'];

mockProcessArgv();

const instance = helper.getDriverInstance({ drivers: global.drivers, driver: "puppeteer", isSandbox: true });

let driversObj = {};
global.drivers.forEach(element => {
    driversObj[element] = instance;
});

global.drivers = driversObj;

const contextParamExpected = {
    logger: helper.generateLogger(caseTitle, global.hasReporter),
    get browser() {
        return instance.driver.browser;
    },
    get page() {
        return instance.driver.page;
    },
    driver: instance.driver,
    options: {
        option: {
            accounts: [
                "account"
            ],
            loginType: "loginType"
        },
        config: {
            type: "extension",
            source: "source",
            driver: {
                setting: {
                    defaultViewport: {
                        height: 650,
                        width: 1100
                    },
                    args: [
                        "args"
                    ]
                }
            },
            params: {
                brands: {
                    rc: {
                        googleAccount: "username",
                        googlePwd: "password",
                        extension: "extension",
                        location: "location"
                    }
                }
            }
        },
        tag: {
            project: "google"
        },
        driver: "puppeteer",
        modes: [],
        isSandbox: true,
        isHeadless: false,
        isDebugger: false,
        isVerbose: false,
        isVirtual: false,
        isUT: false
    }
}

const argFn = jest.fn();
let context = {
    driver: "puppeteer",
    option: {
        accounts: ['account'],
        loginType: 'loginType',
    },
    title: 'execute case',
    project: "google",
    group: ['levels-p3',
        'brands-rc',
        'tags-salesforce',
        'options-accounts',
        'accounts-account'
    ],
    caseParams,
    tag: { project: 'google' },
    modes: [],
    caseTag: ['google',
        {
            drivers,
            levels: ['p3'],
            brands: ['rc'],
            tags: [['google'], ['office'], ['salesforce']],
            options: ['accounts'],
            accounts: ['account']
        }
    ],
    isSandbox: true,
    isHeadless: false,
    isDebugger: false,
    isVerbose: false,
    isOnly: false,
    fn: argFn
}

const execCaseParamExpected = {
    driver: "enzyme",
    option: "accounts",
    title: 'test postSetup',
    project: "google",
    group: ['levels-p3',
        'brands-rc',
        'tags-salesforce',
        'options-accounts',
        'accounts-account'
    ],
    caseParams,
    tag: {
        "accounts": "account",
        "brands": "rc",
        "levels": "p3",
        "options": "accounts",
        "project": "google",
        "tags": "salesforce",
    },
    modes: [],
    caseTag: ['google',
        {
            drivers,
            levels: ['p3'],
            brands: ['rc'],
            tags: [['google'], ['office'], ['salesforce']],
            options: ['accounts'],
            accounts: ['account']
        }
    ],
    isSandbox: false,
    isHeadless: false,
    isDebugger: false,
    isVerbose: false,
    isOnly: false,
    fn: argFn
}

module.exports = {
    caseParams,
    caseParamsSkipped,
    instance,
    query,
    caseTitle,
    contextParamExpected,
    context,
    argFn,
    execCaseParamExpected
};


