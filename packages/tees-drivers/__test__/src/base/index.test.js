const {
  Query
} = require('../../../src/base/index');

describe('base/index unit test', () => {

  const query = new Query('', { label: 'class' });

  test('getSelector, the selector is @searchBoxForm @searchBox', () => {
    expect(query.getSelector(`@searchBoxForm @searchBox`)).toEqual(`[class="searchBoxForm"] [class="searchBox"]`);
  });

  test('getSelector, the selector is @searchBoxForm input', () => {
    expect(query.getSelector(`@searchBoxForm input`)).toEqual(`[class="searchBoxForm"] input`);
  });

  test('getSelector, the selector is [class="searchBoxForm"] input', () => {
    expect(query.getSelector(`[class="searchBoxForm"] input`)).toEqual(`[class="searchBoxForm"] input`);
  });

  test('getSelector, the selector is @b_searchboxForm:1 input', () => {
    expect(query.getSelector(`@b_searchboxForm:1`)).toEqual(`[class="b_searchboxForm"]:nth-child(1)`);
  });

  test('getSelector, the selector is @b_searchboxForm:-1 input', () => {
    expect(query.getSelector(`@b_searchboxForm:-1`)).toEqual(`[class="b_searchboxForm"]:nth-last-child(1)`);
  });
});

