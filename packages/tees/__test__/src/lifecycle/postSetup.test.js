//global params
global.afterEach = jest.fn()

const accounts = {
    googleAccount: 'username',
    googlePwd: 'password',
};

const params = {
    projects: {
        google: {
            type: 'extension',
            source: './src/targets/google',
            driver: {
                setting: {
                    defaultViewport: {
                        height: 650,
                        width: 1100,
                    },
                    args: [
                        '--disable-dev-shm-usage',
                    ]
                }
            },
            params: {
                brands: {
                    rc: {
                        ...accounts,
                        extension: '../../extension/google-rc',
                        location: 'chrome-extension://pgjpmeckehbghpkamdammcgmmmbojbdi/client.html',
                    },
                }
            }
        },
    },
    drivers: ['enzyme', 'puppeteer', 'firefox', 'safari', 'chrome', 'webextGeckodriver'],
    levels: ['p0', 'p1', 'p2', 'p3'],
    brands: ['rc', 'bt', 'telus', 'att'],
    tags: [['google'], ['office'], ['salesforce']],
    options: ['accounts'],
    // modes: []
}

const defaults = {
    drivers: ['enzyme', 'puppeteer', 'firefox', 'safari', 'chrome', 'webextGeckodriver'],
    levels: ['p3'],
    brands: ['rc'],
    accounts: ['CM_RC_US'],
    tags: [['google'], ['office'], ['salesforce']],
}

global.execGlobal = {
    defaults,
    params,
    selectorLabel: 'selectorLabel',
}

global.execTags = [['google',
    {
        drivers: ['enzyme', 'puppeteer', 'firefox', 'safari', 'chrome', 'webextGeckodriver'],
        levels: ['p3'],
        brands: ['rc'],
        // title: 'test postSetup',
        tags: ['salesforce'],
        options: ['accounts'],
        // modes: [],
        accounts: ['CM_RC_US'],
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

const caseParams = {
    title: 'test postSetup',
    tags: [['google'], ['office'], ['salesforce']],
    options: ['accounts'],
}

const query = node => new Query(node, {
    label: inputSetting.selectorLabel
})

const helper = require('../../../src/lifecycle/helper');

const caseTitle = "execute case => (google in levels-p3 & brands-rc & tags-salesforce & options-accounts & accounts-CM_RC_US on puppeteer)"

const instance = helper.getDriverInstance({ drivers: global.drivers, driver: "puppeteer", isSandbox: true });

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
                "CM_RC_US"
            ],
            loginType: "did"
        },
        config: {
            type: "extension",
            source: "./src/targets/google",
            driver: {
                setting: {
                    defaultViewport: {
                        height: 650,
                        width: 1100
                    },
                    args: [
                        "--disable-dev-shm-usage"
                    ]
                }
            },
            params: {
                brands: {
                    rc: {
                        googleAccount: "username",
                        googlePwd: "password",
                        extension: "../../extension/google-rc",
                        location: "chrome-extension://pgjpmeckehbghpkamdammcgmmmbojbdi/client.html"
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
const context = {
    driver: "puppeteer",
    option: {
        accounts: ['CM_RC_US'],
        loginType: 'did',
    },
    title: 'execute case',
    project: "google",
    group: ['levels-p3',
        'brands-rc',
        'tags-salesforce',
        'options-accounts',
        'accounts-CM_RC_US'
    ],
    caseParams,
    tag: { project: 'google' },
    modes: [],
    caseTag: ['google',
        {
            drivers:
                ['enzyme',
                    'puppeteer',
                    'firefox',
                    'safari',
                    'chrome',
                    'webextGeckodriver'],
            levels: ['p3'],
            brands: ['rc'],
            tags: [['google'], ['office'], ['salesforce']],
            options: ['accounts'],
            accounts: ['CM_RC_US']
        }
    ],
    isSandbox: true,
    isHeadless: false,
    isDebugger: false,
    isVerbose: false,
    isOnly: false,
    argFn
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
        'accounts-CM_RC_US'
    ],
    caseParams,
    tag: {
        "accounts": "CM_RC_US",
        "brands": "rc",
        "levels": "p3",
        "options": "accounts",
        "project": "google",
        "tags": "salesforce",
    },
    modes: [],
    caseTag: ['google',
        {
            drivers:
                ['enzyme',
                    'puppeteer',
                    'firefox',
                    'safari',
                    'chrome',
                    'webextGeckodriver'],
            levels: ['p3'],
            brands: ['rc'],
            tags: [['google'], ['office'], ['salesforce']],
            options: ['accounts'],
            accounts: ['CM_RC_US']
        }
    ],
    isSandbox: false,
    isHeadless: false,
    isDebugger: false,
    isVerbose: false,
    isOnly: false,
    fn: argFn
}

const { setup, testPrepare } = require('../../../src/lifecycle/setup.js');
const {
    beforeEachStart,
    afterEachEnd,
    getExecCaseParams,
    execCase,
    testCase,
    testOnly,
} = require('../../../src/lifecycle/postSetup');


describe('lifecycle/postSetup', () => {

    it('beforeEachStart', async () => {
        const mockFn = jest.fn();
        const opts = JSON.stringify(context.options);
        getOrigialOptions = jest.fn().mockImplementation(() => opts);
        await beforeEachStart(context, mockFn);

        expect(mockFn).toBeCalled();
        expect(mockFn.mock.calls[0][0]).toBe(context);


    });

    it('afterEachEnd', async () => {
        const hook1 = jest.fn();
        const hook2 = jest.fn();
        const afterEachParam = {
            driver: {
                afterHooks: [
                    hook1,
                    hook2
                ]
            },
            options: ['accounts'],
        }
        const afterEachFn = jest.fn();

        await afterEachEnd(afterEachParam, afterEachFn);

        expect(afterEachFn).toBeCalled();
        expect(hook1).toBeCalled();
        expect(hook2).toBeCalled();
    });

    it('getExecCaseParams', async () => {

        const result = await getExecCaseParams(context);

        expect(result.caseTitle).toEqual(caseTitle);
        expect(JSON.stringify(result.instance.query)).toEqual(JSON.stringify(query));
        expect(JSON.stringify(result.context)).toEqual(JSON.stringify(contextParamExpected));
    });

    it('execCase', async () => {

        await execCase(context);

        expect(global.$).toEqual(query);
        expect(global.__context__).toEqual(contextParamExpected);
        expect(global.__beforeEachCase__).toEqual(global.beforeEachCase);
        expect(global.__afterEachCase__).toEqual(global.afterEachCase);
    });

    it('testCase,', async () => {

        global.execCase = jest.fn();

        await testCase(caseParams, argFn);

        expect(global.execCase).toBeCalled();
        expect(global.execCase.mock.calls[0][0]).toEqual(execCaseParamExpected);

    });

    it('testOnly', async () => {

        const fn = jest.fn();
        global.testCase = jest.fn();

        const result = await testOnly(caseParams, fn);

        expect(global.testCase).toBeCalled();
        expect(global.testCase.mock.calls[0][0]).toBe(caseParams);
        expect(global.testCase.mock.calls[0][1]).toBe(fn);
        expect(global.testCase.mock.calls[0][2]).toBe(true);
        expect(result).toBe(global.testCase(caseParams, fn, true));

    });

});

