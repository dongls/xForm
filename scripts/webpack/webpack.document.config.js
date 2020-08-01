const { IS_PRODUCTION, NODE_ENV } = require('./args')

const path = require('path')
const webpack = require('webpack')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const common = {
  mode: NODE_ENV,
  entry: ['./document/index.ts'],
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, `../env/${NODE_ENV}.js`)
    }
  }
}

const development = {
  devServer: {
    port: 8801,
    publicPath: '/',
    hot: true,
    open: true,
    historyApiFallback: true,
    stats: {
      modules: false,
      entrypoints: false,
      children: false
    }
  },
  output: {
    publicPath: '/',
  },
  resolve: {
    alias: {
      '@dongls/xform': path.resolve(__dirname, '../../packages/core/index')
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './document/index.html',
      filename: './index.html'
    })
  ]
}

const production = {
  output: {
    path: path.resolve(__dirname, '../../docs'),
    publicPath: require(`../env/${NODE_ENV}.js`).website.base,
    filename: '[name].[hash:8].js'
  },
  resolve: {
    alias: {
      '@dongls/xform': path.resolve(__dirname, '../../packages/core/index')
    }
  },
  plugins: [
    new CleanWebpackPlugin(),
    new OptimizeCSSPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css',
      chunkFilename: '[name].[hash:8].css'
    }),
    new HtmlWebpackPlugin({
      template: './document/index.html',
      filename: './index.html',
    }),
    new HtmlWebpackPlugin({
      template: './document/index.html',
      filename: './404.html',
    })
  ],
  stats: {
    modules: false,
    children: false
  }
}

module.exports = merge(baseConfig, common, IS_PRODUCTION ? production : development)