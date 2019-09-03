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


describe('postSetup unit test :', () => {

    it('beforeEachStart, before hook for each case should be called', async () => {
        const mockFn = jest.fn();

        const result = await getExecCaseParams(context);
        await beforeEachStart(result.context, mockFn);

        expect(mockFn).toBeCalled();
        expect(JSON.stringify(mockFn.mock.calls[0][0])).toBe(JSON.stringify(contextParamExpected));

    });


    it('afterEachEnd, after hook for each case should be called and afterEachParam.driver.afterHooks should be called', async () => {
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

    it(`getExecCaseParams, should return result`, async () => {

        const result = await getExecCaseParams(context);

        expect(result.caseTitle).toEqual(caseTitle);
        expect(JSON.stringify(result.instance.query)).toEqual(JSON.stringify(query));
        expect(JSON.stringify(result.context)).toEqual(JSON.stringify(contextParamExpected));
    });

    it('execCase, verify the params of global and global.beforeEachStart should be called', async () => {

        const result = await getExecCaseParams(context);
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

        const result = await getExecCaseParams(context);
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

    it(`testCase, global.execCase should be called and the param is equal to ${execCaseParamExpected}`, async () => {

        global.execCase = jest.fn();

        await testCase(caseParams, argFn);

        expect(global.execCase).toBeCalled();
        expect(global.execCase).toHaveBeenCalledWith(execCaseParamExpected);

    });

    it(`testCase, global.execCase should not be called`, async () => {

        global.execCase = jest.fn();

        await testCase(caseParamsSkipped, argFn);

        expect(global.execCase).not.toBeCalled();

    });

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

