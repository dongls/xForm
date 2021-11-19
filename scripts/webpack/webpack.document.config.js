const { IS_PRODUCTION, NODE_ENV } = require('../args')

const path = require('path')

const { merge } = require('webpack-merge')
const { genHtmlWebpackPlugin } = require('../utils')

const baseConfig = require('./webpack.base.config')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const common = {
  mode: NODE_ENV,
  entry: ['./document/index.ts'],
  resolve: {
    alias: {
      '@config': path.resolve(__dirname, `../env/${NODE_ENV}.js`)
    }
  },
  module: {
    rules: [{
      test: /\.md$/,
      use: [
        'html-loader',
        path.resolve(__dirname, './loaders/markdown-loader')
      ]
    }]
  }
}

const development = {
  devServer: {
    historyApiFallback: true,
    host: '127.0.0.1',
    static: {
      directory: path.join(__dirname, '../../docs'),
      publicPath: '/docs'
    },
    open: true,
    port: 8801,
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
    new HtmlWebpackPlugin({
      template: './document/index.html',
      filename: './index.html'
    })
  ],
  experiments: {
    lazyCompilation: {
      entries: false,
    }
  },
  watchOptions: {
    aggregateTimeout: 300
  }
}

const production = {
  output: {
    path: path.resolve(__dirname, '../../docs'),
    publicPath: require(`../env/${NODE_ENV}.js`).website.base,
    filename: '[name].[contenthash:8].js',
    clean: { keep: /libs\// }
  },
  resolve: {
    alias: {
      '@dongls/xform': path.resolve(__dirname, '../../packages/core/index')
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false
      }),
      new CssMinimizerPlugin()
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].css'
    }),
    genHtmlWebpackPlugin('./index.html')
  ]
}

module.exports = merge(baseConfig, common, IS_PRODUCTION ? production : development)