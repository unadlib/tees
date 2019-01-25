/**
 * sandbox: each test case will new browser in sandbox.
 * headless: each test case will use `headless` mode for browsers(except ie, edge and safari).
 * debugger: each test case will log all verbose info.
 */
const modes = {
  sandbox: {
    flags: '-S, --sandbox',
    description: 'Run E2E test case with \'sandbox\' mode.'
  },
  headless: {
    flags: '-H, --headless',
    description: 'Run E2E test case with \'headless\' mode.'
  },
  debugger: {
    flags: '-X, --debugger',
    description: 'Run E2E test case with \'debugger\' mode.'
  }
};

function getModes(cmd) {
  const modeKeys = Object.keys(modes);
  const _modes = modeKeys.reduce((_modes, mode) => {
    if (cmd[mode]) _modes.push(mode);
    return _modes;
  }, []);
  if (_modes.length === 0) {
    return null;
  }
  if (cmd.verbose) {
    _modes.push('verbose');
  }
  return _modes;
}

module.exports = {
  modes,
  getModes,
};
