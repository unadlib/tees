const {
  getTestMatch,
  defaultTestMatch,
} = require('../../../src/lib/filesMatch');

describe('lib/fileMatch', () => {
  test('getTestMatch, the argument is empty [] or {}', () => {
    [
      [],
      {}
    ].forEach((item) => {
      (expect(getTestMatch(item)).toBeNull);
    });
  });

  test('getTestMatch, the argument is an array with single file', () => {
    expect(getTestMatch(['./src/example.js'])).toEqual(['<rootDir>/src/example.js']);
  });

  test('getTestMatch, the argument is an array with multiple files', () => {
    expect(getTestMatch(['./src/example.js', './src/example.spec.js'])).toEqual(['<rootDir>/src/example.js', '<rootDir>/src/example.spec.js']);
  });

  test('getTestMatch, the argument is an array with path', () => {
    expect(getTestMatch(['./'])).toEqual(['.//**/*.js']);
  });

  test('defaultTestMatch', () => {
    expect(defaultTestMatch).toEqual(["<rootDir>/**/?(*.)+(spec|test).js?(x)"]);
  });
});

