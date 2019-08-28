const { getTags, mergeTags, flattenTags, restoreTags, getCaseTags, generateLogger} = require('../../../src/lifecycle/helper.js');
describe('lifecycle/helper', ()=>{
    test('getTags: tags is []', () =>{
        const params = {
            rawTags: [[]],
            defaultTestConfig: [[ ]],
            caseTags: {}
        } 
        expect(getTags(params)).toEqual([[undefined, {}]])
    });
    test('getTags: tags is exist', () =>{
        const params = {
            rawTags: [[ 'example' ]],
            defaultTestConfig: [[ 'example', { drivers: ['puppeteer', 'chrome'] } ] ],
            caseTags: {}
        }
        expect(getTags(params)).toEqual([['example',{}]])
    });
    test('getTags: rawTags is []', () =>{
        const params = {
            rawTags: [['']],
            defaultTestConfig: [[ 'example', { drivers: ['puppeteer', 'chrome'] } ] ],
            caseTags: {}
        }
        expect(getTags(params)).toEqual([['',{}]])
    });
    test('getTags: defaultTestConfig is [[]]', () =>{
        const params = {
            rawTags: [[ 'example' ]],
            defaultTestConfig: [[ ]],
            caseTags: {}
        }
        expect(getTags(params)).toEqual([['example',{}]])
    });
    test('getTags: caseTags and rawTags is exist', () =>{
        const params = {
            rawTags: [[ 'example' ]],
            defaultTestConfig: [[ '', { drivers: ['puppeteer', 'chrome'] } ] ],
            caseTags: { levels: ["p0", "p1",], tags:[['widgets']]}
        }
        expect(getTags(params)).toEqual([['example', { levels: ["p0", "p1",], tags:[['widgets']]}]])
    });
    test('getTags: caseTags and defaultTestConfig is exist', () =>{
        const params = {
            rawTags: [[ '' ]],
            defaultTestConfig: [[ 'example', { drivers: ['puppeteer', 'chrome'] } ] ],
            caseTags: { levels: ["p0", "p1",], tags:[['widgets']]}
        }
        expect(getTags(params)).toEqual([['', { levels: ["p0", "p1",], tags:[['widgets']]}]])
    });
    test('getTags: rawTags, defaultTestConfig and caseTags is exist', () =>{
        const params = {
            rawTags: [[ 'example' ], [ 'example1' ]],
            defaultTestConfig: [[ 'example', { drivers: ['puppeteer', 'chrome'] } ],['example1'] ],
            caseTags: { levels: ["p0", "p1",], tags:[['widgets']]}
        }
        expect(getTags(params)).toEqual([['example', { levels: ["p0", "p1",], tags:[['widgets']]}], ['example1', { levels: ["p0", "p1",], tags:[['widgets']]}]])
    });
});
describe('lifecycle/helper', () => {
    test('mergeTags: tags and supersetTags is Exist', () => {
        const tags = [['example',{}]];
        const supersetTags = [[ 'example', { drivers: ['puppeteer', 'chrome'] } ] ];
        expect(mergeTags(tags, supersetTags)).toEqual(supersetTags);
    });
    test('mergeTags: tags is [[]] ', () => {
        const tags = [['']];
        const supersetTags = [[ 'example', { drivers: ['puppeteer', 'chrome'] } ] ];
        expect(mergeTags(tags, supersetTags)).toEqual([]);
    });
    test('mergeTags: tags is []', () => {
        const tags = [];
        const supersetTags = [[ 'example', { drivers: ['puppeteer', 'chrome'] } ] ];
        expect(mergeTags(tags, supersetTags)).toEqual(supersetTags);
    });
    test('mergeTags: supersetTags arrsry[0] is ""', () => {
        const tags = [['example']];
        const supersetTags = [[ '', { drivers: ['puppeteer', 'chrome'] } ] ];
        expect(mergeTags(tags, supersetTags)).toEqual([]);
    });
    test('mergeTags: tags and supersetTags is Exist', () => {
        const tags = [['example',{}], ['example1']];
        const supersetTags = [[ 'example', { drivers: ['puppeteer', 'chrome'] } ], ['example1'] ];
        expect(mergeTags(tags, supersetTags)).toEqual(supersetTags);
    });
});
describe('lifecycle/helper', () => {
    test('flattenTags: tags is exist', () => {
        expect(flattenTags([['example']])).toEqual([['0-example']])
    });
    test('flattenTags: tags is [""] ', () => {
        expect(flattenTags([['']])).toEqual([['0-']])
    });
    test('flattenTags: tags is exist', () => {
        expect(flattenTags([['example', {}]])).toEqual([['0-example']])
    });
    test('flattenTags: tags is array', () => {
        expect(flattenTags([['example'], ['example1']])).toEqual([ [ '0-example', '1-example1' ] ])
    });
    test('flattenTags: tags is ""', () => {
        expect(flattenTags([''])).toThrow(new TypeError());
    });
});
describe('lifecycle/helper', () => {
    test('restoreTags: params is exist', () => {
        expect(restoreTags([ '0-example', '1-example1' ], 'example')).toEqual({'0': 'example', '1': 'example1', 'project': 'example'});
    });
    test('restoreTags: group is []]', () => {
        expect(restoreTags([], 'example')).toEqual({'project': 'example'});
    });
    test('restoreTags: params is undefault', () => {
        expect(restoreTags([], '')).toEqual({'project': ''});
    });
});
describe('lifecycle/helper', () => {
    // TODO
    test('getCaseTags:', () => {
        const params = {
            caseParams: {title: 'test example', tags: [['example']],}, 
            params: {drivers: ['puppeteer']}
        };
        expect(getCaseTags(params)).toEqual({});
    });
    test('getCaseTags: params is {}', () => {
        const params = {
            caseParams: {}, 
            params: {}
        };
        expect(getCaseTags(params)).toEqual({});
    });
});
describe('lifecycle/helper', () => {
    test('generateLogger: hasReport is false', () => {
        expect(generateLogger('test1', false)).toBeTruthy()
        // expect(generateLogger('test1', false)).toEqual({"debug": `[Function anonymous]`, "error": `[Function anonymous]`, "info": `[Function anonymous]`, "log": `[Function anonymous]`, "screenshot": `[Function anonymous]`, "trace": `[Function anonymous]`, "warn": `[Function anonymous]`});
    });
    // test('generateLogger: hasReport is true', () => {
    //     expect(generateLogger('test1', true)).toEqual();
    // });
})
