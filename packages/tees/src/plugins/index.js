function load(plugins) {
  for (const plugin of plugins) {
    try {
      plugin();
    } catch (e) {
      console.error(e);
    }
  }
}

module.exports = {
  load,
};
