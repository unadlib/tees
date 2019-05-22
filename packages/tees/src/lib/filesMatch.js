const path = require('path');
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
    const testMatch = paths.map((fromPath) => {
      const testPath = getWorkAbsolutePath(fromPath);
      if (isDirectory(testPath)) {
        fromPath = `${fromPath}/**/*.js`;
      }

      return path.join(DEFAULT_ROOT, path.relative(process.cwd(), testPath));
    });
    return testMatch;
  }
  return null;
}

module.exports = {
  getTestMatch,
  defaultTestMatch
};
