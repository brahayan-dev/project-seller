const path = require("path");

module.exports = {
  target: "node",
  entry: "./source/main.ts",
  mode: "production",
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      "@": path.resolve(__dirname, "source/commons"),
      "@sales": path.resolve(__dirname, "source/sales"),
    },
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "build"),
  },
};
