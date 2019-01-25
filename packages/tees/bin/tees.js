#!/usr/bin/env node

const commander = require('commander');
const info = require('../package');
const { run } = require('../src/run');
const { create, update, mkdir } = require('../src/lib/fetchCase');
const split = require('../src/utils/split');
const { modes } = require('../src/lib/modes');

commander
  .version(info.version)
  .usage('<command> [options]');

commander
  .command('run [dir...]')
  .description('Run E2E test specified case.')
  .option('-P, --params <paramsInfo>', 'Run E2E test case with some params filtering.')
  .option('-A, --verbose', 'Run E2E test case with verbose log.')
  .option('-R, --reporter', 'Run E2E test case with reporter.')
  .option('-E, --exclude <exclude>', 'Run E2E test case exclude some files.', split)
  .option('-D, --drivers <drivers>', 'Run E2E test case with some drivers.', split)
  .option('-C, --testerCLI <testerCLI>', 'Run E2E test case with testerCLI args.', split)
  .option('-T, --retry [retry]', 'Run E2E test case with retry times.')
  .option(modes.sandbox.flags, modes.sandbox.description)
  .option(modes.headless.flags, modes.headless.description)
  .option(modes.debugger.flags, modes.debugger.description)
  .action(run);

/**
 * E2E support create test case template file from custom cases server.
 */
commander
  .command('create')
  .arguments('[caseID]')
  .description('Create Case from caseServices.')
  .option('-S, --service <service>', 'Create case template with those service params.')
  .option('-O, --origin <origin>', 'Create case template with origin.')
  .action(create);

commander
  .command('update')
  .arguments('[caseID]')
  .description('Update Case from caseServices.')
  .option('-S, --service <service>', 'Update case template with service params.')
  .option('-O, --origin <origin>', 'Update case template with origin.')
  .action(update);

commander
  .command('mkdir')
  .description('make directory')
  .option('-S, --service <service>', '')
  .option('-O, --origin <origin>', '')
  .action(mkdir);

commander.parse(process.argv);

if (!commander.args.length) {
  commander.help();
}
