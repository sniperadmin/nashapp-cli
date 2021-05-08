import path from 'path';
const license = require('spdx-license-list/licenses/MIT');
import { promisify } from 'util';
import fs from 'fs';
const writeFile = promisify(fs.writeFile);
export async function createLicense(options) {
    const targetPath = path.join(options.targetDirectory, 'LICENSE');
    const lsContent = license.licenseText
        .replace('<year>', new Date().getFullYear())
        .replace('<copyright holders>', `${options.name} (${options.email})`);
    return writeFile(targetPath, lsContent, 'utf8');
}
