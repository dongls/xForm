const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: ['./example/index.js'],
  devServer: {
    port: 8000,
    publicPath: '/',
    hot: true,
    open: true,
    stats: {
      modules: false,
      entrypoints: false,
      children: false
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin({
      // Options...
    }),
    new HtmlWebpackPlugin({
      template: './example/index.html',
      filename: './index.html'
    })
  ]
})