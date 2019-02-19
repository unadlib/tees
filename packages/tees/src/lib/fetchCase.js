const { resolve } = require('path');
const { configPath } = require('../run');


function handleCommand(arg, cmd) {
  let config;
  try {
    // eslint-disable-next-line
    config = require(configPath);
  } catch (error) {
    console.error(`Unexpected import '${configPath}' path.`);
    console.error(error);
    process.exit();
    return;
  }
  let cmdServices;
  if (arg) {
    const isCaseIDs = (/,/).test(arg);
    // eslint-disable-next-line
    const caseIDArray = arg.split(isCaseIDs ? ',' : ' ').map(e => parseInt(e));
    if (!cmd.origin) {
      cmd.origin = config.caseServices.defaultOrigin;
      console.warn(`you are using defaultOrigin --> ${config.caseServices.defaultOrigin}`);
    }
    cmdServices = { list: [{ origin: cmd.origin, caseID: caseIDArray }] };
  } else if (cmd.origin) {
    cmdServices = { list: [{ origin: cmd.origin }] };
  } else {
    try {
      cmdServices = JSON.parse(cmd.service);
    } catch (error) {
      throw new Error(error);
    }
  }

  const {
    originField, handlerField, projectIdField, ulField
  } = config.caseServices;
  const configServicesList = config.caseServices.list.map(item => ({
    ...item,
    origin: item[originField || 'origin'],
    handler: item[handlerField || 'handler'],
    projectId: item[projectIdField || 'projectId'],
    ul: item[ulField || 'ul']
  }));
  const cmdServicesList = cmdServices.list;
  cmdServicesList.forEach((cmdService, index) => {
    const length = configServicesList.length;
    for (let i = 0; i < length; i += 1) {
      if (cmdService.origin === configServicesList[i].origin) {
        cmdServicesList[index] = { ...configServicesList[i], ...cmdService };
        break;
      }
    }
  });
  return cmdServicesList;
}

const create = async (caseID, cmd) => {
  const cmdServicesList = handleCommand(caseID, cmd);
  let Services;
  for (const {
    handler, caseID, featuresPath, ...params
  } of cmdServicesList) {
    try {
      // eslint-disable-next-line
      const servicesModule = require(resolve(process.cwd(), handler));
      Services = (servicesModule && servicesModule.__esModule) ?
        servicesModule.default :
        servicesModule;
    } catch (error) {
      throw new Error(error);
    }
    const services = new Services(params);
    if (!featuresPath || featuresPath === '') {
      console.error(`Please enter featuresPath in ${configPath}`);
      process.exit();
      return;
    }

    for (const id of caseID) {
      await services.createCaseTemplate(id, featuresPath);
    }
  }
};

const update = async (caseID, cmd) => {
  const cmdServicesList = handleCommand(caseID, cmd);
  let Services;
  for (const {
    handler, caseID, featuresPath, ...params
  } of cmdServicesList) {
    try {
      // eslint-disable-next-line
      const servicesModule = require(resolve(process.cwd(), handler));
      Services = (servicesModule && servicesModule.__esModule) ?
        servicesModule.default :
        servicesModule;
    } catch (error) {
      throw new Error(error);
    }
    const services = new Services(params);
    if (!featuresPath || featuresPath === '') {
      console.error(`Please enter featuresPath in ${configPath}`);
      process.exit();
      return;
    }

    for (const id of caseID) {
      await services.updateCaseTemplate(id, featuresPath);
    }
  }
};

const mkdir = async (cmd) => {
  const cmdServicesList = handleCommand('', cmd);
  let Services;
  for (const {
    handler, featuresPath, ...params
  } of cmdServicesList) {
    try {
      // eslint-disable-next-line
      const servicesModule = require(resolve(process.cwd(), handler));
      Services = (servicesModule && servicesModule.__esModule) ?
        servicesModule.default :
        servicesModule;
    } catch (error) {
      throw new Error(error);
    }
    const services = new Services(params);
    if (!featuresPath || featuresPath === '') {
      console.error(`Please enter featuresPath in ${configPath}`);
      process.exit();
      return;
    }
    await services.createAllDirectory(featuresPath);
  }
};

module.exports = {
  create,
  update,
  mkdir
};
