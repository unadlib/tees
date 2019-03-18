const uuid = require('uuid');
const RPClient = require('reportportal-client');
const statusMap = require('../constants/status');
const { filterSkipTest, formatConsole, promiseReadfile, formatDate } = require('./helper');

class processor {
  constructor(options) {
    const {
      token, endpoint, project, launch
    } = options;
    this._options = options;
    this._client = new RPClient({
      token,
      endpoint,
      launch,
      project,
    });
    this._initCheck();
  }

  _initCheck() {
    this._client.checkConnect().then((response) => {
      console.log('You have successfully connected to the server.');
      console.log(`You are using an account: ${response.full_name}`);
    }, (error) => {
      const redText = '\x1b[31m%s\x1b[0m';
      console.error(redText, '【Reporter_Fail】: Error connection to server');
      console.dir(error);
      this._resetClient();
    });
  }

  _resetClient() {
    const EmpteFunc = () => {};
    Object.keys(this._client)
      .filter(key => typeof this._client[key] === 'function')
      .forEach((key) => { this._client[key] = EmpteFunc; });
  }

  startLaunch() {
    const { tags = '', launchname } = this._options;

    this._launchObj = this._client.startLaunch({
      name: launchname,
      start_time: this._client.helpers.now() - 3000,
      description: '**E2E TEST REPORTER**',
      tags: tags.split(','),
    });
  }

  startTestSuiteItem({
    name,
    startTime = this._client.helpers.now(),
  }) {
    const { appDirectory } = this._options;
    const path = name.replace(appDirectory, '');
    return this._client.startTestItem({
      name: path,
      start_time: startTime - 2000,
      type: 'SUITE',
    }, this._launchObj.tempId);
  }

  async logTestsItems({
    suiteTempId,
    tests = [],
    loggerInfo
  }) {
    return Promise.all(
      tests
      .filter(filterSkipTest)
      .map(async (test) => {
        const {
          ancestorTitles,
          duration,
          failureMessages,
          fullName,
          location,
          numPassingAsserts,
          status,
          title,
        } = test;

        const logArray = (loggerInfo[title] || []).sort((a, b) => a.time - b.time);
        const start_time = this._client.helpers.now() - duration;

        const testObj = this._client.startTestItem({
          name: title,
          type: 'TEST',
          description: fullName,
          start_time
        }, this._launchObj.tempId, suiteTempId);
        const currentTime = this._client.helpers.now();
        await Promise.all(logArray.map(async (logItem, index) => {
          const time = currentTime + index;
          if (logItem.type === 'screenshot') {
            const fileData = await promiseReadfile(logItem.info);
            return this._client.sendLog(testObj.tempId, {
              message: `🕙[ Time ]: ${formatDate(logItem.time)}\nscreenshot`,
              level: 'trace',
              time
            }, {
              name: uuid.v4(),
              type: 'image/png',
              content: fileData,
            });
          }
          return this._client.sendLog(testObj.tempId, {
            message: `🕙[ Time ]: ${formatDate(logItem.time)}\n${logItem.info}`,
            level: logItem.type,
            time
          });
        }))
        if (status !== 'passed') {
          this._client.sendLog(testObj.tempId, {
            message: failureMessages.join('\n'),
            level: 'error',
            time: currentTime + logArray.length + 1000,
          });
        }
        return this._client.finishTestItem(testObj.tempId, {
          status: statusMap[status] || 'passed'
        });
      })
    )
  }

  async finishTestSuiteItem({
    tempId,
    testResult
  }) {
    const {
      console,
      failureMessage,
      numFailingTests,
      numPassingTests,
      numPendingTests,
      perfStats,
      snapshot,
      testFilePath,
      testResults,
      coverage,
      sourceMaps,
      skipped,
      displayName,
      leaks,
      testExecError,
    } = testResult;
    const consoleInfo = testResult.console;

    await this.logTestsItems({
      suiteTempId: tempId,
      tests: testResults,
      loggerInfo: formatConsole(consoleInfo),
    });
    if (failureMessage || testExecError) {
      this._client.sendLog(tempId, {
        message: `${failureMessage}\n${testExecError}`,
        status: 'trace'
      });
    }

    return this._client.finishTestItem(tempId, {end_time: this._client.helpers.now() + 1000});
  }

  finishLaunch() {
    const launchFinishObj = this._client.finishLaunch(this._launchObj.tempId, {
      end_time: this._client.helpers.now() + 2000,
    });
    return launchFinishObj.promise;
  }
}


module.exports = processor;
