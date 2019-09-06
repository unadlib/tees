async function retryUntilPass(
    cb,
    maxRetryTime = 10,
    retryInterval = 1e3,
    forceThrow = true,
  ) {
    let i = 0;
    while (true) {
      try {
        await cb();
        break;
      } catch (err) {
        if (i < maxRetryTime && err instanceof assert.AssertionError) {
          i += 1;
          await sleep(retryInterval);
        } else if (forceThrow) {
          throw err;
        } else {
          break;
        }
      }
    }
  }

  module.exports = {retryUntilPass}