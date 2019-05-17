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

function mkDirSync (dirPath) {
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

async function initProject(projectName,  cmd) {
    mkDirSync(path.join(process.cwd(), projectName));
    mkDirSync(path.join(process.cwd(), `${projectName}/src`));
    fs.readFile(path.join(__dirname, '../../templates/e2eConfig.js'), 'utf-8', async (err, data) => {
      if (err) throw err;
      const configObj = {
        projectName
      }
      const result = compile({
        template: data.toString(),
        keys: Object.keys(configObj),
        values: Object.values(configObj),
      });
      fs.writeFile(path.join(process.cwd(), `${projectName}/e2e.config.js`), result, 'ascii', (err) => {
        if (err) throw err;
      });
    });

    fs.readFile(path.join(__dirname, '../../templates/package.json'), 'utf-8', async (err, data) => {
      if (err) throw err;
      const promptAnswers = await getPromptAnswers();
      const packageObj = {
        projectName,
        mainFile : 'index.js',
        teesVersion : "^1.0.0-alpha.31",
        ...promptAnswers
      }
      
      const result = compile({
        template: data.toString(),
        keys: Object.keys(packageObj),
        values: Object.values(packageObj),
      });
      fs.writeFile(path.join(process.cwd(), `${projectName}/package.json`), result, 'ascii', (err) => {
        if (err) throw err;
      });
    });
}


module.exports = {
  initProject,
};
