const DEFAUL_MAX_TIMES = 10;

function getRetryTimes(cmd) {
  let retryTimes = 0;
  if (typeof cmd.retry === 'string') {
    const _retryTimes = Number(cmd.retry);
    retryTimes = Number.isNaN(_retryTimes) ? DEFAUL_MAX_TIMES : _retryTimes;
  } else if (cmd.retry && typeof cmd.retry === 'boolean') {
    retryTimes = DEFAUL_MAX_TIMES;
  }
  return retryTimes;
}

module.exports = {
  getRetryTimes,
};
