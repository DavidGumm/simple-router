const path = require("path");

module.exports = {
  entry: "./src",
  output: {
    path: path.resolve(__dirname, "dist/js"),
    filename: "simple-router.min.js",
    publicPath: "/js/"
  },
  devtool: "source-map"
};
