// GenerateTemplates.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname and __filename
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths to directories
const templatesDir = path.join(__dirname, 'resume_templates');
const imagesDir = path.join(__dirname, 'images');
const outputFile = path.join(__dirname, 'templates.js');

// Read template and image files
const templateFiles = fs.readdirSync(templatesDir)
  .filter((file) => file.endsWith('.jsx'))
  .sort();
const imageFiles = fs.readdirSync(imagesDir)
  .filter((file) => /\.(jpg|jpeg|png)$/i.test(file))
  .sort();

if (templateFiles.length !== imageFiles.length) {
  console.error('The number of template components and images does not match.');
  process.exit(1);
}

// Generate import statements for images
const imageImports = imageFiles.map((imageFile, index) => {
  const importName = `image${index + 1}`;
  return `import ${importName} from './images/${imageFile}';`;
}).join('\n');

// Generate the templates array with componentPath included
const templates = templateFiles.map((templateFile, index) => {
  const templateName = path.basename(templateFile, '.jsx');
  const imageImportName = `image${index + 1}`;
  const componentImportName = `template${index + 1}Component`;
  const componentPath = `./resume_templates/${templateFile}`; // Include componentPath

  return {
    id: `template${index + 1}`,
    name: `Template ${index + 1}`,
    previewImage: imageImportName,
    component: componentImportName,
    componentPath: componentPath, // Include componentPath
  };
});

// Generate import statements for components using componentPath
const componentImports = templates.map((template) => {
  const { component, componentPath } = template;
  return `const ${component} = lazy(() => import('${componentPath}'));`;
}).join('\n');

// Generate the templates array as a string
const templatesArray = templates.map((template) => `{
  id: '${template.id}',
  name: '${template.name}',
  previewImage: ${template.previewImage},
  component: ${template.component},
}`).join(',\n');

// Combine all parts into the final file content
const fileContent = `
import React, { lazy } from 'react';

${imageImports}

${componentImports}

export const templates = [
  ${templatesArray}
];
`;

fs.writeFileSync(outputFile, fileContent);

console.log('Templates array generated successfully!');
