var path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
var webpack = require("webpack");
var BundleTracker = require("webpack-bundle-tracker");
var OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
  entry: ["babel-polyfill", "./dublin_bus/static/js/index.js"],
  output: {
    path: path.resolve(__dirname, "dist")
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: ["babel-loader"]
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader"
        ]
      }
    ]
  },
  plugins: [
    new BundleTracker({ filename: "./webpack-stats.json" }),
    new CleanWebpackPlugin("dist", {}),
    new MiniCssExtractPlugin({
      filename: "styles.css"
    })
  ]
  // watch: true
};
