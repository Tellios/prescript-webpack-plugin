const runNodeScript = require("./runNodeScript");

function PrescriptWebpackPlugin() {}

PrescriptWebpackPlugin.prototype.apply = function(compiler) {
  compiler.hooks.beforeCompile.tapAsync(
    "beforeCompile",
    (compiler, callback) => {
      //   runNodeScript(compiler.)
      console.log(compiler);
      callback();
    }
  );
};

module.exports = PrescriptWebpackPlugin;
