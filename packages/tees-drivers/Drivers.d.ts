interface $ {
    getText(selector: string, options?: Object): string
    getNewOpenPage() : Page
    clickToGetNewOpenPage(selector: string, browser: Browser, options ?: Object): Page
    getTexts(selector: string, options?: Object): Array<string>
    getAttribute(selector: string, attribute: string, options?: Object): string
    getProperty(selector: string, property: string, options?: Object): string
    getValue(selector: string, options: Object): string
    html(selector: string): string
    url(): sting
    click(selector: string, options?: Object): string
    hover(selector: string, options?: Object): string
    type(selector: string, value: string, options?: Object): string
    waitForSelector(selector: string, options?: Object): Promise<?ElementHandle>
    waitForFrames(frameSelectors: string): Frame
    waitForFunction(fn:function|string, ...args?: Serializable|JSHandle): void
    screenshot({ path }: string): string
    goto(url: string, options?: Object): void
    execute(...args?: Serializable|JSHandle): Promise<Serializable>
    clear(selector: string, options?: Object): void
    $(selector: string, options?: Object): Promise<?ElementHandle>
    $$(selector: string, options?: Object): Promise<Array<ElementHandle>>
    reload():void
    closePage(options?: Object):void
   }
   interface $_Static {
    (node: Object):$
   }
   declare var $:$_Static