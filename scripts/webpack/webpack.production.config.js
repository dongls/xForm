const { RELEASE_VERSION, RELEASE_TARGET } = require('../args')

const webpack = require('webpack')
const { merge } = require('webpack-merge')
const utils = require('../utils')
const baseConfig = require('./webpack.base.config')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const props = utils.genPackageProps()

const common = {
  mode: 'production',
  optimization: {
    minimizer: [
      RELEASE_TARGET == 'bundler' ? null : new TerserPlugin({
        extractComments: false,
        terserOptions: {
          keep_classnames: true
        }
      }),
      new CssMinimizerPlugin()
    ].filter(i => i)
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

const umd = {
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
    library: {
      name: props.library,
      export: props.libraryExport,
      type: 'umd',
      umdNamedDefine: true
    }
  }
}

const esm = {
  entry: props.entry,
  externals: {
    '@dongls/xform': '@dongls/xform',
    'vue': 'vue'
  },
  output: {
    path: props.outPath,
    filename: 'index.esm.js',
    module: true,
    library: {
      type: 'module'
    },
    environment: {
      module: true
    },
  },
  experiments: {
    outputModule: true
  }
}

const bundler = {
  entry: props.entry,
  externals: {
    '@dongls/xform': '@dongls/xform',
    'vue': 'vue'
  },
  output: {
    path: props.outPath,
    filename: 'index.bundler.js',
    module: true,
    library: {
      type: 'module'
    },
    environment: {
      module: true
    },
  },
  experiments: {
    outputModule: true
  },
}

const targets = {
  umd,
  esm,
  bundler
}

module.exports = merge(baseConfig, common, targets[RELEASE_TARGET] ?? targets.umd)