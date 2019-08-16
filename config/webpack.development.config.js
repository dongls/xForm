const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'development',
  entry: ['./example/index.js'],
  devServer: {
    port: 8000,
    publicPath: '/',
    hot: true,
    hotOnly: true,
    historyApiFallback: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './example/index.html',
      filename: './index.html'
    })
  ]
})