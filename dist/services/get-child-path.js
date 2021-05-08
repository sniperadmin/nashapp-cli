import path from 'path';
export const templateDir = (options, fileUrl, parentTemplate) => path.resolve(new URL(fileUrl).pathname.slice(1), //slice for windows
options.childTemplate ? `../../templates/${parentTemplate}` : '../../templates', options.childTemplate ? options.childTemplate.toLowerCase() : options.template.toLowerCase());
