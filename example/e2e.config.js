module.exports = {
  selectorLabel: 'class',
  exec: {
    drivers: ['puppeteer'],
    driver: {
      setting: {
        defaultViewport: {
          height: 800,
          width: 800,
        },
        args: [
          '--disable-dev-shm-usage',
        ]
      }
    },
    type: 'extension',
    extension: '../../extension/google-rc',
    // executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
    userDataDir: '../../GoogleProfile/Chrome',
  },
  params: {
    projects: {
      'example': {
        type: 'uri',
        location: 'https://cn.bing.com/',
        driver: {
          setting: {
            defaultViewport: {
              height: 300,
              width: 300,
            },
            args: [
              '--disable-dev-shm-usage',
            ]
          }
        },
      },
      // 'example1': {
      //   type: 'uri',
      //   location: 'https://cn.bing.com/',
      //   driver: {
      //     setting: {
      //       defaultViewport: {
      //         height: 800,
      //         width: 800,
      //       },
      //       args: [
      //         '--disable-dev-shm-usage',
      //       ]
      //     }
      //   },
      // }
    }
  },
  defaults:{
    drivers:['chrome','puppeteer'],
  },
  lookupConfig({
    config,
    tag
  }) {
    const project = config.params.projects[tag.project];
    return {
      ...project,
      configSetting: project.driver.setting,
    }
  },
};
