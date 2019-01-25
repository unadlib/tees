const { getFile } = require('../utils/path');

function getParams({ params }) {
  const isPath = params && !(/^\[|^\{/).test(params);
  if (isPath) {
    return getFile(params);
  }
  try {
    // eslint-disable-next-line
    const parsedParams = Function(`return ${params}`)()
    return parsedParams;
  } catch (e) {
    console.error(`Unexpected parse ${params} format.`);
    console.error(e);
    process.exit();
  }
  return null;
}

module.exports = {
  getParams,
};
