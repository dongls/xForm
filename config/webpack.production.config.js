const webpack = require('webpack')
const merge = require('webpack-merge');
const baseConfig = require('./webpack.base.config');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

const RELEASE_ES2015 = process.env.RELEASE_TARGET == 'ES2015';

// TODO: 改进打包机制，可在线引入
module.exports = merge(baseConfig, {
  entry(){
    return (
      RELEASE_ES2015
        ? {
          'xform.modern': './src/index.js',
          'xform.element-ui.modern': './packages/element-ui/index.js'
        }
        : {
          'xform': ['./src/index.css', './src/index.js'],
          'xform.element-ui': ['./packages/element-ui/index.scss', './packages/element-ui/index.js']
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
    publicPath: '/dist/',
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    libraryExport: 'default',
    umdNamedDefine: true
  },
  plugins: [
    RELEASE_ES2015 ? undefined : new CleanWebpackPlugin(),
    new OptimizeCSSPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[name].css'
    }),
    new webpack.BannerPlugin({
      banner: `[name] v${process.env.RELEASE_VERSION} (https://github.com/dongls/xForm)\nCopyright 2019 dongls\nReleased under the MIT License`
    })
  ].filter(p => null != p)
})