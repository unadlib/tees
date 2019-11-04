const {
    caseParams,
    caseParamsSkipped,
    query,
    instance,
    caseTitle,
    contextParamExpected,
    context,
    argFn,
    execCaseParamExpected
} = require('./postSetupTestData.js');
const { setup, testPrepare } = require('../../../src/lifecycle/setup.js');
const {
    beforeEachStart,
    afterEachEnd,
    getExecCaseParams,
    execCase,
    testCase,
    testOnly,
} = require('../../../src/lifecycle/postSetup');


describe('postSetup unit test : beforeEachStart', () => {

    it('beforeEachStart, before hook for each case should be called', async () => {
        const mockFn = jest.fn();

        const result = await getExecCaseParams(context);
        await beforeEachStart(result.context, mockFn);

        expect(mockFn).toBeCalled();
        expect(JSON.stringify(mockFn.mock.calls[0][0])).toBe(JSON.stringify(contextParamExpected));

    });
}),

    describe('postSetup unit test : afterEachEnd', () => {
        const hook1 = jest.fn();
        const hook2 = jest.fn();
        const close = jest.fn();
        const afterEachParam = {
            driver: {
                afterHooks: [
                    hook1,
                    hook2
                ],
                close
            },
            options: {
                isSandbox: true
            },
        }
        const afterEachFn = jest.fn();

        it('afterEachEnd, after hook for each case should be called and afterEachParam.driver.afterHooks should be called', async () => {

            await afterEachEnd(afterEachParam, afterEachFn);

            expect(afterEachFn).toBeCalled();
            expect(hook1).toBeCalled();
            expect(hook2).toBeCalled();
        });

        it('afterEachEnd, after hook for each case should be called and afterEachParam.driver.afterHooks should be called', async () => {
            afterEachParam.options.isSandbox = true;

            await afterEachEnd(afterEachParam, afterEachFn);
            expect(close).toBeCalled();
        });

        it('afterEachEnd, when afterHooks arg is null', async () => {
            afterEachParam.driver.afterHooks = null;

            await afterEachEnd(afterEachParam, afterEachFn).catch(e => expect(String(e)).toMatch('TypeError: driver.afterHooks is not iterable'));

        });

    }),

    describe('postSetup unit test : getExecCaseParams', () => {

        it(`getExecCaseParams, should return result`, async () => {

            const result = await getExecCaseParams(context);

            expect(result.caseTitle).toEqual(caseTitle);
            expect(JSON.stringify(result.instance.query)).toEqual(JSON.stringify(query));
            expect(JSON.stringify(result.context)).toEqual(JSON.stringify(contextParamExpected));
        });

        it(`getExecCaseParams, when case tags don't include loginAccount`, async () => {
            context.option = { loginAccount: 'loginAccount' };
            const caseTitleNoLoginAccount = `execute case => (google in levels-p3 & brands-rc & tags-salesforce & options-accounts & loginAccount-loginAccount on puppeteer)`;
            contextParamExpected.options.option = context.option;

            const result = await getExecCaseParams(context);

            expect(result.caseTitle).toEqual(caseTitleNoLoginAccount);
            expect(result.context.options.option).toEqual(context.option);
        });

        it(`getExecCaseParams, when case tags don't include account`, async () => {
            context.option = { accounts: ['account'] };
            const caseTitleNoAccounts = `execute case => (google in levels-p3 & brands-rc & tags-salesforce & options-accounts & accounts-account on puppeteer)`;

            const result = await getExecCaseParams(context);

            expect(result.caseTitle).toEqual(caseTitleNoAccounts);
            expect(result.context.options.option).toEqual(context.option);
        });
    }),

    describe('postSetup unit test : execCase', () => {

        it('execCase, verify the params of global and global.beforeEachStart should be called', async () => {

            let result = await getExecCaseParams(context);

            global.getExecCaseParams = jest.fn().mockReturnValue(result);

            global.beforeEachStart = jest.fn();

            result.context.driver.run = jest.fn();
            result.context.driver.newPage = jest.fn();
            result.context.driver.goto = jest.fn();

            await execCase(context);

            expect(JSON.stringify(global.$)).toEqual(JSON.stringify(result.instance.query));
            expect(global.__context__).toEqual(result.context);
            expect(global.__beforeEachCase__).toEqual(result.beforeEachCase);
            expect(global.__afterEachCase__).toEqual(result.afterEachCase);

            expect(global.beforeEachStart).toBeCalled();
            expect(global.beforeEachStart).toHaveBeenCalledWith(result.context, result.beforeEachCase);

            expect(result.context.driver.run).toBeCalled();

        });

        it('execCase, if test only should assign the params of global', async () => {

            context.isOnly = true;

            result = await getExecCaseParams(context);
            global.getExecCaseParams = jest.fn().mockReturnValue(result);

            global.beforeEachStart = jest.fn();

            result.context.driver.run = jest.fn();
            result.context.driver.newPage = jest.fn();
            result.context.driver.goto = jest.fn();

            await execCase(context);

            expect(result.context.driver.run).toBeCalled();
        });

        it('execCase, if isUT is true context.driver.run should not be called', async () => {

            context.driver = "ut";

            result = await getExecCaseParams(context);

            global.getExecCaseParams = jest.fn().mockReturnValue(result);

            global.beforeEachStart = jest.fn();

            result.context.driver.run = jest.fn();
            result.context.driver.newPage = jest.fn();
            result.context.driver.goto = jest.fn();

            await execCase(context);

            expect(result.context.driver.run).not.toBeCalled();

            context.driver = "puppeteer";

        });

        it('execCase, verify the params of global and global.beforeEachStart should be called', async () => {

            context.isHeadless = true;
            context.isDebugger = true;
            context.isVerbose = true;

            result = await getExecCaseParams(context);

            global.getExecCaseParams = jest.fn().mockReturnValue(result);

            global.beforeEachStart = jest.fn();

            result.context.driver.run = jest.fn();
            result.context.driver.newPage = jest.fn();
            result.context.driver.goto = jest.fn();

            await execCase(context);

            expect(result.context.driver.run).toBeCalled();

        });


        it('execCase, if isSandbox is false context.driver.run should not be called', async () => {

            context.isSandbox = false;

            const result = await getExecCaseParams(context);

            global.getExecCaseParams = jest.fn().mockReturnValue(result);

            global.beforeEachStart = jest.fn();

            result.context.driver.run = jest.fn();
            result.context.driver.newPage = jest.fn();
            result.context.driver.goto = jest.fn();

            await execCase(context);

            expect(result.context.driver.run).not.toBeCalled();

        });

    }),

    describe('postSetup unit test : testCase', () => {

        it(`testCase, global.execCase should be called and the param is equal to ${execCaseParamExpected}`, async () => {

            global.execCase = jest.fn();
            await testCase(caseParams, argFn);

            expect(global.execCase).toBeCalled();
            expect(global.execCase).toHaveBeenCalledWith(execCaseParamExpected);
            expect(global.execCase.mock.instances.length).toBe(6);
        });

        it(`testCase, the param isOnly is true and global.execCase should be called `, async () => {

            global.execCase = jest.fn();
            await testCase(caseParams, argFn, true);

            expect(global.execCase).toBeCalled();
            expect(global.execCase.mock.calls[0][0].isOnly).toEqual(true);

        });

        it(`testCase, when modes is not null and  global.execCase should be called`, async () => {

            global.execCase = jest.fn();
            caseParams.modes = ['headless'];

            await testCase(caseParams, argFn);

            expect(global.execCase).toBeCalled();
            expect(global.execCase.mock.calls[0][0].modes).toEqual([...caseParams.modes, ...global.execModes]);

        });

        it(`testCase, when tags is [] and  global.execCase should be called`, async () => {

            global.execCase = jest.fn();
            caseParams.tags = [];

            await testCase(caseParams, argFn);

            expect(global.execCase).not.toBeCalled();
        });

        it(`testCase, when options is [{}] and  global.execCase should be called`, async () => {

            global.execCase = jest.fn();
            caseParams.options = [{}];

            await testCase(caseParams, argFn);

            expect(global.execCase).not.toBeCalled();
        });

        it(`testCase, isSkiped is true and  global.execCase should not be called`, async () => {

            global.execCase = jest.fn();
            await testCase(caseParamsSkipped, argFn);

            expect(global.execCase).not.toBeCalled();

        });

    }),

    describe('postSetup unit test : testOnly', () => {

        it(`testOnly, return global.testCase `, async () => {

            const fn = jest.fn();
            global.test = jest.fn();

            const result = await testOnly(caseParams, fn);

            expect(global.test).toBeCalled();
            expect(global.test.mock.calls[0][0]).toBe(caseParams);
            expect(global.test.mock.calls[0][1]).toBe(fn);
            expect(global.test.mock.calls[0][2]).toBe(true);
            expect(result).toBe(global.test(caseParams, fn, true));

        });


    });

