const {
  isPlainobject,
  isNil,
  checkValidity,
} = require('../../../src/utils/check');

describe('utils/check', () => {
  test('isNil', () => {
    [undefined, null].forEach((item) => {
      expect(isNil(item)).toBeTruthy();
    })
  })
});