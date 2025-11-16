const vm = require('vm');
const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, 'script.js');
const scriptContent = fs.readFileSync(scriptPath, 'utf8');

const sandbox = {
    window: { document: {} },
    localStorage: {},
    console: console,
    alert: () => {},
    confirm: () => {},
    prompt: () => {}
};

try {
    vm.createContext(sandbox);
    vm.runInContext(scriptContent, sandbox);
    console.log('Script syntax is valid');
} catch (error) {
    console.error('Syntax error:', error.message);
    console.error('At line:', error.lineNumber, 'column:', error.columnNumber);
}