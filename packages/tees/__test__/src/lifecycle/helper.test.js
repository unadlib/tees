const helper = require('../../../src/lifecycle/helper');
const configData = require('../../__mocks__/e2e.config');
const configPriority = require('../../__mocks__/configPriority.json');
const {puppeteer, enzyme} = require('../../../../tees-drivers/src/');
const log = require('../../../src/plugins/log');
const retryTimesKey = Symbol.for('RETRY_TIMES');

global.execGlobal = {
  selectorLabel: 'selectorLabel',
  ...configData
}

const globalConfig = global.execGlobal;

function getDrivers(configData) {
  var [[,{drivers: [driver]}]] = helper.flattenTestConfig(configData);
  return driver;
}

describe('lifecycle/helper', () => {
  test('flatternTestConfig', () => {
    for (var key in configPriority.valid) {
      expect(getDrivers(configPriority.valid[key])).toEqual(configPriority.expectDriver[key]);
    }
    // source code need to handle invaild config
    // for (var key in configPriority.invalid) {
    //   expect(getDrivers(configPriority.invalid[key])).toEqual();
    // }
  })

  test('flatternTags', () => {
    expect(helper.flattenTags({
        drivers: ['chrome', 'puppeteer'],
        levels: ['p0', 'p1'],
        brands: ['rc', 'bt'],
    })).toEqual(
      [
        ["drivers-chrome", "levels-p0", "brands-rc"],
        ["drivers-chrome", "levels-p0", "brands-bt"],
        ["drivers-chrome", "levels-p1", "brands-rc"],
        ["drivers-chrome", "levels-p1", "brands-bt"],
        ["drivers-puppeteer", "levels-p0", "brands-rc"],
        ["drivers-puppeteer", "levels-p0", "brands-bt"],
        ["drivers-puppeteer", "levels-p1", "brands-rc"],
        ["drivers-puppeteer", "levels-p1", "brands-bt"]
      ]
    );
    expect(helper.flattenTags({drivers: ['chrome'],})).toEqual(
      [
        ["drivers-chrome"]
      ]
    );
  })

  test('getDriverInstance', () => {
    expect(helper.getDriverInstance(
      {drivers: {'puppeteer': {driver: 'test'}},
        driver: 'puppeteer',
        isSandbox: false}
        )).toEqual({"driver": "test"});
    expect((helper.getDriverInstance(
      {drivers: {'puppeteer': {driver: 'test'}},
        driver: 'puppeteer',
        isSandbox: true}
      ).driver) instanceof puppeteer.Driver).toBeTruthy();
    expect((helper.getDriverInstance(
      {drivers: {'puppeteer': {driver: 'test'}},
        driver: 'enzyme',
        isSandbox: false}
      ).driver) instanceof enzyme.Driver).toBeTruthy();
    expect((helper.getDriverInstance(
      {drivers: {'puppeteer': {driver: 'test'}},
        driver: 'enzyme',
        isSandbox: true}
      ).driver) instanceof enzyme.Driver).toBeTruthy();
  })

  test('testPrepare', () => {
    const configPath = '../../__test__/__mocks__/e2e.config';
    expect(helper.testPrepare({
      overWriteConfigPath: configPath,
      tag: {project: 'salesforce'},
      drivers: {'puppeteer': {driver: 'test'}},
      driver: 'puppeteer',
      isSandbox: false}).instance).toEqual({driver: 'test'});

    const configPathNotAFunction = '../../__test__/__mocks__/e2e.config.notAFunction';
    const mockLookupConfig = require('../../__mocks__/e2e.config.notAFunction');

    expect(helper.testPrepare({
      overWriteConfigPath: configPathNotAFunction,
      tag: {project: 'salesforce'},
      drivers: {'puppeteer': {driver: 'test'}},
      driver: 'puppeteer',
      isSandbox: false}).config).toEqual({});

    expect(helper.testPrepare({
      overWriteConfigPath: configPathNotAFunction,
      tag: {project: 'salesforce'},
      drivers: {'puppeteer': {driver: 'test'}},
      driver: 'puppeteer',
      isSandbox: false}).beforeEachCase).toEqual(mockLookupConfig.beforeEachCase);

    expect(helper.testPrepare({
      overWriteConfigPath: configPathNotAFunction,
      tag: {project: 'salesforce'},
      drivers: {'puppeteer': {driver: 'test'}},
      driver: 'puppeteer',
      isSandbox: false}).afterEachCase).toEqual(mockLookupConfig.afterEachCase);
  });

  test('setup without plugins', () => {
    expect(global.addLog).toBeUndefined();
    global.retryTimes = 3;
    const configPath = '../../__test__/__mocks__/e2e.config';
    helper.setup({config: globalConfig, plugins: [], overWriteConfigPath: configPath});
    expect(global[retryTimesKey]).toEqual(global.retryTimes);
    expect(global.testPrepare).toEqual(testPrepare);
    expect(global.testTimeout).toEqual(globalConfig.timeout);
    expect(global.defaultTestConfig).toEqual(
      [
        [
          "salesforce", {
            "accounts": ["CM_RC_US"],
            "brands": ["rc"],
            "drivers": ["chrome4"],
            "levels": ["p3"],
            "modes": ["lightning", "classic"]
          }
        ]
      ]
    );
    expect(global.addLog).toBeUndefined();
  });

  test('setup', () => {
    global.retryTimes = 3;
    const configPath = '../../__test__/__mocks__/e2e.config';
    helper.setup({config: globalConfig, plugins: [log], overWriteConfigPath: configPath});
    expect(global[retryTimesKey]).toEqual(global.retryTimes);
    expect(global.testPrepare).toEqual(testPrepare);
    expect(global.testTimeout).toEqual(globalConfig.timeout);
    expect(global.defaultTestConfig).toEqual(
      [
        [
          "salesforce", {
            "accounts": ["CM_RC_US"],
            "brands": ["rc"],
            "drivers": ["chrome4"],
            "levels": ["p3"],
            "modes": ["lightning", "classic"]
          }
        ]
      ]
    );
    expect(global.addLog).toBeInstanceOf(Function);
  });
});
