function compile({
  keys,
  values,
  template,
}) {
  // eslint-disable-next-line
  const renderTemplate = new Function(...keys, `return \`${template}\``);
  return renderTemplate(...values);
}

module.exports = {
  compile,
};
