const { lstatSync } = require('fs');
const { getWorkAbsolutePath } = require('../utils/path');

const DEFAULT_ROOT = '<rootDir>';
const DEFAULT_TEST_MATCH = '**/?(*.)+(spec|test).js?(x)';

const defaultTestMatch = [`${DEFAULT_ROOT}/${DEFAULT_TEST_MATCH}`];

function isDirectory(testPath) {
  try {
    const isDirectory = lstatSync(testPath).isDirectory();
    return isDirectory;
  } catch (e) {
    console.warn(e);
  }
  return null;
}

function getTestMatch(paths) {
  if (paths.length > 0) {
    const testMatch = paths.map((path) => {
      const testPath = getWorkAbsolutePath(path);
      if (isDirectory(testPath)) {
        path = `${path}/**/*.js`;
      }
      return `${DEFAULT_ROOT}/${path.replace(/^\.\//, '')}`;
    });
    return testMatch;
  }
  return null;
}

module.exports = {
  getTestMatch,
  defaultTestMatch
};
