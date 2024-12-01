import fs from 'fs';
import path from 'path';

// Path to your folder containing the components
const componentsPath = '/Users/abdulkanu/ResumePRO/ResumePro_Project/frontend/src/resume_templates';
const files = fs.readdirSync(componentsPath);


const exportStatements = files
  .filter((file) => file.endsWith('.jsx') || file.endsWith('.js'))
  .map((file) => {
    const componentName = path.basename(file, path.extname(file));
    return `export { default as ${componentName} } from './${componentName}';`;
  })
  .join('\n');

// Write the export statements to an index.js file
fs.writeFileSync(path.join(componentsPath, 'index.js'), exportStatements, 'utf-8');

console.log('index.js file generated successfully!');
