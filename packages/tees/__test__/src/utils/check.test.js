const {
  isPlainobject,
  isNil,
  checkValidity,
} = require('../../../src/utils/check');

describe('utils/check', () => {
  test('isNil', () => {
    [undefined, null].forEach((item) => {
      (expect(isNil(item)).toBeTruthy());
    });
    expect(isNil()).toBeTruthy();
    [{test: 1}, 1, true, false, 'test', {}, [], [1]].forEach((item) => {
      (expect(isNil(item)).toBeFalsy());
    });
  })

  test('isPlainobject', ()=> {
    [{}, {test: 1}].forEach((item) => {
      (expect(isPlainobject(item)).toBeTruthy());
    });
    [1, true, false, 'test', []].forEach((item) => {
      (expect(isPlainobject(item)).toBeFalsy());
    });
    expect(isPlainobject()).toBeFalsy();
  })

  test('checkValidity', ()=> {
    [[], undefined, null].forEach((item) => {
      (expect(checkValidity(item)).toEqual(['./']));
    });
    expect(checkValidity()).toEqual(['./']);
    expect(checkValidity('./test/test')).toEqual('./test/test');
    expect(checkValidity('!@#$%^&*()_+-=<>,.?/:;"\'`~|\\}/{[]}')).toEqual('!@#$%^&*()_+-=<>,.?/:;"\'`~|\\}/{[]}');
  })
});