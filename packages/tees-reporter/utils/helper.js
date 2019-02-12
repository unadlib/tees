const fs = require('fs');

/**
 * filter the skip item
 * @param {Object} testItem
 */
const filterSkipTest =
  (testItem = {}) => !(testItem.status === 'pending');

/**
 * format console
 * @param {Arry} consoleInfo 
 */
const formatConsole = (consoleInfo = []) => {
  if (!consoleInfo) return {};

  const list = consoleInfo.map(formatInfo).filter(d => !!d);
  const titleMapInfo = {};
  list.forEach( item => {
    if (!titleMapInfo[item.caseTitle]) titleMapInfo[item.caseTitle] = [];

    titleMapInfo[item.caseTitle].push(item);
  });
  return titleMapInfo;
}

const formatInfo = item => {
  if (item.type !== 'info') return false;
  const info = item.message;
  try {
    const loggerInfo = JSON.parse(info);
    if (loggerInfo && loggerInfo.reporterLogger) {
      return loggerInfo;
    } 
    return false;
  }catch (err){ 
    return false;
  }
}

const promiseReadfile = (path) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(data);
    })
  })
}

module.exports = {
  filterSkipTest,
  formatConsole,
  promiseReadfile,
};
