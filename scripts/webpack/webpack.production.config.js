const { RELEASE_VERSION } = require('./args')

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const util = require('./util')
const baseConfig = require('./webpack.base.config')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const props = util.genPackageProps()

module.exports = merge(baseConfig, {
  mode: 'production',
  entry: props.entry,
  externals: {
    'vue': {
      root: 'Vue',
      commonjs: 'vue',
      commonjs2: 'vue',
      amd: 'vue'
    },
    '@dongls/xform': {
      root: 'XForm',
      commonjs: '@dongls/xform',
      commonjs2: '@dongls/xform',
      amd: '@dongls/xform'
    }
  },
  output: {
    path: props.outPath,
    filename: 'index.js',
    library: props.library,
    libraryExport: props.libraryExport,
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  stats: {
    modules: false,
    children: false,
    entrypoints: false
  },
  plugins: [
    new CleanWebpackPlugin(),
    new OptimizeCSSPlugin(),
    new MiniCssExtractPlugin({
      filename: 'index.css',
    }),
    new webpack.BannerPlugin({
      banner: `${props.packageName} v${RELEASE_VERSION} (https://github.com/dongls/xForm)\nCopyright 2019-present dongls\nReleased under the MIT License`
    })
  ]
})