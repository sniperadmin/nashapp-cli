import arg from 'arg';
import inquirer from 'inquirer';
import { createProject } from './main'
// const responsiveVoice = require('responsive-voice-node');

var vm = require("vm");
var fs = require("fs");


function parseArguments(rawArgs) {
  const args = arg(
    {
      '--git': Boolean,
      '--yes': Boolean,
      '--install': Boolean,
      '-g': '--git',
      '-y': '--yes',
      '-i': '--install',
    },
    {
      argv: rawArgs.slice(2),
    }
  );

  return {
    skipPrompts: args['--yes'] || false,
    git: args['--git'] || false,
    template: args._[0],
    runInstall: args['--install'] || false,
  }
}

async function promptOptions(options) {
  const defaultTemplate = 'JavaScript';
  if (options.skipPrompts) {
    return {
      ...options,
      template: options.template || defaultTemplate,
    }
  }

  const questions = [];
  if (!options.template) {
    questions.push({
      type: 'list',
      name: 'template',
      message: 'Please choose a template',
      choices: ['JavaScript', 'TypeScript', 'vuejs', 'vitejs'],
      default: defaultTemplate
    });
  }

  // Git
  if (!options.git) {
    questions.push({
      type: 'confirm',
      name: 'git',
      message: 'Initialize Git for the project?',
      default: false
    });
  }

  const answers = await inquirer.prompt(questions);
  return {
    ...options,
    template: options.template || answers.template,
    git: options.git || answers.git,
  }
}

export async function cli(args) {
  // responsiveVoice.speak('hi there...', 'UK English Male')
  let options = parseArguments(args);
  options = await promptOptions(options);
  await createProject(options)
}
