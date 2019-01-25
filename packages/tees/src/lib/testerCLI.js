
function getTesterCLI(cmd) {
  return (cmd.testerCLI || []).map(i => i.replace('#', '='));
}

module.exports = {
  getTesterCLI,
};
