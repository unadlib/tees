const fs = require('fs');
const path = require('path');
const inquirer = require('inquirer');
const chalk = require('chalk');

function compile({
  keys,
  values,
  template,
}) {
  const renderTemplate = new Function(...keys, `return \`${template}\``);
  return renderTemplate(...values);
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

async function initProject(projectName) {
  try {
    const directoryExist = fs.existsSync(path.join(process.cwd(), projectName));
    if (directoryExist) throw chalk.red('directory exist!');
    fs.mkdirSync(path.join(process.cwd(), projectName));
    fs.mkdirSync(path.join(process.cwd(), `${projectName}/src`));

    const e2eConfigTemplate = fs.readFileSync(path.join(__dirname, '../../templates/e2eConfig.js'), 'utf-8').toString();
    const configObj = {
      projectName
    }
    const e2eConfigResult = compile({
      template: e2eConfigTemplate,
      keys: Object.keys(configObj),
      values: Object.values(configObj),
    });
    fs.writeFileSync(path.join(process.cwd(), `${projectName}/e2e.config.js`), e2eConfigResult, 'ascii');

    const packageTemplate = fs.readFileSync(path.join(__dirname, '../../templates/packageJson.js'), 'utf-8').toString();
    const promptAnswers = await getPromptAnswers();
    const packageObj = {
      projectName,
      mainFile : 'index.js',
      teesVersion : "latest",
      ...promptAnswers
    }
    const result = compile({
      template: packageTemplate,
      keys: Object.keys(packageObj),
      values: Object.values(packageObj),
    });
    fs.writeFileSync(path.join(process.cwd(), `${projectName}/package.json`), result, 'ascii');
    console.log(chalk.green('Init project successfully!'));
  } catch (error) {
    throw error;
  }
}

module.exports = {
  initProject,
};
