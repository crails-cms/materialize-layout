const path = require("path");

module.exports = {
  entry: ["./javascripts/index.js"],
  output: {
    path: path.resolve(__dirname, "build/javascripts"),
    filename: "bundle.js"
  }
};
