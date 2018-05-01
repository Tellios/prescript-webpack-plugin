const fs = require('fs');
const path = require('path');
const os = require('os');
const process = require('process');

const fileLines = [
    '"use strict"',
    '',
    'module.exports = () => {',
    '  console.log("Prescript created this!");',
    '};',
    ''
];

console.log('Args to node scriptFile:', process.argv.slice(2));

const filePath = path.resolve(__dirname, 'code.generated.js');
const fileContents = fileLines.join(os.EOL);
const fileTime = Date.now() / 1000 - 20;

fs.writeFile(filePath, fileContents, err => {
    if (err) {
        process.exit(1);
    }

    fs.utimes(filePath, fileTime, fileTime, err => {
        if (err) {
            process.exit(1);
        }
    });
});
