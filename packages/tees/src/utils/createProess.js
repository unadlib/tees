const childProcess = require('child_process');

const DEAULT_PROCESS_STDIO = 'inherit';
const DEAULT_PROCESS_OPTIONS = {
  stdio: DEAULT_PROCESS_STDIO,
  cwd: process.cwd()
};
const DEAULT_PROCESS_EXIT = (code, signal) => {
  console.log(signal, 'exit');
};
const DEAULT_PROCESS_CLOSE = (code, signal) => {
  console.log(signal, 'close');
};
const DEAULT_PROCESS_START = () => {};

module.exports = function createProcess({
  command,
  args,
  options = DEAULT_PROCESS_OPTIONS,
  exit = DEAULT_PROCESS_EXIT,
  close = DEAULT_PROCESS_CLOSE,
  start = DEAULT_PROCESS_START,
}) {
  start({
    command,
    args,
    options
  });
  const commandProcess = childProcess.spawn(command, args, options);
  commandProcess.on('exit', exit);
  commandProcess.on('close', close);
  // TODO define logger for CLI.
  // commandProcess.stdout.on('data', data => console.log(`${data}`));
  // commandProcess.stderr.on('data', data => console.log(`${data}`));
  return commandProcess;
};
