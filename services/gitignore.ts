/**
 * TODO: later I will enable code...
 * script is using internet connection, so it won't work offline
 */
// import fs from 'fs';
// import path from 'path';
import { promisify } from 'util';
const gitignore = require('gitignore');

// const writeGitignore = promisify(gitignore.writeFile);

export async function createGitIgnore(options: any) {
  // const file = await fs.createWriteStream(
  //   path.join(options.targetDirectory, '.gitignore'),
  //   { flags: 'a' }
  // );

  // return writeGitignore({
  //   type: 'Node',
  //   file
  // })
}
