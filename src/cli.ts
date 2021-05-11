const arg = require('arg');
const inquirer = require('inquirer');
import { createProject } from './main'
// const responsiveVoice = require('responsive-voice-node');
// import { Options } from '../interfaces/options'

function parseArguments(rawArgs: string) {
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

async function promptOptions(options: any) {
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
      choices: ['JavaScript', 'TypeScript', 'VueJs', 'ViteJs'],
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

  const results = await inquirer.prompt(questions)
    .then(async (ans: any) => {
      // console.log(ans);
      if (ans.template === 'VueJs') {
        const vueres = await inquirer.prompt([
          {
            type: 'list',
            name: 'childTemplate',
            message: 'Choose a Vue boilerplate to start with?',
            choices: ['Vue3-Basic', 'Vue3-SSR', 'TypeScript'],
            default: 'Vue3Basic'
          }
        ])

        return {
          ...options,
          template: options.template || ans.template,
          git: options.git || ans.git,
          childTemplate: options.childTemplate || vueres.childTemplate,
        }
      } else if (ans.template === 'ViteJs') {
        const viteres = await inquirer.prompt([
          {
            type: 'list',
            name: 'childTemplate',
            message: 'Choose a boilerplate to start with?',
            choices: ['JS', 'TS', 'SSR-Vue'],
            default: 'JS'
          }
        ])

        return {
          ...options,
          template: options.template || ans.template,
          git: options.git || ans.git,
          childTemplate: options.childTemplate || viteres.childTemplate,
        }
      }

      return {
        ...options,
        template: options.template || ans.template,
        git: options.git || ans.git,
      }
    });

    return results
}

export async function cli(args: string) {
  // responsiveVoice.speak('hi there...', 'UK English Male')
  let options = parseArguments(args);
  options = await promptOptions(options);
  await createProject(options)
}
