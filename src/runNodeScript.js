const { spawn } = require("child_process");
const process = require("process");

module.exports = function(workingDirectory, scriptFile) {
  return new Promise((resolve, reject) => {
    const child = spawn("node", [scriptFile], {
      cwd: workingDirectory,
      stdio: "inherit"
    });

    child.on("close", code => {
      if (code !== 0) {
        reject(new Error(`Script failed with exit code: ${code}`));
        return;
      }

      resolve();
    });
  });
};
