const { Query: BaseQuery  } = require('tees-drivers/src/puppeteer');

class Query extends BaseQuery {
  async getText(...args) {
    return await super.getText(...args);
  }
}

module.exports = {
  Query,
};


