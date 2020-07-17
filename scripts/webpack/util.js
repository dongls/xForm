const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { RELEASE_PACKAGE } = require('./args');

const { packages } = require('../packages')

module.exports = {
  genCssLoader(IS_PRODUCTION){
    return [
      IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'vue-style-loader',
      'css-loader',
      'postcss-loader'
    ]
  },
  genScssLoader(IS_PRODUCTION){
    return [
      IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'vue-style-loader',
      'css-loader',
      'postcss-loader',
      'sass-loader'
    ];
  },
  genLessLoader(IS_PRODUCTION){
    return [
      IS_PRODUCTION ? MiniCssExtractPlugin.loader : 'vue-style-loader',
      'css-loader',
      'postcss-loader',
      'less-loader'
    ];
  },
  genPackageProps(){
    const rp = RELEASE_PACKAGE;

    return {
      entry: packages[rp],
      packageName: `@dongls/xform${rp == 'core' ? '' : '.' + rp}`,
      outPath: path.resolve(__dirname, '../../packages', rp, 'dist'),
      library: rp == 'core' ? 'XForm' : ['XForm', rp]
    }
  }
}