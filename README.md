# tees
 `tees` is a complex of E2E test framework, it's based on `jest` as test runner.


### Contents

-   [APIs Reference](./#api-reference)
    -   [Test CLI](./#test-cli)
    -   [Project Config](./#project-config)
    -   [Test Drivers](./#test-drivers)
    -   [Test Hooks](./#test-hooks)
-   [Benchmark Results](./#benchmark-results)

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

| Drivers                             | cases | threads | sandbox | performance | stability |
| ----------------------------------- | ----- | ------- | ------- | ----------- | --------- |
| **puppeteer/Firefox/Chrome/Safari** | 1600  | 1       |         | 1312.125s   | ✅         |
| **puppeteer**                       | 400   | 8       |         | 96.44s      | ✅         |
| puppeteer                           | 400   | 1       |         | 237.614s    | ✅         |
| puppeteer                           | 400   | 8       | ✅       | 289.44s     | ✅         |
| Chrome                              | 400   | 8       |         | 103.665s    | ✅         |
| Firefox                             | 400   | 8       |         | 415.726s    | ✅         |
| puppeteer/Firefox/Chrome            | 1200  | 8       |         | 630.503s    | ⚠️        |
| Safari                              | 400   | 8       |         | -           | ❌         |
| Enzyme                              | 400   | 1       | ✅       | 374.998s    | ✅         |
| **Enzyme**                          | 400   | 8       | ✅       | 149.882s    | ✅         |
| Enzyme                              | 400   | 1       |         | -           | ❌         |

> `Chrome` is selenium webdriver's Chrome.</br>
> Selenium webdriver multithreading operation is not stable.</br>
> Selenium Webdriver Safari does not support multithreading.</br>
> Enzyme does not support non-sandbox mode(Default forced sandbox mode).