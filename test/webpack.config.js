const path = require("path");
const PrescriptWebpackPlugin = require("../src/plugin");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "webpack-entry.js"),
  output: {
    path: path.resolve(__dirname, "test-dist"),
    filename: "bundle.js"
  },
  watchOptions: {
    aggregateTimeout: 300,
    poll: 1000
  },
  plugins: [new PrescriptWebpackPlugin()]
};
