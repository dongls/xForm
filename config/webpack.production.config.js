/** @author dongls */
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const RELEASE_ES2015 = process.env.RELEASE_TARGET == 'ES2015';
const PUBLIC_PATH = RELEASE_ES2015 ? '/dist/modern/' : '/dist/'
const OUT_PATH = path.resolve(__dirname, `..${PUBLIC_PATH}`)

module.exports = merge(baseConfig, {
  entry(){
    return (
      RELEASE_ES2015
        ? {
          'core': './src/index.js',
          'element': './packages/element-ui/index.js'
        }
        : {
          'core': ['./src/index.css', './src/index.js'],
          'element': ['./packages/element-ui/index.scss', './packages/element-ui/index.js']
        }
    )
  },
  externals: [
    function(context, request, callback) {
      if (/^@dongls\/xform$/.test(request)){
        return callback(null, `root __xform_shared_${process.env.RELEASE_VERSION.replace(/\./g, '_')}__`);
      }
      callback();
    }
  ],
  output: {
    path: OUT_PATH,
    // publicPath: PUBLIC_PATH,
    filename: 'xform.[name].js',
    library: ['XForm', '[name]'],
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },
  plugins: [
    RELEASE_ES2015 ? undefined : new CleanWebpackPlugin(),
    new OptimizeCSSPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/xform.[name].css',
      // chunkFilename: 'css/[name].css'
    }),
    new webpack.BannerPlugin({
      banner: `XForm.[name] v${process.env.RELEASE_VERSION} (https://github.com/dongls/xForm)\nCopyright 2019 dongls\nReleased under the MIT License`
    })
  ].filter(p => null != p)
})