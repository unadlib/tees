const fs = require('fs');
const Processor = require('./utils/processor');
const getOptions = require('./utils/options');

class reporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    const allOptions = getOptions(options, fs.realpathSync(process.cwd()));
    this._processor = new Processor(allOptions);
    this._suitesMap = {};
  }

  onRunStart() {
    this._processor.startLaunch();
  }

  onTestStart({ path }) {
    this._suitesMap[path] = this._processor.startTestSuiteItem();
  }

  onTestResult({ path }, testResult) {
    const startTime = this._suitesMap[path];
    return this._processor.finishTestSuiteItem({
      path,
      startTime,
      testResult
    });
  }

  onRunComplete(_, results) {
    // todo: check every test has complete.
    return this._processor.finishLaunch().then(d => d).catch(err => console.log(err));
  }
}

module.exports = reporter;
