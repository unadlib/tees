const path = require('path');
const childProcess = require('child_process');
const defaultsConfig = require('./config');
const { getTesterArgs, getTester } = require('./lib/testerArgs');
const createProcess = require('./utils/createProess');
const execFn = require('./utils/execFn');

const relativeTester = `node_modules/${defaultsConfig.tester}/bin/${defaultsConfig.tester}.js`;
const tester = getTester({ dir: __dirname, relativeTester });
/**
 * Start the child process with executor.
 * @param {object} execParams - execution params.
 * @param {object} param - child proces hooks.
 * @param {function} param.onExit - child proces on exit.
 * @param {function} param.close - child process on close.
 */
async function execute(execParams, {
  onExit = () => {},
  onLaunch = () => {},
}) {
  const args = getTesterArgs(execParams);
  createProcess({
    command: 'node',
    args: [tester, ...args],
    close() {
      execFn(execParams.config.onClose);
      execFn(onExit);
      // TODO check chromedriver and puppeteer close abnormal.
      childProcess.exec('kill $(ps aux | grep chromedriver | grep -v grep | awk \'{print $2}\')');
      childProcess.exec('kill $(ps aux | grep Chromium | grep -v grep | awk \'{print $2}\')');
    },
    start() {
      execFn(onLaunch);
      execFn(execParams.config.onStart);
    }
  });
}

module.exports = execute;
