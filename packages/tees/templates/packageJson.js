{
  "name": "${projectName}",
  "version": "${projectVersion}",
  "description": "${description}",
  "main": "${mainFile}",
  "scripts": {
    "testExample": "tees run ./src/example.js --params '' -D -S --testerCLI '--clearCache' --drivers puppeteer",
  },
  "dependencies": {
    "tees": "${teesVersion}"
  },
  "license": "${license}"
}
