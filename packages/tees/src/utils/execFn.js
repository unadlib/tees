module.exports = function execFn(command) {
  if (typeof command === 'function') {
    try {
      command();
    } catch (e) {
      console.error(e);
    }
  }
};
