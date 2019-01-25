class BaseService {
  async createCaseTemplate() {
    console.warn('Please redefine your `createCaseTemplate` function in your caseServices handler');
  }

  async updateCaseTemplate() {
    console.warn('Please redefine your `updateCaseTemplate` function in your caseServices handler');
  }
  async createAllDirectory(){
    console.warn('Please redefine your `createAllDirectory` function in your caseServices handler');
  }
}

module.exports = BaseService;
