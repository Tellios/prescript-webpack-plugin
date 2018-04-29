const fs = require("fs");
const path = require("path");
const os = require("os");
const process = require("process");

const fileContents = [
  '"use strict"',
  "",
  "module.exports = () => {",
  '  console.log("Prescript created this!");',
  "};",
  ""
];

fs.writeFile(
  path.resolve(__dirname, "generatedCode.js"),
  fileContents.join(os.EOL),
  err => {
    if (err) {
      process.exit(1);
    }
  }
);
