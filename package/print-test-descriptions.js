const fs = require('fs');
const { parse } = require('@babel/parser');
const traverse = require('@babel/traverse').default;

// Function to extract test descriptions from a file
function extractTestDescriptions(filePath) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Parse the file content into AST
  const ast = parse(fileContent, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  const testDescriptions = [];

  // Traverse the AST to find test descriptions
  traverse(ast, {
    CallExpression(path) {
      if (
        path.node.callee.type === 'Identifier' &&
        path.node.callee.name === 'test'
      ) {
        const testName = path.node.arguments[0].value;
        testDescriptions.push(testName);
      }
    }
  });

  return testDescriptions;
}

// Function to extract test descriptions from all test files in a directory
function extractAllTestDescriptions(directoryPath) {
  const files = fs.readdirSync(directoryPath);

  const allTestDescriptions = [];

  files.forEach(file => {
    const filePath = `${directoryPath}/${file}`;
    if (fs.statSync(filePath).isFile() && file.endsWith('.test.js')) {
      const testDescriptions = extractTestDescriptions(filePath);
      allTestDescriptions.push(...testDescriptions);
    }
  });

  return allTestDescriptions;
}

// Directory containing test files
const testDirectory = 'src/views/__test__';

// Extract and print all test descriptions
const allTestDescriptions = extractAllTestDescriptions(testDirectory);
console.log('All Test Descriptions:');
allTestDescriptions.forEach((description, index) => {
  console.log(`${index + 1}. ${description}`);
});
