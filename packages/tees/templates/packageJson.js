{
  "name": "${projectName}",
  "version": "${projectVersion}",
  "description": "${description}",
  "main": "${mainFile}",
  "scripts": {
    "test": "npx tees run ./src/example.spec.js -D puppeteer -S"
  },
  "dependencies": {
    "tees": "${teesVersion}"
  },
  "license": "${license}"
}
