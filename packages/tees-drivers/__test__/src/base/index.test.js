const {
  Query
} = require('../../../src/base/index');

describe('base/index unit test for getSelector', () => {

  let query;
  beforeAll(() => {
    query = new Query('', { label: 'data-auto-id' });
  })

  test('The selector is @searchBoxForm @searchBox then return [data-auto-id="searchBoxForm"] [data-auto-id="searchBox"]', () => {
    expect(query.getSelector(`@searchBoxForm @searchBox`)).toEqual(`[data-auto-id="searchBoxForm"] [data-auto-id="searchBox"]`);
  });

  test('The selector is @searchBoxForm input[data-auto-id-test="searchBox"] then return [data-auto-id="searchBoxForm"] input[data-auto-id-test="searchBox"]', () => {
    expect(query.getSelector(`@searchBoxForm input[data-auto-id-test="searchBox"]`)).toEqual(`[data-auto-id="searchBoxForm"] input[data-auto-id-test="searchBox"]`);
  });

  test('If selector is a native css, it will not change"]', () => {
    expect(query.getSelector(`[class="searchBoxForm"] input[class="searchBox"]`)).toEqual(`[class="searchBoxForm"] input[class="searchBox"]`);
  });

  test('The selector is @b_searchboxForm:1 then return [data-auto-id="b_searchboxForm"]:nth-child(1)', () => {
    expect(query.getSelector(`@b_searchboxForm:1`)).toEqual(`[data-auto-id="b_searchboxForm"]:nth-child(1)`);
  });

  test('The selector is @b_searchboxForm:-1 then return [data-auto-id="b_searchboxForm"]:nth-last-child(1)', () => {
    expect(query.getSelector(`@b_searchboxForm:-1`)).toEqual(`[data-auto-id="b_searchboxForm"]:nth-last-child(1)`);
  });

  //TODO: unsupported selector
  test('The selector is div@b_searchboxForm then return [div[data-auto-id="b_searchboxForm"]', () => {
    expect(query.getSelector(`div@b_searchboxForm`)).not.toEqual(`div[data-auto-id="b_searchboxForm"]`);
  });

  test('The selector is div@b_searchboxForm then return [div[data-auto-id="b_searchboxForm"]', () => {
    expect(query.getSelector(`@b_searchboxForm div@b_searchbox`)).not.toEqual(`[data-auto-id="b_searchboxForm"] div[data-auto-id="b_searchbox"]`);
  });

});


describe('base/index unit test for getSelector', () => {
  let query;
  beforeAll(() => {
    query = new Query('', {});
  })

  test('If selector is a native css, it will not change', () => {
    [`[class="searchBox"]`, `[class*="searchBox"] [class="searchBoxForm"]`].forEach((selector) => {
      expect(query.getSelector(selector)).toEqual(selector);
    })
  });

});
