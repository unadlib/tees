module.exports = {
  timeout: 1000 * 60 * 20,
  selectorLabel: 'data-sign',
  defaults: {
    // drivers: ['enzyme2'],
    levels: ['p3'],
    brands: ['rc'],
    accounts: ['CM_RC_US'],
    tags: [
      [
        'salesforce',
        {
          modes: ['lightning', 'classic'],
          accounts: ['CM_RC_US'],
          // drivers: ['firefox1']
        }
      ],
    ],
  },
  params: {
    projects: {
      salesforce: {
        type: 'uri',
        source: './src/targets/widgets',
        driver: {
          setting: {
            defaultViewport: {
              height: 850,
              width: 1100,
            },
            args: [
              '--disable-dev-shm-usage',
            ]
          }
        },
        params: {
          // drivers: ['puppeteer3'],
          modes: [
            'lightning',
            'classic'
          ],
          brands: {
            rc: {
              location: 'https://login.salesforce.com/',
            },
            att: {
              location: 'https://login.salesforce.com/',
            },
            bt: {
              location: 'https://login.salesforce.com/',
            },
            telus: {
              location: 'https://login.salesforce.com/',
            },
          },
        }
      },
    },
    drivers: ['chrome4'],
    levels: ['p0', 'p1', 'p2', 'p3'],
    brands: ['rc', 'bt', 'telus', 'att'],
  },
  lookupConfig: 'not a function',
  beforeEachCase: null,
  afterEachCase: null,
  plugins: [
    // logger,
  ],
};
