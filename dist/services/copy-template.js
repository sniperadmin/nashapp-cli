import { promisify } from 'util';
import ncp from 'ncp';
const copy = promisify(ncp);
export async function copyTemplateFiles(options) {
    console.log('copy-template from: ', options);
    return copy(options.templateDirectory, options.targetDirectory, {
        clobber: false,
    });
}
