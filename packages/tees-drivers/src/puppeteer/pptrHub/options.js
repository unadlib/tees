const defOption = {
  "browsersConfig": {
    "nodes": [{
      "nodeID": "node1",
      "connectionType": "remote",
      "sessionMode": "simple",
      "maxConcurrentSessions": 1
    }]
  }
}

const puppeteerHubUrl =
  process.env.PUPPETEER_HUB_URL ||
  'http://10.32.44.22:7500';

const connectionType = process.env.connectionType || 'remote';

function getEnvOptions() {
    let options = '';
    if (process.env.pptrHubOpt) {
        options = process.env.pptrHubOpt;
    }
    return options;
  }
  
  const options = () => {
    const envOptions = getEnvOptions();
    return envOptions || defOption;
  }
    
  module.exports = {options, puppeteerHubUrl, connectionType};