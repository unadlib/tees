class Log {
  constructor(scope) {
    this._scope = scope;
  }

  create() {
    this._scope.__log__ = [];
  }

  add(level, info) {
    if (!Array.isArray(this._scope.__log__)) {
      this.create();
    }
    this._scope.__log__.push({
      time: new Date().getTime(),
      info,
      level
    });
  }
}

function injectLog() {
  const log = new Log(global);
  global.addLog = log.add.bind(log);
}

global.__logs__ = [];

module.exports = injectLog;
