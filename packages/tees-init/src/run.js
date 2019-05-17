const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');

function compile({
  keys,
  values,
  template,
}) {
  const renderTemplate = new Function(...keys, `return \`${template}\``);
  return renderTemplate(...values);
}

function ensureDirSync (dirPath) {
  try {
    fs.mkdirSync(dirPath, { recursive: true })
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
    console.log('Dir exist!');
  }
}

async function getPromptAnswers() {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'projectVersion',
        message: 'project version:',
        default: '1.0.0',
      },
      {
          type: 'input',
          name: 'description',
          message: 'description:',
      },
      {
        type: 'input',
        name: 'license',
        message: 'license:',
        default: 'MIT',
      }
    ]);
    return answers;
}

async function run(projectName,  cmd) {
    ensureDirSync(path.join(process.cwd(), projectName));
    ensureDirSync(path.join(process.cwd(), `${projectName}/src`));
    fs.readFile(path.join(__dirname, './e2eConfigTemplate.js'), 'utf-8', async (err, data) => {
      template = data.toString();
      const configObj = {
        projectName
      }
      const result = compile({
        template,
        keys: Object.keys(configObj),
        values: Object.values(configObj),
      });
      fs.writeFile(path.join(process.cwd(), `${projectName}/e2e.config.js`), result, 'ascii', (err) => {
        if (err) throw new Error(err);
      });
    });

    fs.readFile(path.join(__dirname, './packageTemplate.js'), 'utf-8', async (err, data) => {
      template = data.toString();
      const promptAnswers = await getPromptAnswers();
      const packageObj = {
        projectName,
        mainFile : 'index.js',
        teesVersion : "^1.0.0-alpha.31",
        ...promptAnswers
      }
      
      const result = compile({
        template,
        keys: Object.keys(packageObj),
        values: Object.values(packageObj),
      });
      fs.writeFile(path.join(process.cwd(), `${projectName}/package.json`), result, 'ascii', (err) => {
        if (err) throw new Error(err);
      });
    });
}


module.exports = {
  run,
};