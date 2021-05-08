// packages
import chalk from 'chalk';
import fs from 'fs';
import { promisify } from 'util';
import { projectInstall } from 'pkg-install'
import Listr from 'listr';

// services and functions
import { copyTemplateFiles } from '../services/copy-template';
import { initGit } from '../services/init-git';
import { createGitIgnore } from '../services/create-gitignore';
import { createLicense } from '../services/create-lis';
import { templateDir } from '../services/get-child-path';

const access = promisify(fs.access);

// main boilerplate creation
export async function createProject(options: any) {
  // add targetDirectory definition to options object
  options = {
    ...options,
    targetDirectory: options.targetDirectory || process.cwd(),
  };

  console.log('options from the createProject() => ', options);

  // cache current file directory
  const currentFileUrl = import.meta.url;

  // get child path for the correct boilerplate
  const finalTemplateDir = templateDir(options, currentFileUrl, options.template)

  options.templateDirectory = finalTemplateDir;

  // try accessing to verify if we can access templates directory
  try {
    await access(finalTemplateDir, fs.constants.R_OK);
  } catch (err) {
    console.error('%s Invalid template name', chalk.red.bold('ERROR'));
    process.exit(1);
  }

  // showing progress
  const tasks = new Listr([
    {
      title: 'Copying project files ...',
      task: () => copyTemplateFiles(options)
    },
    {
      title: 'initializing git ...',
      task: () => initGit(options),
      enabled: () => options.git
    },
    {
      title: 'Creating gitignore ...',
      task: () => createGitIgnore(options)
    },
    {
      title: 'Creating license ...',
      task: () => createLicense(options)
    },
    {
      title: 'installing dependencies...',
      task: () => projectInstall({ cwd: options.targetDirectory }),
      skip: () => !options.runInstall ?
        'Pass --install to automatically install dependencies'
        : undefined,
    }
  ])

  await tasks.run()

  console.log('%s Project ready', chalk.green.bold('DONE'));
  return true;
}
