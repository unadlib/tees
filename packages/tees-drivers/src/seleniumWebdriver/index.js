const fs = require('fs');
const path = require('path');
const {
  Builder,
  By,
  until
} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const safari = require('selenium-webdriver/safari');
const ie = require('selenium-webdriver/ie');
const edge = require('selenium-webdriver/edge');
const {
  Driver: BaseDriver,
  Query: BaseQuery
} = require('../base');

const capabilities = {
  acceptSslCerts: true,
  acceptInsecureCerts: true,
  args: [
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--use-file-for-fake-audio-capture',
    '--allow-silent-push',
    '--disable-setuid-sandbox',
    '--no-sandbox',
    '--disable-gpu'
  ]
};

const Browsers = {
  chrome: 'chrome',
  edge: 'MicrosoftEdge',
  firefox: 'firefox',
  ie: 'internet explorer',
  safari: 'safari',
};

const seleniumWebdriverSetting = {
  safari: new safari.Options(),
  chromeHeadless: new chrome.Options().headless(),
  chrome: new chrome.Options(),
  firefoxHeadless: new firefox.Options().headless(),
  firefox: new firefox.Options(),
  ie: new ie.Options(),
  edge: new edge.Options(),
};

class Query extends BaseQuery {
  
  async getText(selector, options = {}) {
    const [ text ] = await this.getTexts(selector, options) || [];
    return text;
  }

  async getTexts(selector, options = {}) {
    const elements = await this.$$(selector, options);
    let innerTexts = [];
    for(const ele of elements) {
      const text = await ele.getText() || await ele.getAttribute('textContent'); 
      innerTexts.push(text);
    }
    return innerTexts;
  }

  async getAttribute(selector, attribute, options = {}) {
    const element = await this._getElement(selector, options);
    const attributeValue = await element.getAttribute(attribute);
    return attributeValue;
  }

  async getProperty(selector, property, options = {}) {
    const propertyValue = await this.getAttribute(selector, property, options);
    return propertyValue;
  }

  async getValue(selector, options = {}) {
    const value = this.getAttribute(selector, 'value', options);
    return value;
  }

  async html(selector) {
    const html = this.getAttribute(selector, 'innerHTML');
    return html;
  }

  async click(selector, options = {}) {
    const element = await this._getElement(selector, options);
    await element.click();
  }

  async type(selector, value, options = {}) {
    const element = await this._getElement(selector, options);
    if (options && options.delay) {
      for (const char of value) {
        await element.sendKeys(char);
        await this.waitFor(options.delay);
      }
    } else {
      await element.sendKeys(value);
    }
  }

  async waitForSelector(selector, options = {}) {
    const element = await this._getElement(selector, options);
    return element;
  }

  async url() {
    return this._node.getCurrentUrl();
  }

  async goto(url) {
    await this._node.get(url);
  }

  async getNewOpenPage() {
    await this.waitFor(3000);
    const handles = await this._node.getAllWindowHandles();
    await this._node.switchTo().window(handles[handles.length - 1]);
    return this._node;
  }

  async clickToGetNewOpenPage(selector, browser, options = {}) {
    await this.click(selector, options);
    await this.waitFor(3000);
    const handles = await this._node.getAllWindowHandles();
    await this._node.switchTo().window(handles[handles.length - 1]);
    return this._node;
  }

  async backPreviousPage() {
    const handles = await this._node.getAllWindowHandles();
    if(handles.length > 1 ) {
      await this._node.switchTo().window(handles[handles.length - 2]);
    } else {
      await this._node.switchTo().window(handles[handles.length - 1]);
    }
  }

  async waitForClosingLatestWindow() {
    const handles = await this._node.getAllWindowHandles();
    await this._node.wait(async() => {
      const currentHandles = await this._node.getAllWindowHandles();
      while (handles.length - currentHandles.length === 1 ) {
        return true;
      }
    }, 15000);
  }

  async screenshot({
    path
  } = {}) {
    await this._node.takeScreenshot().then((data) => {
      const base64Data = data.replace(/^data:image\/png;base64,/, '');
      fs.writeFile(path, base64Data, 'base64');
    });
  }

  async waitForFrames(frames) {
    for (const frame of frames) {
      const element = await this._node.wait(until.elementLocated(By.css(frame)));
      await this._node.switchTo().frame(element);
    }
    return this._node;
  }

  async execute(...args) {
    let script = args.shift();
    if ((typeof script !== 'string' && typeof script !== 'function')) {
      throw new Error('number or type of arguments don\'t agree with execute protocol command');
    }
    if (typeof script === 'function') {
      script = `return (${script}).apply(null, arguments)`;
    }
    // TODO safari
    const handle = this._node.executeScript(script, args);
    await this.waitFor(100);
    // wait for applying to UI.
    return handle;
  }

  async reload() {
    await this._node.refresh();
  }

  async clear(selector, options = {}) {
    const element = await this._getElement(selector, options);
    element.clear();
    // const text = await element.getAttribute("value");
    // console.log(text.length,'length');
    // for(let i=0; i < text.length; i++) {
    //   element.sendKeys('\uE003');
    // }
  }

  async waitForFunction(...args) {
    const result = await this.execute(...args);
    if (result) return;
    await this.waitFor(250);
    await this.waitForFunction(...args);
  }

  async _getElement(selector, options = {}) {
    const _selector = this.getSelector(selector, options);
    const element = await this._node.wait(until.elementLocated(By.css(_selector)));
    return element;
  }

  async $(selector, options = {}) {
    const _selector = this.getSelector(selector, options);
    const element = this._node.findElement(By.css(_selector));
    return element;
  }

  async $$(selector, options = {}) {
    const _selector = this.getSelector(selector, options);
    const elements = this._node.findElements(By.css(_selector));
    return elements;
  }

  async closePage(options = {}){
    await this._node.close();
  }
}

module.exports = (browser) => {
  const webdriver = browser.toLowerCase();
  const setKeyName = `set${browser}Options`;
  const setting = seleniumWebdriverSetting[webdriver];
  class Driver extends BaseDriver {
    constructor(options = {}, program = new Builder()) {
      super(options, program);
    }

    async run({ configSetting, type, extension = '',executablePath = '' , userDataDir = '', isHeadless } = {}) {
      this._isHeadless = isHeadless;
      let _setting = this._options.driver.setting;
      console.log(this._isHeadless, '_isHeadless');
      const isExtension = type === 'extension';
      const extensionPath = path.resolve(process.cwd(), extension);
      if (this._isHeadless) {
        _setting = seleniumWebdriverSetting[`${webdriver}Headless`] || _setting;
      } else {
        console.log(webdriver);
        _setting = seleniumWebdriverSetting[`${webdriver}`]
      }
      if(webdriver ==='chrome' || webdriver === 'firefox') {
        _setting.windowSize(configSetting.defaultViewport || {width: 1000, height: 800});
        const capabilitiesArgs = [
          ...capabilities && capabilities.args || '',
          ...configSetting && configSetting.args || ''
        ];
        _setting.addArguments(capabilitiesArgs);
        if(isExtension) {
          if(this._isHeadless) {
            console.error('Headless mode is not supported by extension!!!');
            return;
          }
          if(webdriver !== 'chrome') {
            console.error('firefox is not supported by extension!!!,you can use firefox-extension');
            return;
          }
          _setting.addArguments([
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`
          ])
        }
        if(!!userDataDir) {
          _setting.addArguments([
            `--user-data-dir=${userDataDir}`
          ])
        }
      }

      const mergeCapabilities = {
      ...capabilities,
      ...configSetting,
      browserName: webdriver,
    }

    this._browser = this._program
        .forBrowser(Browsers[webdriver])[setKeyName]( 
          _setting
        )
        .withCapabilities(
          mergeCapabilities
        )
        .build();
    }

    async newPage() {
      this._page = this._browser;
    }

    async goto(config) {
      await this._browser.get(config.location);
    }

    async closePage() {
      await this.close();
    }

    async close() {
      if (this._browser) {
        try {
          await this._browser.close();
        } catch (e) {
          // console.error(e);
        }
        try {
          await this._browser.quit();
        } catch (e) {
          // console.error(e);
        }
      }
    }
  }

  return {
    Driver,
    setting,
    Query,
  };
};
