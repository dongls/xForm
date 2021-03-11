const { RELEASE_VERSION, RELEASE_TARGET } = require('./args')

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const util = require('./util')
const baseConfig = require('./webpack.base.config')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const props = util.genPackageProps()

const common = {
  mode: 'production',
  entry: props.entry,
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
      filename: 'index.css',
    }),
    new webpack.BannerPlugin({
      banner: `${props.packageName} v${RELEASE_VERSION} (https://github.com/dongls/xForm)\nCopyright 2019-present dongls\nReleased under the MIT License`
    })
  ]
}

// TODO: webpack输出`ESM`时不支持设置`externals`，待升级后处理
const esm = {
  externals: {
    '@dongls/xform': {
      root: 'XForm',
      commonjs: '@dongls/xform',
      commonjs2: '@dongls/xform',
      amd: '@dongls/xform'
    }
  },
  output: {
    path: props.outPath,
    filename: 'index.mjs',
    libraryTarget: 'module',
    clean: true,
    module: true,
    environment: {
      module: true
    }
  },
  experiments: {
    outputModule: true
  }
}

const umd = {
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
    umdNamedDefine: true,
    clean: true
  }
}

module.exports = merge(baseConfig, common, RELEASE_TARGET == 'ESM' ? esm : umd)