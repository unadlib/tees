const getNowTime = () => new Date().toTimeString().slice(0, 8);

module.exports = {
  getNowTime,
};
