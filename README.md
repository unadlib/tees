# tees

[![Travis](https://img.shields.io/travis/unadlib/tees.svg)](https://travis-ci.org/unadlib/tees)
[![npm](https://img.shields.io/npm/v/tees.svg)](https://www.npmjs.com/package/tees)

`tees` is a complex of E2E test framework, it's based on `jest` as test runner.

### Contents

- [Getting Started](#getting-started)
- [Additional Configuration](#additional-configuration)
- [Tutorial](#tutorial)
- [Advanced Guides](#advanced-guides)
- [API Reference](#api-reference)
  - [Test CLI](#test-cli)
  - [Project Config](#project-config)
  - [Test Drivers](#test-drivers)
  - [Test Hooks](#test-hooks)
- [Benchmark Results](#benchmark-results)
- [Contribution Guide](#contribution-guide)

### Getting Started

1. Initialize tees by cli:

```sh
npx tees init my-app
```

2. Tees will ask you a few questions and will create a basic configuration file and an example file. Press Enter key to choose the default configuration.
3. Running from the command line:  
   There is a folder "yourProjectName" under the current path:

```she
cd my-app
```

Run yarn install to install the necessary dependencies. It will take you several minutes.

```sh
yarn install
```

Run your first E2E case:

```sh
npx tees run ./src/example.spec.js
```

### Additional Configuration

Based on your project, there are several things need to config in e2e.config.js file.
Add params in e2e.config, such as the project name, the type of your project.

```js
module.exports  = {
	params: {
		projects: {
			//project name
			'example': {
				//uri or extension
				type: 'uri',
				//if your project is an extension, you need to add source path
				location: 'https://cn.bing.com/',
			}
		}
	},
	...
};
```

Change the selectorLabel to what you are using, eg. class, id, or any other tag
name.

```js
module.exports  = {
	selectorLabel: 'class',
	...
};
```

The default execution timeout for each test case is 2 minutes. If you want to change it to 20 minutes, you can add timeout in e2e.config.

```js
module.exports  = {
	timeout: 1000  *  60  *  20,
	...
};
```

### Advanced Guides

#### CLI usage:
A simplest command can be: npx tees run yourTestFilePath

Use CLI params to control the test you are running:

| Reference                 | Short key | Params           | default     |
| ------------------------- | --------- | ---------------- | ----------- |
| [--params](#params)       | -P        | -P {}            | None        |
| [--drivers](#drivers)     | -D        | -D {drivers}     | all drivers |
| [--sandbox](#sandbox)     | -S        | -S               | disable     |
| [--debugger](#debugger)   | -X        | -X               | disable     |
| [--headless](#headless)   | -H        | -H               | disable     |
| [--exclude](#exclude)     | -E        | -E {filePath}    | disable     |
| [--verbose](#verbose)     | -A        | -A               | false       |
| [--retry](#retry)         | -T        | -T {retryNumber} | 0           |
| [--report](#report)       | -R        | -R               | disable     |
| [--testerCLI](#testerCLI) | -C        | -C               | disable     |

##### params

Run all cases which met all these params.

```sh
-P '{brands:["rc",],levels:["p0","p1",],tags:[["widgets"],]}'
```

##### drivers

Run case on specific driver

```sh
-D puppeteer
```

or use ',' to split difference drivers

```sh
-D puppeteer,chrome
```

supported drivers:

1. puppeteer
2. chrome
3. firefox
4. edge
5. ie
6. safari
7. enyzme

##### sandbox

With sandbox mode, every case will start a totally new driver.
Without sandbox mode, every run will only start a driver.

##### debugger

With debugger mode, some additional debug message will output. Default OFF.

##### headless

Headless default OFF.

##### exclude

Use exclude to ignore some unnecessary path.

```sh
-E ./node_modules/
```

to ignore more than one path

```sh
-E ./node_modules/ ./__temp__/
```

##### verbose

Enable verbose to get more imformation when debugging.

##### retry

Rerun case when there are some error occur. The default value of retry time is 0. The maximum retry times is 10.

```sh
-T 3
```

##### reporter

Enable reporter will push your console output to an on-line web.

##### testerCLI

Jest CLI. Pass params to jest via this testerCLI.

```sh
-C '--findRelatedTests path/to/fileA.js path/to/fileB.js'
```

Note: And you can append all these commands together.

The command below will run test file 1 and 2 in puppeteer on sandbox and headless mode. Example:

```sh
npx tees run yourTestFilePath1 yourTestFilePath2 -D puppeteer -S -H
```

#### E2E config

### APIs Reference

#### Test CLI

| Reference  | Description                                   | type   | default |
| ---------- | --------------------------------------------- | ------ | ------- |
| --params   | Run E2E test case with some params filtering. | object | None    |
| --sandbox  | Run E2E test case with 'sandbox' mode.        |        | disable |
| --debugger | Run E2E test case with 'debugger' mode.       |        | disable |
| --headless | Run E2E test case with 'headless' mode.       |        | disable |
| --exclude  | Run E2E test case exclude some files.         |        | disable |
| --verbose  | Run E2E test case with verbose log.           |        | false   |
| --retry    | Run E2E test case with retry times.           |        | 0       |

#### Project Config

| Reference    | Description                                     | type     |
| ------------ | ----------------------------------------------- | -------- |
| lookupConfig | Look up executive config from this config file. | function |
| params       | Setting project basic information.              | object   |

#### Test Drivers

##### Driver APIs

| Reference | Description                                     | arguments           |
| --------- | ----------------------------------------------- | ------------------- |
| goto      | Current page goto a new page with a url.        | (config)            |
| clear     | Clear the value of this element.                | (selector, options) |
| newPage   | Create a new page in a default browser context. | ()                  |
| closePage | Closes the current window.                      | ()                  |

##### Query APIs

| Reference       | Description                                                | arguments                  |
| --------------- | ---------------------------------------------------------- | -------------------------- |
| getText         | Get text from a selector.                                  | (selector[, options])      |
| goto            | Current page goto a new page with a url.                   | (config)                   |
| click           | left-click with the mouse.                                 | (selector, options)        |
| type            | Enter a value on the selector.                             | (selector, value, options) |
| waitForSelector | Wait for the selector to appear in page.                   | (selector, options)        |
| waitForFrames   | Wait for the iframes to appear in page and return a frame. | (frameSelector)            |
| screenshot      | Takes a screenshot of the current page.                    | (path)                     |
| execute         | Executes JavaScript in sandbox env.                        | (...args)                  |

#### Test Hooks

| Reference           | Description           | callback arguments |
| ------------------- | --------------------- | ------------------ |
| driver.addAfterHook | After each case ends. | -                  |

example:

```js
context.driver.addAfterHook(async () => {
  await process.exec(Logout);
});
```

### Benchmark Results

// device and environmental information

| Drivers                             | cases | threads | sandbox | performance | stability |
| ----------------------------------- | ----- | ------- | ------- | ----------- | --------- |
| **puppeteer/Firefox/Chrome/Safari** | 1600  | 1       |         | 1312.125s   | ✅        |
| **puppeteer**                       | 400   | 8       |         | 96.44s      | ✅        |
| puppeteer                           | 400   | 1       |         | 237.614s    | ✅        |
| puppeteer                           | 400   | 8       | ✅      | 289.44s     | ✅        |
| Chrome                              | 400   | 8       |         | 103.665s    | ✅        |
| Firefox                             | 400   | 8       |         | 415.726s    | ✅        |
| puppeteer/Firefox/Chrome            | 1200  | 8       |         | 630.503s    | ⚠️        |
| Safari                              | 400   | 8       |         | -           | ❌        |
| Enzyme                              | 400   | 1       | ✅      | 374.998s    | ✅        |
| **Enzyme**                          | 400   | 8       | ✅      | 149.882s    | ✅        |
| Enzyme                              | 400   | 1       |         | -           | ❌        |

> `Chrome` is selenium webdriver's Chrome.</br>
> Selenium webdriver multithreading operation is not stable.</br>
> Selenium Webdriver Safari does not support multithreading.</br>
> Enzyme does not support non-sandbox mode(Default forced sandbox mode).

### [Contribution Guide](CONTRIBUTION.md)

Read our [contribution guide](CONTRIBUTION.md) to learn about our development process, how to propose bugfixes and improvements, and how to build and test your changes to Tees.

### License

Tees is MIT licensed.
