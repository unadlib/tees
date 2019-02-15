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

const formatDate = (timesteamp) => {
  const date = new Date(timesteamp);
  let fmt = 'yy-MM-dd hh:mm:ss';
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(), 
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
    "q+": Math.floor((date.getMonth() + 3) / 3), 
    "S": date.getMilliseconds()
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + ""));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
}

module.exports = {
  filterSkipTest,
  formatConsole,
  promiseReadfile,
  formatDate
};
