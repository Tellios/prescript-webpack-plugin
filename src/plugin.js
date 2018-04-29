const runNodeScript = require("./runNodeScript");
const path = require("path");

function PrescriptWebpackPlugin() {}

PrescriptWebpackPlugin.prototype.apply = function(compiler) {
  compiler.hooks.beforeCompile.tapAsync(
    "beforeCompile",
    (hookCompiler, callback) => {
      runNodeScript(
        compiler.context,
        path.resolve(compiler.context, "test", "test-prescript.js")
      );
      callback();
    }
  );
};

module.exports = PrescriptWebpackPlugin;
