const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: "./src/simple-router.js",
  output: {
    filename: "simple-router.min.js",
    publicPath: "",
    path: path.resolve("dist/js")
  },
  devtool: "eval"
};
