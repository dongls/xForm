const path = require('path')
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = merge(baseConfig, {
  entry: {
    'example': ['./example/index.js']
  },
  output: {
    // path: path.resolve(__dirname, '../docs/example'),
    path: path.resolve(__dirname, '../docs'),
    // publicPath: '/example/',
    filename: '[name].[hash:8].js'
  },
  plugins: [
    new CleanWebpackPlugin(),
    new OptimizeCSSPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css',
      chunkFilename: '[name].[hash:8].css'
    }),
    new HtmlWebpackPlugin({
      template: './example/index.html',
      filename: 'index.html',
    })
  ],
  performance: {
    hints: false
  }
})