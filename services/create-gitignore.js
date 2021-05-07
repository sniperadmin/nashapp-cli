import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import gitignore from 'gitignore';

const writeGitignore = promisify(gitignore.writeFile);

export async function createGitIgnore(options) {
  const file = await fs.createWriteStream(
    path.join(options.targetDirectory, '.gitignore'),
    { flags: 'a' }
  );

  return writeGitignore({
    type: 'Node',
    file
  })
}
